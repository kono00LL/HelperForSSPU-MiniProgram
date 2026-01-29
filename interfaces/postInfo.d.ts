// types/post.ts
export interface User {
  user_id: string;
  user_name: string;
  avatar_url: string;
}

export interface Images {
  img_id: string;
  img_url: string;
}

export interface Post {
  title: string;
  content: string;
  post_id: string;
  user: User;
  created_time: string;
  view: number;
  likes: number;
  collect: number;
  comment_count: number;
  images: Images[];
}

export interface PostsResponse {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  items: Post[];
}
