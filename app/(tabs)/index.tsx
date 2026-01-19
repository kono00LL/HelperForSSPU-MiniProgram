import PostCard from "@/components/post-card";
import TopTabBar from "@/components/top-tabbar";
import localGetPosts from "@/constants/mocks/GetPosts.json";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  // 为0时处于默认index，为1时切换为活动界面
  const [activeTab, setActiveTab] = useState(0);
  const posts = localGetPosts.items;

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <View className="flex-1 bg-gray-100">
          <TopTabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          {activeTab === 0 ? (
            <FlatList
              data={posts}
              renderItem={({ item }) => (
                <PostCard post={item} />
              )}
              keyExtractor={(item) => item.post_id}
              contentContainerStyle={{ padding: 16 }}
            />
          ) : (
            <View>
              <Text className="text-2xl font-bold">
                index2
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};
export default Index;
