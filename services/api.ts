import axiosJsonInstance from "@/Utils/request";
import {
  CollectResponse,
  FansFollowingResponse,
  FollowResponse,
  ImageUploadItem,
  MarkReadResponse,
  NotificationsResponse,
  ThumbRequest,
  ThumbResponse,
  UserProfileResponse,
  UserUpdateParams,
} from "@/interfaces/apiTypes";
import { Comment, CommentsResponse } from "@/interfaces/commentInfo";
import { Post, PostsResponse } from "@/interfaces/postInfo";
import { LoginResponse, User } from "@/interfaces/userInfo";
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

export const apiWechatLogin = async (js_code: string): Promise<LoginResponse> => {
  try {
    const response = await axiosJsonInstance.post('/user/login', {
      js_code,
    });
    return response;
  } catch (error) {
    console.error('Wechat login failed:', error);
    throw error;
  }
}
/**
 * 用户个人信息修改
 * PUT /user/userinfo
 */
export const apiUpdateUserInfo = async (params: UserUpdateParams): Promise<User> => {
  try {
    const response = await axiosJsonInstance.put('/user/userinfo', params);
    return response;
  } catch (error) {
    console.error('Update user info failed:', error);
    throw error;
  }
};

/**
 * 创建帖子
 * POST /post/
 * multipart/form-data
 */
export const apiCreatePost = async (
  title: string,
  content: string,
  images?: string[]
): Promise<Post> => {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    // @ts-ignore - FormData在RN中可能有entries方法
    // if (formData.entries) {
    //   for (let pair of formData.entries()) {
    //     console.log('  ', pair[0], '=', pair[1]);
    //   }
    // }

    if (images && images.length > 0) {
      images.forEach((uri, index) => {
        const fileName = uri.split('/').pop() || `image_${index}.jpg`;
        const fileType = fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

        formData.append('images', {
          uri: uri,
          type: fileType,
          name: fileName,
        } as any);
      });
    }

    const response = await axiosJsonInstance.post('/post/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Create post failed:', error);
    throw error;
  }
};


/**
 * 创建评论
 * POST /comment/
 * multipart/form-data + query param parent_comment_id
 */
export const apiCreateComment = async (
  post_id: string,
  content: string,
  images?: null,
  parent_comment_id?: string | null
): Promise<Comment> => {
  try {
    const formData = new FormData();
    formData.append('post_id', post_id);
    formData.append('content', content);
    const response = await axiosJsonInstance.post('/comment/', formData, {
      params: parent_comment_id ? { parent_comment_id } : {},
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  } catch (error) {
    console.error('Create comment failed:', error);
    throw error;
  }
};

/**
 * 上传图片
 * POST /images/
 * multipart/form-data
 */
export const apiUploadImages = async (
  entity_type: string,
  entity_id: string,
  files: any[]
): Promise<ImageUploadItem[]> => {
  try {
    const formData = new FormData();
    formData.append('entity_type', entity_type);
    formData.append('entity_id', entity_id);
    files.forEach((file) => {
      formData.append('files', file);
    });
    const response = await axiosJsonInstance.post('/images/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  } catch (error) {
    console.error('Upload images failed:', error);
    throw error;
  }
};

/**
 * 点赞与取消点赞
 * POST /thumb/
 */
export const apiToggleThumb = async (data: ThumbRequest): Promise<ThumbResponse> => {
  try {
    const response = await axiosJsonInstance.post('/thumb/', data);
    return response;
  } catch (error) {
    console.error('Toggle thumb failed:', error);
    throw error;
  }
};

/**
 * 查询用户点赞对象
 * POST /thumb/user
 */
export const apiGetUserThumbs = async (entity_type: string): Promise<ThumbResponse[]> => {
  try {
    const response = await axiosJsonInstance.post('/thumb/user', { entity_type });
    return response;
  } catch (error) {
    console.error('Get user thumbs failed:', error);
    throw error;
  }
};

/**
 * 收藏与取消收藏帖子
 * POST /collect/
 */
export const apiToggleCollect = async (post_id: string): Promise<CollectResponse> => {
  try {
    const response = await axiosJsonInstance.post('/collect/', { post_id });
    return response;
  } catch (error) {
    console.error('Toggle collect failed:', error);
    throw error;
  }
};

/**
 * 查询用户收藏对象
 * GET /collect/user
 */
export const apiGetUserCollects = async (): Promise<Post[]> => {
  try {
    const response = await axiosJsonInstance.get('/collect/user');
    return response;
  } catch (error) {
    console.error('Get user collects failed:', error);
    throw error;
  }
};

/**
 * 关注/取关用户
 * POST /follow/
 * query param: follow (boolean, default true)
 * body: { followee_id: string }
 */
export const apiToggleFollow = async (
  followee_id: string,
  follow: boolean = true
): Promise<FollowResponse> => {
  try {
    const response = await axiosJsonInstance.post(
      '/follow/',
      { followee_id },
      { params: { follow } }
    );
    return response;
  } catch (error) {
    console.error('Toggle follow failed:', error);
    throw error;
  }
};

/**
 * 查询粉丝数量+列表
 * GET /follow/fans
 */
export const apiGetFans = async (): Promise<FansFollowingResponse> => {
  try {
    const response = await axiosJsonInstance.get('/follow/fans');
    return response;
  } catch (error) {
    console.error('Get fans failed:', error);
    throw error;
  }
};

/**
 * 查询关注数量+列表
 * GET /follow/following
 */
export const apiGetFollowing = async (): Promise<FansFollowingResponse> => {
  try {
    const response = await axiosJsonInstance.get('/follow/following');
    return response;
  } catch (error) {
    console.error('Get following failed:', error);
    throw error;
  }
};

/**
 * 通过user_id查询用户信息+帖子(分页)
 * GET /follow/profile/{user_id}
 */
export const apiGetUserProfile = async (
  user_id: string,
  page: number = 1,
  page_size: number = 3
): Promise<UserProfileResponse> => {
  try {
    const response = await axiosJsonInstance.get(`/follow/profile/${user_id}`, {
      params: { page, page_size },
    });
    return response;
  } catch (error) {
    console.error('Get user profile failed:', error);
    throw error;
  }
};

/**
 * 消息-未读列表
 * GET /notification/unread
 */
export const apiGetUnreadNotifications = async (
  page: number = 1,
  page_size: number = 5
): Promise<NotificationsResponse> => {
  try {
    const response = await axiosJsonInstance.get('/notification/unread', {
      params: { page, page_size },
    });
    return response;
  } catch (error) {
    console.error('Get unread notifications failed:', error);
    throw error;
  }
};

/**
 * 消息-标记已读
 * POST /notification/read/{notification_id}
 */
export const apiMarkNotificationRead = async (
  notification_id: number
): Promise<MarkReadResponse> => {
  try {
    const response = await axiosJsonInstance.post(`/notification/read/${notification_id}`);
    return response;
  } catch (error) {
    console.error('Mark notification read failed:', error);
    throw error;
  }
};