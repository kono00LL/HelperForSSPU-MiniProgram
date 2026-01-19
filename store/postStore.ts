import { apiGetPostDetail, apiViewIncrement } from "@/services/api";
import { create } from "zustand";

  export const usePostStore = create((set,get) => ({
    currentPost: null,
    isLoading: false,
    error: null,

    fetchPostDetail: async(post_id:string) => {
        set({isLoading:true,error:null});

        try{
            await apiViewIncrement(post_id);
            const postData = await apiGetPostDetail(post_id);
            console.log(postData);
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
        set({ currentPost: null, error:null})
    }

  }))