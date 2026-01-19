// types/post.ts
export interface User {
  user_id: string;
  user_name: string;
  avatar_url: string;
}

export interface Post {
  post_id: string;
  title: string;
  content: string;
  user: User;
  created_time: string;
  view: number;
  likes: number;
  collect: number;
  comment_count: number;
  images: string[];
}

export interface PostsResponse {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  items: Post[];
}
