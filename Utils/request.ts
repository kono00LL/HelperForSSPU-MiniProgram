import { useUserStore } from "@/store/userStore";
import type { AxiosResponse } from "axios";
import axios from "axios";
const BASE_URL = "http://110.40.190.116:54128";

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
    const accessToken = useUserStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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