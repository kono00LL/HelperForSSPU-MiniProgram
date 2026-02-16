import UserCardDisplay from "@/components/user-card-display";
import UserTabBar from "@/components/user-tabbar";
import { useUserStore } from "@/store/userStore";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const user = useUserStore((state) => state.user);
  const user_id = user?.user_id || "";
  return (
    <SafeAreaView className="flex-1">
      {/* 个人信息头部 */}
      <View className="bg-white px-4 py-5 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          {/* 头像和用户名 */}
          <View className="flex-row items-center">
            <Image
              source={{
                uri: user?.avatar_url || "http://110.40.190.116:54128/static/avatar_default/3.jpg"
              }}
              className="w-16 h-16 rounded-full bg-gray-200"
            />
            <Text className="ml-3 text-lg font-semibold text-gray-900">
              {user?.user_name || "未登录"}
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
            <UserCardDisplay user_id={user_id} />
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