import { icons } from "@/constants/icons";
import { usePostStore } from "@/store/postStore";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
  } = usePostStore();

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
          className={`px-5 py-2 rounded-full ${draftTitle.trim() && draftContent.trim()
            ? "bg-blue-800"
            : "bg-gray-300"
            }`}
          disabled={!draftTitle.trim() || !draftContent.trim()}
        >
          <Text className="text-white font-semibold text-base">发布</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
        {/* 标题输入框 */}
        <TextInput
          className="text-xl font-bold py-4 border-b border-gray-100"
          placeholder="请输入标题"
          placeholderTextColor="#9CA3AF"
          value={draftTitle}
          onChangeText={setDraftTitle}
          maxLength={50}
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
        {draftImages.length > 0 && (
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
        )}
      </ScrollView>

      {/* 底部工具栏 */}
      <View className="flex-row items-center px-4 py-3 border-t border-gray-200">
        <Text>底部工具栏</Text>
        {/* 相册选择 */}
        <TouchableOpacity className="mr-4">
          <Image source={icons.album} className="w-7 h-7" />
        </TouchableOpacity>

        {/* 拍照 */}
        <TouchableOpacity className="mr-4">
          <Image source={icons.camera} className="w-7 h-7" />
        </TouchableOpacity>

        {/* 表情 */}
        <TouchableOpacity>
          <Image source={icons.emoji} className="w-7 h-7" />
        </TouchableOpacity>

        {/* 图片数量提示 */}
        {draftImages.length > 0 && (
          <Text className="ml-auto text-gray-400 text-sm">
            {draftImages.length}/9
          </Text>
        )}

      </View>
    </SafeAreaView>
  );
};

export default Post;