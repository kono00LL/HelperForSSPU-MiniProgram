# 业务流程

**应用启动流程**

1. 应用启动，进入 App.onLaunch。
2. 读取本地 userInfo，检查 refresh_token 是否存在。（在认证守卫里完成）
3. 若 refresh_token 不存在，立刻 reLaunch 到 /pages/login/login。（登出，重新登录）
4. 若存在，则判断 refresh_token_expires_at：
   已过期：清空本地缓存，reLaunch 登录页。（登出，重新登录）
   未过期：调用 /user/refresh。
5. 刷新成功：更新 access_token 与过期时间，写回 store 和本地缓存。
6. 刷新失败：视同 refresh token 失效，清空缓存并 reLaunch 登录页。
7. 刷新成功后，检查用户资料：
   若 is_new_user === true 或 user_name 为空，提示“是否完善资料”；
   用户可选择进入 /pages/user-info/user-info，或留在首页。
8. 资料完整的用户直接进入首页或上一次停留页面。

## 注意点

- 用户登出后清空userInfo，这时候也会清空refresh_token，但是关闭不会。主动登出和关闭小程序是不一样的
- 其他组件例如PostsDisplay 不应该在未登录时加载，否则可能会阻塞页面跳转，产生冲突。可以使用条件渲染

### 使用条件渲染方案

直接使用条件渲染后，修改了旧有在app.vue里调用守卫的模式，选择在首页里调用守卫。

- 检测登录状态，未登录直接跳转login.vue，登录则保持静默。

  **登录页流程**

1.  页面展示登录按钮，全屏、无导航。
2.  用户点击登录 → 调用 uni.login() 获取 js_code。
3.  携带 js_code 调用 /user/login。
4.  登录成功返回：access_token、refresh_token、过期时间、user_id、is_new_user 等。
5.  保存至本地与 Pinia store。
6.  根据 is_new_user 决定：
    true：弹框提示是否完善资料，用户可跳转 /pages/user-info/user-info 或暂不处理。
    false：reLaunch 到首页。
7.  登录失败：提示错误，留在登录页等待重试。

### 踩坑

1. 因为一般接口都使用Access_token来作为请求头，而/user/refresh却使用refresh_token，存在冲突。
   **用户信息编辑页**

2. 页面全屏显示，仅在首次登录或资料缺失时进入。
3. 用户可编辑昵称、性别、头像等；
4. 提交调用 /user/update：
   成功：更新本地 userInfo，把 is_new_user 置为 false，reLaunch 首页；
   失败：展示错误信息，允许继续编辑。

## 1. 首先在 `api/apis.js` 中添加 refresh 接口

在文件末尾添加：

```javascript
// 刷新 access_token
export function apiRefreshToken() {
  return request({
    url: "/user/refresh",
    method: "POST",
  });
}

// 更新用户信息
export function apiUpdateUserInfo(userData) {
  return requestJson({
    url: "/user/update",
    method: "PUT",
    data: userData,
  });
}
```

## 2. 在 `utils/user.js` 中添加辅助函数

在文件末尾添加：

```javascript
// 检查 refresh_token 是否存在且未过期
export function isRefreshTokenValid() {
  const userInfo = getCurrentUser();
  if (!userInfo?.refresh_token) return false;

  const expiresAt = userInfo.refresh_token_expires_at;
  if (!expiresAt) return true; // 如果没有过期时间，假设有效

  return Date.now() < expiresAt;
}

// 检查 access_token 是否即将过期（提前 5 分钟）
export function shouldRefreshAccessToken() {
  const userInfo = getCurrentUser();
  if (!userInfo?.access_token) return true;

  const expiresAt = userInfo.access_token_expires_at;
  if (!expiresAt) return false;

  const fiveMinutes = 5 * 60 * 1000;
  return Date.now() + fiveMinutes >= expiresAt;
}

// 检查是否是新用户或资料不完整
export function isNewUserOrIncomplete() {
  const userInfo = getCurrentUser();
  if (!userInfo) return false;

  // 检查 is_new_user 标记或用户名是否为空
  return userInfo.is_new_user === true || !userInfo.user_name;
}
```

## 3. 扩展 `stores/user.js`

在现有的 actions 中添加：

```javascript
// 在 actions 中添加以下方法

/**
 * 设置用户信息（登录后使用）
 */
setUserInfo(userInfo) {
  this.user_name = userInfo.user_name;
  this.gender = userInfo.gender;

  // 同步到本地存储
  setCurrentUser(userInfo);
},

/**
 * 刷新 access_token
 */
async refreshAccessToken() {
  try {
    const res = await apiRefreshToken();

    // 更新本地存储中的 access_token
    const userInfo = getCurrentUser();
    if (userInfo) {
      userInfo.access_token = res.access_token;
      userInfo.access_token_expires_at = res.access_token_expires_at;

      // 如果后端也返回了新的 refresh_token，也更新
      if (res.refresh_token) {
        userInfo.refresh_token = res.refresh_token;
        userInfo.refresh_token_expires_at = res.refresh_token_expires_at;
      }

      setCurrentUser(userInfo);

      // 更新 store 中的用户名等基本信息（如果后端返回了）
      if (res.user_name) {
        this.user_name = res.user_name;
      }
      if (res.gender) {
        this.gender = res.gender;
      }
    }

    console.log('Token 刷新成功');
    return true;
  } catch (error) {
    console.error('刷新 token 失败:', error);
    return false;
  }
},

/**
 * 登出
 */
logout() {
  this.user_name = null;
  this.gender = null;
  this.clearThumbedMap();
  this.clearCommentThumbedMap();
  clearCurrentUser();
  console.log('用户已登出');
},
```

需要在文件顶部导入：

```javascript
import { setCurrentUser, clearCurrentUser, getCurrentUser } from "@/utils/user";
import { apiGetThumbs, apiRefreshToken } from "@/api/apis";
```

## 4. 创建启动守卫函数（新文件 `utils/authGuard.js`）

```javascript
import { isRefreshTokenValid, clearCurrentUser } from "@/utils/user";
import { useUserStore } from "@/stores/user";

/**
 * 应用启动时的认证守卫
 * 返回：需要跳转的页面路径，如果返回 null 则表示认证通过
 */
export async function fullAuthCheck() {
  // 步骤2：检查 refresh_token 是否存在
  if (!isRefreshTokenValid()) {
    console.log("refresh_token 不存在或已过期，跳转登录页");
    return "/pages/login/login";
  }

  console.log("refresh_token 有效，尝试刷新 access_token");

  // 步骤5-6：调用 /user/refresh
  const userStore = useUserStore();
  const success = await userStore.refreshAccessToken();

  if (!success) {
    console.log("刷新 access_token 失败，清除缓存并跳转登录页");
    userStore.logout();
    return "/pages/login/login";
  }

  console.log("access_token 刷新成功，认证通过");
  return null; // 认证通过
}

/**
 * 检查是否需要完善用户资料
 */
export function checkProfileCompletion() {
  const userInfo = uni.getStorageSync("userInfo");
  if (!userInfo) return false;

  const user = typeof userInfo === "string" ? JSON.parse(userInfo) : userInfo;

  // 步骤7：检查是否是新用户或资料不完整
  return user.is_new_user === true || !user.user_name;
}
```

## 5. 修改 `App.vue`

将 App.vue 改为 Vue 3 组合式 API：

```vue
<script setup>
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { fullAuthCheck, checkProfileCompletion } from "@/utils/authGuard";

onLaunch(async () => {
  console.log("App Launch");

  // 显示加载提示
  uni.showLoading({
    title: "加载中...",
    mask: true,
  });

  try {
    // 执行认证守卫流程（步骤2-6）
    const redirectPath = await fullAuthCheck();

    uni.hideLoading();

    // 步骤3：需要跳转到登录页
    if (redirectPath) {
      uni.reLaunch({
        url: redirectPath,
      });
      return;
    }

    // 步骤7：检查是否需要完善资料
    const needProfile = checkProfileCompletion();
    if (needProfile) {
      uni.showModal({
        title: "欢迎",
        content: "是否完善个人资料？",
        confirmText: "立即完善",
        cancelText: "稍后再说",
        success: (res) => {
          if (res.confirm) {
            uni.reLaunch({
              url: "/pages/user-info/user-info",
            });
          }
          // 用户选择稍后，就留在当前页（首页）
        },
      });
    }

    console.log("启动检测完成");
  } catch (error) {
    console.error("启动检测失败:", error);
    uni.hideLoading();

    // 发生未知错误，跳转到登录页
    uni.reLaunch({
      url: "/pages/login/login",
    });
  }
});

onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});
</script>

<style>
/*每个页面公共css */
</style>
```

## 6. 在 `pages.json` 中添加登录页和用户信息编辑页配置

在 `pages` 数组中添加：

```json
{
  "path": "pages/login/login",
  "style": {
    "navigationStyle": "custom"
  }
},
{
  "path": "pages/user-info/user-info",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "完善资料"
  }
}
```

---

## 实现说明

1. **步骤2-3**：在 `authGuard.js` 的 `fullAuthCheck()` 中，通过 `isRefreshTokenValid()` 检查 token 是否存在和过期
2. **步骤4-6**：调用 `userStore.refreshAccessToken()`，内部会调用 `/user/refresh` API，成功则更新本地缓存，失败则返回 false
3. **步骤7**：在 `App.vue` 中根据 `checkProfileCompletion()` 判断是否弹窗提示完善资料

整个流程集中在 `App.vue` 的 `onLaunch` 中执行，通过 `uni.showLoading` 遮挡页面，确保认证完成后才显示内容。

你现在需要切换到 **agent mode** 来让我帮你应用这些更改，还是你想自己手动复制粘贴这些代码？
