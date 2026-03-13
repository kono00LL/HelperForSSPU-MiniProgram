import CollectCardDisplay from "@/components/collect-card-display";
import UserCardDisplay from "@/components/user-card-display";
import UserTabBar from "@/components/user-tabbar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { UserProfileResponse } from "@/interfaces/apiTypes";
import { apiGetUserProfile } from "@/services/api";
import { useUserStore } from "@/store/userStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useUserStore();
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(null);

  useEffect(() => {
    if (!user?.user_id) {
      console.warn('user_id 无效，跳过获取用户资料');
      return;
    }
    const fetchUserProfile = async () => {
      try {
        const profileData = await apiGetUserProfile(user.user_id, 1, 5);
        setProfileData(profileData);
      } catch (error) {
        console.error('获取用户资料失败:', error);
      }
    }
    fetchUserProfile();
  }, [user?.user_id]);

  return (
    <SafeAreaView className="flex-1">
      {/* 用户栏 上板块 */}
      <View className="w-full h-[30%] bg-white">
        <ImageBackground
          source={images.HomeBg}
          className="bg-white w-full h-[85%]"
          resizeMode="cover">
          {/* 个人信息头部 */}
          <View className="flex-row items-center justify-between mt-8 px-8 py-8">
            {/* 头像和用户名 */}
            <View className="flex-row items-center">
              <Image
                source={{
                  uri: profileData?.user?.avatar_url || "http://101.132.107.118:54128/static/avatar_default/3.jpg"
                }}
                className="w-20 h-20 rounded-full bg-gray-200"
              />
              <Text className="ml-3 text-2xl font-semibold text-gray-900 " onPress={() => router.push('/edit')}>
                {profileData?.user?.user_name || "未登录"}
              </Text>
            </View>


          </View>

          {/* 统计信息 */}
          <View className="flex-row items-center ml-2 px-2 mb-2">
            <View className="items-center pr-4 pl-4">
              <Text className="text-3xl text-gray-700">{profileData?.user.likes || 0}</Text>
              <Text className="text-3xs text-gray-800 mt-1">获赞</Text>
            </View>
            <View className="items-center pr-4 pl-4">
              <Text className="text-3xl text-gray-700">{profileData?.user.follower_cnt || 0}</Text>
              <Text className="text-3xs text-gray-800 mt-1">关注</Text>
            </View>
            <View className="items-center pr-4 pl-4">
              <Text className="text-3xl text-gray-700">{profileData?.user.fans_cnt || 0}</Text>
              <Text className="text-3xs text-gray-800 mt-1">粉丝</Text>
            </View>

            {/* 推到最右边 */}
            <View className="flex-1 flex-row justify-end items-center">
              <TouchableOpacity className="mr-2">
                <Image source={icons.xiaoyuantong} className="w-40 h-16" resizeMode="contain" />
              </TouchableOpacity>
            </View>
          </View>

        </ImageBackground>

      </View>


      <View className="flex-1">
        <UserTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        {activeTab === 0 ? (
          <View className="flex-1 bg-bg-100">
            <UserCardDisplay user_id={profileData?.user?.user_id || ""} />
          </View>
        ) : (
          <View className="flex-1 bg-bg-100">
            <CollectCardDisplay user_id={profileData?.user?.user_id || ""} />
          </View>
        )}
      </View>

    </SafeAreaView>
  );
};

export default Profile;