import { Comment } from "@/interfaces/commentInfo";
import { create } from "zustand";
interface CommentStore {
    comments: { [post_id: string]: Comment[] };


    addComments: (post_id: string, comments: Comment[]) => void;
    clearComments: (post_id: string) => void;
    clearAllComments: () => void;



}
const useCommentStore = create<CommentStore>((set, get) => ({
    comments: {},

    // 添加评论到指定帖子
    addComments: (post_id: string, comments: Comment[]) => {

        if (!comments || comments.length === 0) return;
        const currentComments = get().comments;
        const currentCommentList = currentComments[post_id] || [];

        const newCommentList = comments.filter(
            (newComment: Comment) => !currentCommentList.some(
                (existingComment) => existingComment.comment_id === newComment.comment_id
            )
        );

        set({
            comments: {
                ...currentComments,
                [post_id]: [...currentCommentList, ...newCommentList]
            }
        });
    },

    // 清除指定帖子的评论
    clearComments: (post_id: string) => {
        const currentComments = get().comments;
        const { [post_id]: _, ...rest } = currentComments;
        set({ comments: rest });
    },

    // 清空所有评论
    clearAllComments: () => {
        set({ comments: {} });
    },
}))

export default useCommentStore;