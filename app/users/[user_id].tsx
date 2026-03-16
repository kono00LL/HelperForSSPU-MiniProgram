import UserCardDisplay from "@/components/user-card-display";
import { images } from "@/constants/images";
import { UserProfileResponse } from "@/interfaces/apiTypes";
import { apiGetUserProfile } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UserDetails = () => {
    const { user_id } = useLocalSearchParams<{ user_id: string }>();
    const [activeTab, setActiveTab] = useState(0);
    const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);

    useEffect(() => {
        if (!user_id) {
            console.warn("user_id 无效，跳过获取用户资料");
            return;
        }
        const fetchUserProfile = async () => {
            try {
                const profileData = await apiGetUserProfile(user_id, 1, 5);
                setUserProfile(profileData);
            } catch (error) {
                console.error("获取用户资料失败:", error);
            }
        };
        fetchUserProfile();
    }, [user_id]);

    return (
        <SafeAreaView className="flex-1">
            {/* 用户栏 上板块 */}
            <View className="w-full h-[30%] bg-white">
                <ImageBackground
                    source={images.HomeBg}
                    className="bg-white w-full h-[85%]"
                    resizeMode="cover"
                >
                    {/* 返回按钮 */}
                    <TouchableOpacity onPress={() => router.push("/(tabs)")} className="ml-8 mt-2">
                        <Ionicons name="arrow-back" size={36} color="#000" />
                    </TouchableOpacity>
                    {/* 个人信息头部 */}
                    <View className="flex-row items-center justify-between mt-8 px-8 py-4">


                        {/* 头像和用户名 */}
                        <View className="flex-row items-center flex-1">
                            <Image
                                // @ts-ignore
                                source={{
                                    uri: userProfile?.user?.avatar_url || null,
                                }}
                                className="w-20 h-20 rounded-full bg-gray-200"
                            />
                            <Text className="ml-3 text-2xl font-semibold text-gray-900">
                                {userProfile?.user?.user_name || "加载中..."}
                            </Text>
                        </View>
                    </View>

                    {/* 统计信息 */}
                    <View className="flex-row items-center ml-2 px-2 mb-2">
                        <View className="items-center pr-4 pl-4">
                            <Text className="text-3xl text-gray-700">
                                {userProfile?.user?.likes || 0}
                            </Text>
                            <Text className="text-3xs text-gray-800 mt-1">获赞</Text>
                        </View>
                        <View className="items-center pr-4 pl-4">
                            <Text className="text-3xl text-gray-700">
                                {userProfile?.user?.follower_cnt || 0}
                            </Text>
                            <Text className="text-3xs text-gray-800 mt-1">关注</Text>
                        </View>
                        <View className="items-center pr-4 pl-4">
                            <Text className="text-3xl text-gray-700">
                                {userProfile?.user?.fans_cnt || 0}
                            </Text>
                            <Text className="text-3xs text-gray-800 mt-1">粉丝</Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>

            {/* 下方帖子/收藏 Tab */}
            <View className="flex-1">

                <View className="flex-1 bg-bg-100">
                    <UserCardDisplay user_id={userProfile?.user?.user_id || ""} />
                </View>

            </View>
        </SafeAreaView>
    );
};

export default UserDetails;