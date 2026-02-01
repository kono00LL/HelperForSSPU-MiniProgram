import axiosJsonInstance from '@/Utils/request';
import { UserInfo } from '@/store/userStore';

// 登录响应类型
export interface LoginResponse {
    user: UserInfo;
    access_token: string;
    refresh_token: string;
}

// 微信登录 - 发送 code 到后端
export function apiWechatLogin(jsCode: string) {
    return axiosJsonInstance({
        url: `/user/login?js_code=${encodeURIComponent(jsCode)}`,
        method: "POST",
    });
}