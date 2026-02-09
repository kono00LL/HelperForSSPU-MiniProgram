import { PostsResponse } from "./postInfo";
import { User } from "./userInfo";

/** PUT /user/userinfo 传入参数 */
export interface UserUpdateParams {
    user_name?: string | null;
    gender?: number | null;
    city?: string | null;
    avatar?: string[] | null;
}

/** POST /thumb/ 传入参数 */
export interface ThumbRequest {
    entity_type: "post" | "comment";
    entity_id: string;
    isThumbed: boolean;
}

/** POST /thumb/ 响应 & POST /thumb/user 响应项 */
export interface ThumbResponse {
    entity_type: string;
    entity_id: string;
    isThumbed: boolean;
    thumb_id: number;
    user_id: string;
    updated_at: string;
}

/** POST /collect/ 响应 */
export interface CollectResponse {
    post_id: string;
    user_id: string;
    collect_id: number;
    isCollected: boolean;
}

/** POST /follow/ 响应 */
export interface FollowResponse {
    follower_id: string;
    followee_id: string;
    is_following: boolean;
}

/** GET /follow/fans & /follow/following 响应 */
export interface FansFollowingResponse {
    count: number;
    user_ids: string[];
}

/** GET /follow/profile/{user_id} 响应 */
export interface UserProfileResponse {
    user: User;
    posts: PostsResponse;
}

/** 通知项 */
export interface NotificationItem {
    id: number;
    user_id: string;
    actor_id: string;
    type: string;
    target_type: string;
    target_id: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

/** GET /notification/unread 响应 */
export interface NotificationsResponse {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    items: NotificationItem[];
}

/** POST /notification/read/{id} 响应 */
export interface MarkReadResponse {
    id: number;
    is_read: boolean;
}

/** POST /images/ 响应项 */
export interface ImageUploadItem {
    img_id: string;
    user_id: string;
    entity_type: string;
    entity_id: string;
    img_url: string;
    created_time: string;
}