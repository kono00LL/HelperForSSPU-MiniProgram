import UserCardDisplay from "@/components/user-card-display";
import UserTabBar from "@/components/user-tabbar";
import { UserProfileResponse } from "@/interfaces/apiTypes";
import { apiGetUserProfile } from "@/services/api";
import { useUserStore } from "@/store/userStore";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user, isLoggedIn, setUser, logout } = useUserStore();
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileData = await apiGetUserProfile(user?.user_id || "", 1, 5);
        setProfileData(profileData);
      } catch (error) {
        console.error('获取用户资料失败:', error);
      }
    }
    fetchUserProfile();
  });

  const displayUser = profileData?.user || user;
  return (
    <SafeAreaView className="flex-1">
      {/* 个人信息头部 */}
      <View className="bg-white px-4 py-5 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          {/* 头像和用户名 */}
          <View className="flex-row items-center">
            <Image
              source={{
                uri: displayUser?.avatar_url || "http://110.40.190.116:54128/static/avatar_default/3.jpg"
              }}
              className="w-16 h-16 rounded-full bg-gray-200"
            />
            <Text className="ml-3 text-lg font-semibold text-gray-900">
              {displayUser?.user_name || "未登录"}
            </Text>
          </View>

          {/* 校园通按钮 */}
          <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full">
            <Text className="text-sm text-gray-700">校园通</Text>
          </TouchableOpacity>
        </View>

        {/* 统计信息 */}
        <View className="flex-row justify-start ml-2 space-x-8">
          <View className="items-center">
            <Text className="text-xl font-bold text-gray-900">
              {user?.likes || 0}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">获赞</Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-gray-900">
              {user?.follower_cnt || 0}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">关注</Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-gray-900">
              {user?.fans_cnt || 0}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">粉丝</Text>
          </View>
        </View>
      </View>
      <View className="flex-1">
        <UserTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        {activeTab === 0 ? (
          <View className="flex-1">
            <UserCardDisplay user_id={displayUser?.user_id || ""} />
          </View>
        ) : (
          <View>
            <Text>收藏</Text>
          </View>
        )}
      </View>

    </SafeAreaView>
  );
};

export default Profile;