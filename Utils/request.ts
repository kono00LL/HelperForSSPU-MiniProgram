import type { AxiosResponse } from "axios";
import axios from "axios";

const BASE_URL = "http://110.40.190.116:54128";

const axiosJsonInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers:{
        'Content-Type': 'application/json',
    },
});
//请求拦截器
axiosJsonInstance.interceptors.request.use(
(config) => {
    return config;
},
(error) => {
    return Promise.reject(error);
}
);
//响应拦截器
axiosJsonInstance.interceptors.response.use(
   (response:AxiosResponse) => {
    return response.data;
   },
   (error) => {
    if (error.response) {
        // 服务器返回错误状态码
        console.error('API Error:', error.response.status, error.response.data);
        
        if (error.response.status === 401) {
          // token 过期，可以在这里处理刷新 token 逻辑
          console.log('Token expired, need to refresh');
        }
      } else if (error.request) {
        // 请求已发送但没有收到响应
        console.error('Network Error:', error.request);
      } else {
        // 其他错误
        console.error('Error:', error.message);
      }
      return Promise.reject(error);
   }
);

export default axiosJsonInstance;