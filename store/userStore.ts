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
    accessToken: string | null;
    refreshToken: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;

    setUser: (user: UserInfo, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;


}
export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
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