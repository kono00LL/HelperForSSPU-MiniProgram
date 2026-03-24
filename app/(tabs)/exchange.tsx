import { images } from "@/constants/images";
import React from "react";
import { ImageBackground, Text, View } from "react-native";
const exchange = () => {
  return (
    <View>
      <Text>exchange1</Text>
      <ImageBackground
        source={images.HomeBg}
        className="bg-nice-100 w-full h-[50%]"
        resizeMode="cover">
      </ImageBackground>
      {/* <Image source={images.HomeBg} className="size-12" resizeMode="cover" /> */}

      <Text>exchange3</Text>

    </View>
  );
};

export default exchange;
