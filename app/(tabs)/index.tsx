import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-gray-100">
        <Text>index1</Text>
      </View>
    </SafeAreaView>
  );
};

export default index;
