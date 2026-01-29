import CardDisplay from "@/components/card-display";
import TopTabBar from "@/components/top-tabbar";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Index = () => {
  // 为0时处于默认index，为1时切换为活动界面
  const [activeTab, setActiveTab] = useState(0);

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
