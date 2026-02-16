import { apiGetUserThumbs } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export interface UserInfo {
    user_id: string;
    user_name: string;
    user_email?: string;
    user_phone_number?: string;
    avatar_url?: string;
    created_time?: string;
    gender?: number;
    city?: string;
    status?: number;
    last_login_time?: string;
    likes?: number;
    follower_cnt?: number;
    fans_cnt?: number;
}

interface UserStore {
    user: UserInfo | null;
    // 帖子点赞哈希表：post_id -> isThumbed (boolean)
    ThumbedMap: Record<string, boolean>;
    accessToken: string | null;
    refreshToken: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;

    setUser: (user: UserInfo, accessToken: string, refreshToken: string) => void;
    setAccessToken: (accessToken: string) => void;
    setTokens: (userId: string, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    refreshThumbedMap: () => Promise<void>;
    clearThumbedMap: () => void;
}
export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            ThumbedMap: {},
            accessToken: null,
            refreshToken: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,


            setUser: (user, accessToken, refreshToken) => {
                set({
                    user,
                    accessToken,
                    refreshToken,
                    isLoggedIn: true,
                    error: null,
                });
            },

            refreshThumbedMap: async () => {
                try {
                    const res = await apiGetUserThumbs("post"); // 获取当前用户点赞列表

                    const list = Array.isArray((res as any)?.items)
                        ? (res as any).items
                        : Array.isArray(res)
                            ? res
                            : [];

                    const hashMap: Record<string, boolean> = {};
                    for (const item of list) {
                        if (item && item.entity_id != null) {
                            hashMap[item.entity_id] = !!item.isThumbed;
                        }
                    }

                    set({ ThumbedMap: hashMap });

                } catch (error) {
                    console.error("刷新点赞映射失败:", error);
                }
            },
            clearThumbedMap: () => {
                set({ ThumbedMap: {} });
            },
            // 新增：仅更新 access token
            setAccessToken: (accessToken) => {
                set({ accessToken });
            },

            // 新增：更新 tokens 和 user_id
            setTokens: (userId, accessToken, refreshToken) => {
                set((state) => ({
                    user: state.user ? { ...state.user, user_id: userId } : { user_id: userId } as UserInfo,
                    accessToken,
                    refreshToken,
                    isLoggedIn: true,
                }));
            },

            logout: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isLoggedIn: false,
                    error: null,
                });
            },

            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isLoggedIn: state.isLoggedIn,
            }),
        }
    )
);