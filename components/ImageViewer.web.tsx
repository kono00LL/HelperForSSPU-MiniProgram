// Web 平台不支持 react-native-image-viewing，提供一个空的占位组件
import React from "react";
import { View } from "react-native";

const ImageViewer = (_props: any) => {
  if (!_props.visible) return null;
  return <View />;
};

export default ImageViewer;






