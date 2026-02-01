export interface User {
    user_id: string;
    user_name: string;
    user_email: string;
    user_phone_number: string;
    avatar_url: string;
    created_time: string;
    gender: number;
    city: string;
    status: number;
    last_login_time: string;
    likes: number;
    follower_cnt: number;
    fans_cnt: number;
}
export interface LoginResponse {
    user: User;
    access_token: string;
    refresh_token: string;
}