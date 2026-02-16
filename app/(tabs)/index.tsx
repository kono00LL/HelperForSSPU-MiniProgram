import CardDisplay from "@/components/card-display";
import TopTabBar from "@/components/top-tabbar";
import { useUserStore } from "@/store/userStore";
import { axiosRefreshInstance } from "@/Utils/request";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Index = () => {
  // 为0时处于默认index，为1时切换为活动界面
  const { setTokens } = useUserStore();
  const [activeTab, setActiveTab] = useState(0);
  const refreshThumbedMap = useUserStore((state) => state.refreshThumbedMap);
  const refreshCollectedMap = useUserStore((state) => state.refreshCollectedMap);
  const ThumbedMap = useUserStore((state) => state.ThumbedMap);
  useEffect(() => {
    // 刷新 token 的函数
    const refreshAccessToken = async () => {
      try {
        const response = await axiosRefreshInstance.get('/user/refresh');

        const { user_id, access_token, refresh_token } = response.data;

        setTokens(user_id, access_token, refresh_token);

      } catch (error) {
        console.error('刷新 token 失败:', error);
      }
    };

    // 首次进入立即刷新
    refreshAccessToken();
    refreshThumbedMap();
    refreshCollectedMap();

    // 设置定时器，每10分钟（600000毫秒）刷新一次
    const intervalId = setInterval(refreshAccessToken, 10 * 60 * 1000);

    // 清理定时器
    return () => {
      clearInterval(intervalId);
    };
  }, [setTokens]);


  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <View className=" flex-1 bg-gray-100">
          <TopTabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          {activeTab === 0 ? (
            <CardDisplay />
          ) : (
            <View className="flex-1">
              <Text className="text-2xl font-bold">
                活动界面
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};
export default Index;
