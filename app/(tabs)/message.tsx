import MessageCardDisplay from "@/components/message-card-display";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const explore = () => {
  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        {/* 顶部栏 */}
        <View className="text-2xl font-bold border-b border-gray-200">
          <View className="items-center justify-between">
            <View className="flex-row items-center py-2 ">
              <Text className="text-lg text-gray-900"
                style={{ fontFamily: 'OPPOSans-Regular' }}
              >
                消息
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-1">
          <MessageCardDisplay />
        </View>
      </SafeAreaView>
    </>
  );
};

export default explore;
