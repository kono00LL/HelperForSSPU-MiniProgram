```js
import {
  request,
  requestWithFiles,
  requestJson,
} from "@/utils/request";
export const BASE_URL = "http://110.40.190.116:54128";

export function apiGetAllPostForUser(
  user_id,
  page,
  page_size
) {
  return request({
    url:
      "/post?user_id=" +
      user_id +
      "&page=" +
      page +
      "&page_size=" +
      page_size,
  });
}

export function apiGetPostDetail(post_id) {
  return request({
    url: "/post/" + post_id,
  });
}

export function apiViewIncrement(post_id) {
  return request({
    url: "/post/view_increment/" + post_id,
    method: "POST",
  });
}

export function apiGetPostComments(
  post_id,
  page,
  page_size
) {
  return request({
    url:
      "/comment/" +
      post_id +
      "?page=" +
      page +
      "&page_size=" +
      page_size,
  });
}

// 发送评论
export function apiSendComment(
  post_id,
  content,
  parent_comment_id,
  images
) {
  const data = {
    post_id: post_id,
    content: content,
    parent_comment_id: parent_comment_id || "null",
  };

  if (images && images.length > 0) {
    data.images = images;
  }

  return request({
    url: "/comment",
    method: "POST",
    data: data,
  });
}
// 上传图片
export function apiSendImage(
  entity_type,
  entity_id,
  files
) {
  // 因为api限制，暂时规定只上传一张图片，采用循环调用来实现发送多张图片
  const data = {
    entity_type: entity_type,
    entity_id: entity_id,
    files: files,
  };
  return request({
    url: "/images",
    method: "POST",
    data: data,
  });
}

// 用户登录接口
export function apiUserLogin(jsCode) {
  return request({
    url: `/user/login?js_code=${encodeURIComponent(jsCode)}`,
    method: "POST",
    data: {},
  });
}
// 创建新帖子接口
export function apiCreateNewPost(title, content, images) {
  // 如果有图片文件，使用文件上传方式
  if (images && images.length > 0) {
    return requestWithFiles({
      url: "/post",
      method: "POST",
      data: {
        title: title,
        content: content,
      },
      files: images, // 传递文件数组
    });
  }

  // 没有图片，使用普通请求
  const data = {
    title: title,
    content: content,
  };

  return request({
    url: "/post",
    method: "POST",
    data: data,
  });
}

export function apiGetPosts(page, page_size) {
  return request({
    url:
      "/post/getPosts?page=" +
      page +
      "&page_size=" +
      page_size,
    method: "GET",
  });
}

export function apiThumbOrNot(
  entity_type,
  entity_id,
  isThumbed
) {
  return requestJson({
    url: "/thumb",
    method: "POST",
    data: {
      entity_type: entity_type,
      entity_id: entity_id,
      isThumbed: isThumbed,
    },
  });
}

export async function apiGetThumbs(entity_type) {
  try {
    return await requestJson({
      url: "/thumb/user",
      method: "POST",
      data: { entity_type },
    });
  } catch (error) {
    //后端将空数据作404处理，为了保证一致性
    if (
      error.message?.includes("404") ||
      error.statusCode === 404
    ) {
      return { items: [], total: 0 };
    }
    throw error; // 其他错误继续抛出
  }
}
// 根据 RefreshToken 刷新 AccessToken
export function apiRefreshToken() {
  // 从本地存储获取 refresh_token
  const userInfoStr = uni.getStorageSync("userInfo");
  if (!userInfoStr) {
    return Promise.reject(new Error("未找到用户信息"));
  }

  const userInfo = JSON.parse(userInfoStr);
  const refreshToken = userInfo?.refresh_token;

  if (!refreshToken) {
    return Promise.reject(
      new Error("未找到 refresh_token")
    );
  }

  return request({
    url: "/user/refresh",
    method: "GET",
    headers: {
      Authorization: `${refreshToken}`,
    },
  });
}

export function apiGetUserPosts(user_id, page, page_size) {
  return uni.request({
    url: BASE_URL + "/post/",
    method: "GET",
    data: {
      user_id,
      page,
      page_size,
    },
  });
}

// api/apis.js
export function apiUpdateUserInfo(
  userInfo,
  avatarFiles = null
) {
  const data = {
    user_name: userInfo.user_name,
    gender: Number(userInfo.gender),
    city: userInfo.city || null,
  };

  if (
    avatarFiles &&
    Array.isArray(avatarFiles) &&
    avatarFiles.length > 0
  ) {
    // 过滤掉非法的空路径
    const validFiles = avatarFiles.filter((f) => f);

    if (validFiles.length > 0) {
      return requestWithFiles({
        url: "/user/userinfo",
        method: "PUT",
        data: data,
        files: validFiles,
        fileFieldName: "avatar", // 这一步会产生 form-data 中的 'avatar' 字段
      });
    }
  }

  // 没有头像,使用普通请求
  return request({
    url: "/user/userinfo",
    method: "PUT",
    data: data,
  });
}

export function apiCollectOrNot(post_id) {
  return requestJson({
    url: "/collect",
    method: "POST",
    data: {
      post_id: post_id,
    },
  });
}

export function apiGetCollects() {
  return requestJson({
    url: "/collect/user",
    method: "GET",
  });
}
```
