import { useUserStore } from "@/store/userStore";
import type { AxiosResponse } from "axios";
import axios from "axios";
const BASE_URL = "http://110.40.190.116:54128";
const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ODJkMmExZC1kZWRjLTQ3OTEtYTk0NS0yMmE5ZWUxZTM4MmMiLCJyb2xlIjoidXNlciIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzcwNjM3NzAxLCJleHAiOjE3NzEyNDI1MDF9.syJemAF3K0SxhZg4SkZGqnxRlKi6qjmZWYKgaEDD9cs";

const axiosJsonInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
//请求拦截器
axiosJsonInstance.interceptors.request.use(
  (config) => {
    // 暂时所有请求都使用 refreshToken
    // const accessToken = useUserStore.getState().accessToken;
    if (refreshToken) {
      config.headers.Authorization = `Bearer ${refreshToken}`;
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
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);

      if (error.response.status === 401) {
        useUserStore.getState().logout();
        console.log('Token expired, user logged out');
      }
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);
export default axiosJsonInstance;