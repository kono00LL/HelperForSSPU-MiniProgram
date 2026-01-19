import { usePostStore } from "@/store/postStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const PostDetails = () => {
  const { post_id } = useLocalSearchParams<{ post_id: string }>();
  const currentPost = usePostStore((state) => state.currentPost);
  const isLoading = usePostStore((state) => state.isLoading);
  const error = usePostStore((state) => state.error);
  const fetchPostDetail = usePostStore((state) => state.fetchPostDetail);
  const clearCurrentPost = usePostStore((state) => state.clearCurrentPost);

  useEffect(() => {
    if (post_id) {
      fetchPostDetail(post_id);
    }
    return () => {
      clearCurrentPost();
    };
  }, [post_id]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-center text-gray-400 mt-4">Loading...</Text>
      </View>
    )
  }
  if (error || !currentPost) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg mb-4">
          {"加载帖子失败"}
        </Text>
        <TouchableOpacity
          onPress={() => post_id && fetchPostDetail(post_id)}
          className="bg-blue-900 px-6 py-2 rounded-full"
        >
          <Text className="text-white font-semibold">重试</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <>
      <SafeAreaView className="flex-1">
        <View className="flex-row px-4 py-3 border-blue-800">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-20"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Image
            source={{ uri: currentPost?.user?.avatar_url }}
            className="w-10 h-10 rounded-full ml-10"
          />
          <Text className="ml-3 text-base font-semibold flex-1">
            {currentPost.user.user_name}
          </Text>
        </View>
        <View className="flex-1">
          {currentPost.images && currentPost.images.length > 0 ? (
            <View className="h-[50vh]">
              <Image
                source={{ uri: currentPost.images[0].img_url }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          ) : null}
        </View>

        {/* 帖子内容区域 */}
        <View className="px-4 py-4 flex-1">
          {/* 标题 */}
          <Text className="text-2xl font-bold mb-3">
            {currentPost.title}
          </Text>

          {/* 正文 */}
          <Text className="text-base leading-6 text-gray-700 mb-4">
            {currentPost.content}
          </Text>

        </View>
        <View>
          <Text>
            测试文本
          </Text>
        </View>



      </SafeAreaView>
      <View className="h-20 w-full bg-blue-600">\

      </View>
    </>
  )



};

export default PostDetails;
