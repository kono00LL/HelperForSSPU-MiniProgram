import { Post } from "@/interfaces/postInfo";
import { apiCreatePost, apiGetPostDetail, apiViewIncrement } from "@/services/api";
import { create } from "zustand";

interface PostStore {
    // 帖子列表 & 详情
    currentPost: Post | null;
    isLoading: boolean;
    error: string | null;
    postList: Post[];
    addPosts: (posts: Post[]) => void;
    clearPosts: () => void;
    fetchPostDetail: (post_id: string) => Promise<void>;
    clearCurrentPost: () => void;

    // 发布草稿
    draftTitle: string;
    draftContent: string;
    draftImages: string[]; // 图片 URI 列表
    setDraftTitle: (title: string) => void;
    setDraftContent: (content: string) => void;
    addDraftImage: (uri: string) => void;
    removeDraftImage: (index: number) => void;
    clearDraft: () => void;
    publishPost: () => Promise<Post>;
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
            });
        } catch (error) {
            console.error("Fetch post detail failed:", error);
            set({
                error: "Fail",
                isLoading: false,
            });
        }
    },

    clearCurrentPost: () => {
        set({ currentPost: null, error: null });
    },

    addPosts: (posts) => {
        if (!posts || posts.length === 0) return;
        const currentPostList = get().postList;
        const newPostList = posts.filter(
            (newPost: Post) =>
                !currentPostList.some(
                    (existingPost) => existingPost.post_id === newPost.post_id
                )
        );
        set({ postList: [...currentPostList, ...newPostList] });
    },

    clearPosts: () => {
        set({ postList: [] });
    },

    draftTitle: "",
    draftContent: "",
    draftImages: [],

    setDraftTitle: (title: string) => set({ draftTitle: title }),

    setDraftContent: (content: string) => set({ draftContent: content }),

    addDraftImage: (uri: string) => {
        const current = get().draftImages;
        if (current.length >= 9) return; // 最多9张
        set({ draftImages: [...current, uri] });
    },

    removeDraftImage: (index: number) => {
        const current = get().draftImages;
        set({ draftImages: current.filter((_, i) => i !== index) });
    },

    clearDraft: () => {
        set({ draftTitle: "", draftContent: "", draftImages: [] });
    },
    publishPost: async () => {
        const { draftTitle, draftContent } = get();

        if (!draftTitle.trim() || !draftContent.trim()) {
            throw new Error("标题和内容不能为空");
        }

        try {
            // 调用 API 创建帖子（暂时不传图片）
            const newPost = await apiCreatePost(
                draftTitle.trim(),
                draftContent.trim()
            );

            // 将新帖子添加到列表顶部
            const currentPostList = get().postList;
            set({ postList: [newPost, ...currentPostList] });

            return newPost;
        } catch (error) {
            console.error("Publish post failed:", error);
            throw error;
        }
    },
}));