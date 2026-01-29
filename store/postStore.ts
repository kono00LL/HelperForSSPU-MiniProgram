import { Post } from "@/interfaces/postInfo";
import { apiGetPostDetail, apiViewIncrement } from "@/services/api";
import { create } from "zustand";
interface PostStore {
    currentPost: Post | null;
    isLoading: boolean;
    error: string | null;
    postList: Post[];
    addPosts: (posts: Post[]) => void;
    clearPosts: () => void;
    fetchPostDetail: (post_id: string) => Promise<void>;
    clearCurrentPost: () => void;
}
export const usePostStore = create<PostStore>((set, get) => ({
    currentPost: null,
    isLoading: false,
    error: null,
    postList: [],

    fetchPostDetail: async (post_id: string) => {
        set({ isLoading: true, error: null });

        try {
            await apiViewIncrement(post_id);
            const postData = await apiGetPostDetail(post_id);
            set({
                currentPost: Array.isArray(postData) ? postData[0] : postData,
                isLoading: false,
            })
        } catch (error) {
            console.error('Fetch post detail failed:', error);
            set({
                error: 'Fail',
                isLoading: false,
            })
        }
    },

    clearCurrentPost: () => {
        set({ currentPost: null, error: null })
    },

    addPosts: (posts) => {
        if (!posts || posts.length === 0) return;
        const currentPostList = get().postList;

        const newPostList = posts.filter(
            (newPostList: Post) => !currentPostList.some(
                (existingPost) => existingPost.post_id === newPostList.post_id
            )
        );

        set({ postList: [...currentPostList, ...newPostList] })


    },

    clearPosts: () => {
        set({ postList: [] })
    },

}))