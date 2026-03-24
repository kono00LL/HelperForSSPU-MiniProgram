import { usePostStore } from "@/store/postStore";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
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
    addDraftImage,
    publishPost,
  } = usePostStore();

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePickImage = async () => {
    if (draftImages.length >= 9) {
      Alert.alert("最多上传9张图片");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      selectionLimit: 9 - draftImages.length, 
      quality: 0.8,
    });
    if (result.canceled || !result.assets) return;

    result.assets.forEach((asset) => {
      if (asset.uri) {
        addDraftImage(asset.uri);
      }
    });
  }

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
            router.push("/(tabs)"); 
          },
        },
      ]);
    } catch (error: any) {
      console.error("发布失败:", error);

      const detail: string = error?.response?.data?.detail ?? "";

      const isTitleTooShort = detail.includes("标题长度必须在");
      const isContentTooShort = detail.includes("内容长度必须在");

      if (isTitleTooShort && isContentTooShort) {
        Alert.alert("发布失败", "标题和正文字数不足，请补充后再发布");
      } else if (isTitleTooShort) {
        Alert.alert("发布失败", "标题字数不足（至少 3 个字符）");
      } else if (isContentTooShort) {
        Alert.alert("发布失败", "正文字数不足（至少 5 个字符）");
      } else {
        Alert.alert("发布失败", "请稍后重试");
      }
    } finally {
      setIsPublishing(false);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* 顶部导航栏 */}
        <View className="flex-row items-center justify-between px-4 py-3">
          {/* 左侧关闭按钮 */}
          <TouchableOpacity
            onPress={() => {
              clearDraft();
              router.back();
            }}
          >
            <Text className="text-2xl text-gray-600">✕</Text>
          </TouchableOpacity>

          {/**
           * 对于发布按钮
           * 如果isPublishing  则加载
           * 如果draftImages.length<1 ,则为继续，否则为发布,跳转至cover-edit页面
           */}
          <TouchableOpacity
            className={`px-5 py-2 rounded-full ${draftTitle.trim().length > 2 && draftContent.trim().length > 5 && !isPublishing
              ? "bg-blue-700"
              : "bg-gray-300"
              }`}
            disabled={!draftTitle.trim() || !draftContent.trim() || isPublishing}
            onPress={draftImages.length < 1 ? () => router.push('/cover-edit') : handlePublish}
          >
            {isPublishing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {draftImages.length < 1 ? "下一步" : "发布"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View className=" bg-nice-10 px-2 mx-3 mt-3 grow rounded-xl">
          {/* 标题输入框 */}
          <View className=" bg-nice-20 rounded-xl mt-2 mb-2 px-2">
            <TextInput
              className="text-xl font-bold py-4 "
              placeholder="请输入标题"
              placeholderTextColor="#f9f9f9"
              style={{ color: '#f9f9f9' }}
              value={draftTitle}
              onChangeText={setDraftTitle}
              maxLength={30}
            />
          </View>


          {/* 正文输入框 */}
          <View className="flex-1 px-2 bg-white rounded-xl border-[3px] border-gray-200">
            <TextInput
              className="text-base py-4 min-h-[300px]"
              placeholder="请输入正文内容..."
              placeholderTextColor="#9CA3AF"
              value={draftContent}
              onChangeText={setDraftContent}
              multiline
              textAlignVertical="top"
            />
          </View>


          {/* 图片上传 */}
          <View className="flex-row flex-wrap gap-2 mt-2 px-4">
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

            {/* 添加图片按钮 */}
            {draftImages.length < 9 && (
              <TouchableOpacity
                className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 items-center justify-center bg-gray-50"
                onPress={handlePickImage}
              >
                <Text className="text-3xl text-gray-400">+</Text>
                <Text className="text-xs text-gray-400 mt-1">
                  {draftImages.length}/9
                </Text>
              </TouchableOpacity>
            )}
          </View>

        </View>



        {/*        
        <View className="flex-row items-center px-4 py-3 border-t border-gray-200">



        </View> */}
      </ScrollView>

    </SafeAreaView>
  );
};

export default Post;