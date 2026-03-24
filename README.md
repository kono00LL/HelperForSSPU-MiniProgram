# HelperForSSPU

---

SSPU 校园助手 · React Native 客户端

### 技术架构

| 类别     | 技术 |
|----------|------|
| 框架     | React Native 0.81 + Expo SDK 54 |
| 路由     | expo-router |
| 状态管理 | Zustand |
| 网络请求 | Axios |
| 页面滑动 | react-native-pager-view |

### 快速开始

**1. Expo Go**

使用 Expo Go App 扫码运行。

```shell
npm install
npx expo start
```

**2.原生运行**

需要借助 adb桥 连接设备

```shell
npm install
npx expo run
```

### 项目结构
```
app/
  index.tsx            # 首页
  posts/[post_id].tsx  # 帖子详情（详情页+评论页）
  users/[user_id].tsx  # 用户详情（用户信息+发帖查看）
  message.tsx          # 消息页
  profile.tsx          # 用户页（个人详情 + 管理登录）

components/            # UI 组件（收藏点赞,卡片等）
hooks/                 # 数据 Hooks
services/              # API 封装
store/                 # Zustand 状态（用户，评论，消息）
utils/                 # 工具函数（axios请求）
```