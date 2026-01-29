import axiosJsonInstance from "@/Utils/request";
import { CommentsResponse } from "@/interfaces/commentInfo";
import { Post, PostsResponse } from "@/interfaces/postInfo";
export const apiViewIncrement = async (post_id: string): Promise<Post> => {
  try {
    const response = await axiosJsonInstance.post(`/post/view_increment/${post_id}`)
    return response;
  } catch (error) {
    console.error('View increment failed:', error);
    throw error;
  }
};

// 获取帖子详情接口
export const apiGetPostDetail = async (post_id: string): Promise<Post> => {
  try {
    const response = await axiosJsonInstance.get(`/post/detail`, {
      params: {
        post_id,
      },
    });
    return response;
  } catch (error) {
    console.error('Get post detail failed:', error);
    throw error;
  }
};

// 获取帖子列表
export const apiGetPosts = async (page: number, page_size: number): Promise<PostsResponse> => {
  try {
    const response = await axiosJsonInstance.get('/post/getPosts', {
      params: {
        page,
        page_size,
      },
    });
    return response;
  } catch (error) {
    console.error('Get posts failed:', error);
    throw error;
  }
};

export const apiGetComments = async (post_id: string, page: number, page_size: number): Promise<CommentsResponse> => {
  try {
    const response = await axiosJsonInstance.get(`/comment/${post_id}`, {
      params: {
        page,
        page_size,
      },
    });
    return response;
  }
  catch (error) {
    console.error('Get comments failed:', error);
    throw error;
  }
}

