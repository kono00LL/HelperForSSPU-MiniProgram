import { useUserStore } from "@/store/userStore";
import type { AxiosResponse } from "axios";
import axios from "axios";
const BASE_URL = "http://110.40.190.116:54128";

const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ODJkMmExZC1kZWRjLTQ3OTEtYTk0NS0yMmE1ZWUxZTM4MmMiLCJyb2xlIjoidXNlciIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzcxMzM5MzQ5LCJleHAiOjE3NzE5NDQxNDl9.W6-TDAr8jUdrk3CbttnrPbuH8R68W_JyDb3QOP4UP4I";

const axiosJsonInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
export const axiosRefreshInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 使用 refresh token
axiosRefreshInstance.interceptors.request.use(
  (config) => {
    const storedRefreshToken = useUserStore.getState().refreshToken;
    const tokenToUse = storedRefreshToken || refreshToken;
    config.headers.Authorization = tokenToUse;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosRefreshInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.error('Refresh Token Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

//请求拦截器
axiosJsonInstance.interceptors.request.use(
  (config) => {
    const accessToken = useUserStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
//响应拦截器
axiosJsonInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 如果是 401 错误且还没有重试过，尝试刷新 token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {

        // 调用 refresh 接口
        const response = await axiosRefreshInstance.get('/user/refresh');
        const { user_id, access_token, refresh_token } = response.data;
        // 保存新的 tokens
        useUserStore.getState().setTokens(user_id, access_token, refresh_token);

        // 用新 token 重试原请求
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosJsonInstance(originalRequest);
      } catch (refreshError) {
        // refresh token 也过期了，退出登录
        console.log('Token 刷新失败，退出登录');
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    // 其他错误直接抛出
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);
export default axiosJsonInstance;