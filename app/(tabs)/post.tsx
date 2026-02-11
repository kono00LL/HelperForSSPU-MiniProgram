import { usePostStore } from "@/store/postStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Post = () => {
  const router = useRouter();
  const {
    draftTitle,
    draftContent,
    draftImages,
    setDraftTitle,
    setDraftContent,
    removeDraftImage,
    clearDraft,
    publishPost,
  } = usePostStore();

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!draftTitle.trim() || !draftContent.trim()) return;

    try {
      setIsPublishing(true);
      await publishPost();
      Alert.alert("发布成功", "您的帖子已成功发布！", [
        {
          text: "确定",
          onPress: () => {
            clearDraft();
            router.push("/(tabs)"); // 返回首页
          },
        },
      ]);
    } catch (error) {
      console.error("发布失败:", error);
      Alert.alert("发布失败", "请稍后重试");
    } finally {
      setIsPublishing(false);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 顶部导航栏 */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        {/* 左侧关闭按钮 */}
        <TouchableOpacity
          onPress={() => {
            clearDraft();
            router.back();
          }}
        >
          <Text className="text-2xl text-gray-600">✕</Text>
        </TouchableOpacity>

        {/* 右侧发布按钮 */}
        <TouchableOpacity
          className={`px-5 py-2 rounded-full ${draftTitle.trim() && draftContent.trim() && !isPublishing
            ? "bg-blue-700"
            : "bg-gray-300"
            }`}
          disabled={!draftTitle.trim() || !draftContent.trim() || isPublishing}
          onPress={handlePublish}
        >
          {isPublishing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">发布</Text>
          )}
        </TouchableOpacity>
      </View>


      {/* 标题输入框 */}
      <TextInput
        className="text-xl font-bold py-4 border-b border-gray-100"
        placeholder="请输入标题"
        placeholderTextColor="#9CA3AF"
        value={draftTitle}
        onChangeText={setDraftTitle}
        maxLength={30}
      />

      {/* 正文输入框 */}
      <TextInput
        className="text-base py-4 min-h-[200px]"
        placeholder="请输入正文内容..."
        placeholderTextColor="#9CA3AF"
        value={draftContent}
        onChangeText={setDraftContent}
        multiline
        textAlignVertical="top"
      />
      {/* // TODO:图片预览和底部都被覆盖无法正常显示 */}
      {/* 图片预览区域 */}

      <View className="flex-row flex-wrap gap-2 mt-2">
        <Text>图片预览区域</Text>
        {draftImages.map((uri, index) => (
          <View key={index} className="relative">
            <Image
              source={{ uri }}
              className="w-24 h-24 rounded-lg"
            />
            <TouchableOpacity
              className="absolute -top-2 -right-2 bg-black/60 rounded-full w-5 h-5 items-center justify-center"
              onPress={() => removeDraftImage(index)}
            >
              <Text className="text-white text-xs">✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>



      {/* 底部工具栏 */}
      <View className="flex-row items-center px-4 py-3 border-t border-gray-200">
        <Text>底部工具栏</Text>

      </View>
    </SafeAreaView>
  );
};

export default Post;