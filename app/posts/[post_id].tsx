import CommentDisplay from "@/components/comment-display";
import { icons } from "@/constants/icons";
import { Post } from "@/interfaces/postInfo";
import { usePostStore } from "@/store/postStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface PostProps {
  post: Post
}

const PostDetails = ({ post }: PostProps) => {
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
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          className="flex-1 "
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        // contentContainerStyle={{ flex: 1, backgroundColor: 'red' }}
        // keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
        >
          <ScrollView keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: 280  // 200(评论) + 60(输入框) + 20(额外空间)
            }}>

            { /* 顶部区域 */}
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
            {/* 图片区域 */}
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
            <View className="flex-1">
              {/* 标题 */}
              <Text className="text-2xl font-bold mb-3">
                {currentPost.title}
              </Text>

              {/* 正文 */}
              <Text className="text-base leading-6 text-gray-700 mb-4">
                {currentPost.content},
                **《放松时光：与你共享Lo-Fi故事》**是一款帮助你专注于工作的有声小说游戏，让你与喜爱写小说、
                充满幻想的少女——聪音（Satone）一起在书桌前工作。去自由定义那些展现聪音情感的Lofi音乐、环境音和风景吧，能帮助自己更专注于工作！
                随着你投入更多时间与她共度，彼此的信任关系将逐渐加深，或许你们的心灵也能真正相通……？
              </Text>


            </View>

            {/* 评论区域 */}
            <View className="min-h-[200px]">
              <CommentDisplay post_id={post_id!} />
            </View>
          </ScrollView>



          {/* 底部区域 */}
          <View className="h-[60px] w-full bg-blue-800 flex-row items-center px-4">
            <TextInput
              className="flex-1 bg-gray-100 rounded-full px-4 mr-2"
              placeholder="发表评论..."
              placeholderTextColor="#9CA3AF"
              cursorColor="#3b82f6"
            />

            {/* 点赞按钮在右侧 */}
            <TouchableOpacity className="flex-row items-center ml-4">
              <Image source={icons.love} className="size-6" />
              <Text className="font-semibold text-base ml-2">
                {currentPost.likes}
              </Text>
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>



      </SafeAreaView>

    </>
  )



};

export default PostDetails;
