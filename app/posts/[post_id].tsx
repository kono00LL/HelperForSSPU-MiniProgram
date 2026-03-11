import CommentDisplay from "@/components/comment-display";
import ImageView from "@/components/ImageViewer";
import { icons } from "@/constants/icons";
import { Post } from "@/interfaces/postInfo";
import { apiCreateComment, apiToggleCollect } from "@/services/api";
import useCommentStore from "@/store/commentStore";
import { usePostStore } from "@/store/postStore";
import { useUserStore } from "@/store/userStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

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
  const [visible, setVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addComment = useCommentStore((state) => state.addComment);

  const ThumbedMap = useUserStore((state) => state.ThumbedMap);
  const refreshThumbedMap = useUserStore((state) => state.refreshThumbedMap);
  const refreshCollectedMap = useUserStore((state) => state.refreshCollectedMap);

  const CollectedMap = useUserStore((state) => state.CollectedMap);

  const { width: screenWidth } = useWindowDimensions();
  const [swiperHeight, setSwiperHeight] = useState(100);

  useEffect(() => {
    if (!currentPost?.images?.length) return;

    const promises = currentPost.images.map(
      (img) =>
        new Promise<number>((resolve) => {
          Image.getSize(
            img.img_url,
            (w, h) => {
              const scaledHeight = (h / w) * (screenWidth - 16);
              console.log('scaledHeight, screenWidth', scaledHeight, screenWidth);

              resolve(scaledHeight);
            },
            () => resolve(100)
          );
        })
    );

    Promise.all(promises).then((heights) => {

      const maxHeight = Math.max(...heights);
      console.log('maxHeight, screenWidth * 1.1', maxHeight, screenWidth * 1.1);
      setSwiperHeight(Math.min(maxHeight, screenWidth * 2));
      console.log('swiperHeight', swiperHeight);
    });
  }, [currentPost?.images, screenWidth]);


  const [localCollected, setLocalCollected] = useState(() => {
    return !!CollectedMap[post_id];
  });

  const previewImage = currentPost?.images.map(item => ({
    uri: item.img_url,
  })) as { uri: string; }[];

  const handleImagePress = (index: number) => {
    setVisible(true);
    setCurrentImageIndex(index);
  }


  const handleSendComment = async () => {
    if (!commentText.trim()) {
      Alert.alert("提示", "评论内容不能为空");
      return;
    }

    if (!post_id) {
      Alert.alert("错误", "帖子ID不存在");
      return;
    }
    setIsSubmitting(true);
    try {
      const newComment = await apiCreateComment(
        post_id,
        commentText.trim() + "喵",
        null,
        null // 对帖子直接评论，parent_comment_id为null
      );
      addComment(post_id, newComment);
      setCommentText("");

      Alert.alert("成功", "评论发表成功！");
    } catch (error: any) {
      console.error("发表评论失败:", error);
      Alert.alert(
        "发表失败",
        error.response?.data?.message || error.message || "请稍后重试"
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  const onCollect = async () => {
    const newLocalCollected = !localCollected;
    setLocalCollected(newLocalCollected);
    CollectedMap[post_id] = true;
    try {
      await apiToggleCollect(post_id);
      const refreshCollectedMap = useUserStore.getState().refreshCollectedMap;
      await refreshCollectedMap();
      console.log('CollectedMap', CollectedMap);

    } catch (error) {
      console.error('Toggle collect failed:', error);
      setLocalCollected(localCollected);
    }
  };


  useEffect(() => {
    refreshThumbedMap();
    refreshCollectedMap();
    if (CollectedMap[post_id] !== undefined) {
      setLocalCollected(!!CollectedMap[post_id]);
    }
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
          { /* 顶部区域 */}
          <View className="flex-row px-4 py-3">
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
          <ScrollView keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: 40
            }}>


            {/* 图片区域 */}
            <View className="flex-1">
              {currentPost.images && currentPost.images.length > 0 ? (
                <View className="px-2 py-2" style={{ height: swiperHeight * 1.1 }}>
                  <Swiper
                    style={{ height: '100%' }}
                    showsButtons={false}
                    loop={false}
                    dot={
                      <View style={{
                        backgroundColor: '#ccc',
                        width: 12,
                        height: 8,
                        borderRadius: 4,
                        marginLeft: 3,
                        marginRight: 3,
                      }} />
                    }
                    activeDot={
                      <View style={{
                        backgroundColor: '#ddd',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginLeft: 3,
                        marginRight: 3,
                      }} />
                    }
                    paginationStyle={{
                      bottom: 10,
                    }}
                    onIndexChanged={(index) => setCurrentImageIndex(index)}
                  >
                    {currentPost.images.map((img, index) => (
                      <TouchableOpacity
                        key={img.img_id}
                        activeOpacity={0.9}
                        onPress={() => handleImagePress(index)}
                      // style={{ flex: 1 }}
                      >
                        <Image
                          source={{ uri: img.img_url }}
                          style={{ width: '100%', height: swiperHeight }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    ))}
                  </Swiper>
                  <Text>{swiperHeight}</Text>

                </View>
              ) :
                <View className="h-[50vh] px-2 py-2 bg-white ">
                  <Text className="text-center text-gray-400">没有图片</Text>
                </View>}
            </View>

            {/* 帖子内容区域 */}
            <View className="flex-1 py-8">
              {/* 标题 */}
              <Text className="text-3xl font-bold mb-3">
                {currentPost.title}
              </Text>

              {/* 正文 */}
              <Text className="text-base leading-6 text-gray-700 mb-4">
                {currentPost.content}
              </Text>


            </View>
            <TouchableOpacity className="flex-row items-center ml-4">
              <Image source={ThumbedMap[post_id] ? icons.loveH : icons.love} className="size-6" />
              <Text className="font-semibold text-base ml-2">
                {currentPost.likes}
              </Text>
            </TouchableOpacity>

            {/* 评论区域 */}
            <View className="min-h-[200px]">
              <CommentDisplay post_id={post_id!} />
            </View>

          </ScrollView>

          {/* 底部区域 */}
          <View className="h-[60px] w-full bg-[#b0bcbf] flex-row items-center px-4">
            <TextInput
              className="flex-1 bg-gray-100 rounded-full px-4 mr-2"
              placeholder="发表评论..."
              placeholderTextColor="#9CA3AF"
              cursorColor="#3b82f6"
              value={commentText}
              onChangeText={setCommentText}
              onSubmitEditing={handleSendComment}
              returnKeyType="send"
              editable={!isSubmitting}
            />

            {/* 发送按钮 */}
            <TouchableOpacity
              onPress={handleSendComment}
              disabled={isSubmitting || !commentText.trim()}
              className={`bg-gray-300 rounded-full px-4 py-2 mr-2 ${(isSubmitting || !commentText.trim()) ? 'opacity-50' : ''
                }`}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-semibold">发送</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={onCollect} activeOpacity={1} >
              <Image source={localCollected ? icons.starH : icons.star} className="size-6" />
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>


      </SafeAreaView>
      <ImageView
        images={previewImage}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />

    </>
  )
};

export default PostDetails;
