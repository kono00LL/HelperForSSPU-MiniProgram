export interface User {
    user_id: string;
    user_name: string;
    avatar_url: string;
}

export interface Images {
    img_id: string;
    img_url: string;

}

export interface Comment {
    content: string;
    comment_id: string;
    user: User;
    post_id: string;
    user_id: string;
    parent_comment_id: string;
    images: Images[];
    created_at: string;
    likes: number;
}

export interface CommentsResponse {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
    items: Comment[];
}