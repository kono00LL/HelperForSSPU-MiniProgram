import { useUserStore } from "@/store/userStore";
import type { AxiosResponse } from "axios";
import axios from "axios";
const BASE_URL = "http://110.40.190.116:54128";

const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ODJkMmExZC1kZWRjLTQ3OTEtYTk0NS0yMmE1ZWUxZTM4MmMiLCJyb2xlIjoidXNlciIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzcwNjQ2MzI3LCJleHAiOjE3NzEyNTExMjd9.J2Eee2hHBrrHg974u8Tkgb8Aj4MHR9bsPLZWvTMXqSA";

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
    console.log('使用 refreshToken 发起请求', tokenToUse);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosRefreshInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
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
      console.log('使用 accessToken 发起请求');
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
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // 如果是 401 错误且还没有重试过，尝试刷新 token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('Token 过期，正在刷新...');
        // 调用 refresh 接口
        const response = await axiosRefreshInstance.get('/user/refresh');
        const { user_id, access_token, refresh_token } = response;

        // 保存新的 tokens
        useUserStore.getState().setTokens(user_id, access_token, refresh_token);
        console.log('Token 刷新成功');

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