import CardDisplay from "@/components/card-display";
import TopTabBar from "@/components/top-tabbar";
import { useUserStore } from "@/store/userStore";
import { axiosRefreshInstance } from "@/Utils/request";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Index = () => {
  const { setTokens } = useUserStore();
  const [activeTab, setActiveTab] = useState(0);
  const refreshThumbedMap = useUserStore((state) => state.refreshThumbedMap);
  const refreshCollectedMap = useUserStore((state) => state.refreshCollectedMap);
  const ThumbedMap = useUserStore((state) => state.ThumbedMap);
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await axiosRefreshInstance.get('/user/refresh');

        const { user_id, access_token, refresh_token } = response.data;

        setTokens(user_id, access_token, refresh_token);

      } catch (error) {
        console.error('刷新 token 失败:', error);
      }
    };

    refreshAccessToken();
    refreshThumbedMap();
    refreshCollectedMap();

    const intervalId = setInterval(refreshAccessToken, 10 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [setTokens]);


  return (
    <>
      <StatusBar style="dark" backgroundColor="#6c92b6" />
      <SafeAreaView className="flex-1 bg-nice-100" edges={['top', 'left', 'right']}>
        <View className=" flex-1 bg-bg-100">

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
