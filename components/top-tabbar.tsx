import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TopTabBarProps {
  activeTab: number; // 0: 校园新闻, 1: 学生讨论
  onTabChange: (index: number) => void;
}

const TopTabBar = ({
  activeTab,
  onTabChange,
}: TopTabBarProps) => {
  return (
    <View className="h-[44px] w-full bg-gray-300 flex-row rounded-b-3xl text-white">
      {/* 校园新闻 Tab */}
      <TouchableOpacity
        className={`flex-1 items-center justify-center ${
          activeTab === 0 ? "bg-white" : ""
        }`}
        onPress={() => onTabChange(0)}
      >
        <Text
          className={
            activeTab === 0
              ? "font-bold text-black"
              : "text-white"
          }
        >
          校园新闻
        </Text>
      </TouchableOpacity>

      {/* 学生讨论 Tab */}
      <TouchableOpacity
        className={`flex-1 items-center justify-center ${
          activeTab === 1 ? "bg-white" : ""
        }`}
        onPress={() => onTabChange(1)}
      >
        <Text
          className={
            activeTab === 1
              ? "font-bold text-black"
              : "text-white"
          }
        >
          学生讨论
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TopTabBar;
