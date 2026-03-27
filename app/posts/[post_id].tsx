import CommentDisplay from "@/components/comment-display";
import ImageView from "@/components/ImageViewer";
import { icons } from "@/constants/icons";
import { Post } from "@/interfaces/postInfo";
import { apiCreateComment, apiToggleCollect, apiToggleThumb } from "@/services/api";
import useCommentStore from "@/store/commentStore";
import { usePostStore } from "@/store/postStore";
import { useUserStore } from "@/store/userStore";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
interface PostProps {
  post: Post
}

const PostDetails = ({ post }: PostProps) => {
  const { post_id } = useLocalSearchParams<{ post_id: string }>();
  const currentPost = usePostStore((state) => state.currentPost);
  const isLoading = usePostStore((state) => state.isLoading);
  const [refreshing, setRefreshing] = useState(false)
  const error = usePostStore((state) => state.error);
  const fetchPostDetail = usePostStore((state) => state.fetchPostDetail);
  const clearCurrentPost = usePostStore((state) => state.clearCurrentPost);
  const [visible, setVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openAtIndex, setOpenAtIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const lastViewerIndexRef = useRef(0);

  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addComment = useCommentStore((state) => state.addComment);
  const clearComments = useCommentStore((state) => state.clearComments);


  const ThumbedMap = useUserStore((state) => state.ThumbedMap);
  const [localLiked, setLocalLiked] = useState(() => {
    return !!ThumbedMap[post_id];
  });
  const [localLikes, setLocalLikes] = useState(() => {
    return currentPost?.likes || 0;
    
  });
  const refreshThumbedMap = useUserStore((state) => state.refreshThumbedMap);
  const refreshCollectedMap = useUserStore((state) => state.refreshCollectedMap);

  const [isRequesting, setIsRequesting] = useState(false);

  const CollectedMap = useUserStore((state) => state.CollectedMap);

  const { width: screenWidth } = useWindowDimensions();
  const [swiperHeight, setSwiperHeight] = useState(200);

  useEffect(() => {
    if (!currentPost?.images?.length) return;

    const promises = currentPost.images.map(
      (img) =>
        new Promise<number>((resolve) => {
          Image.getSize(
            img.img_url,
            (w, h) => {
              const scaledHeight = (h / w) * (screenWidth - 16);
              resolve(scaledHeight);
            },
            () => resolve(100)
          );
        })
    );

    Promise.all(promises).then((heights) => {

      const maxHeight = Math.max(...heights);
      setSwiperHeight(Math.min(maxHeight, screenWidth * 2));
    });
  }, [currentPost?.images, screenWidth]);

  useEffect(() => {
    if (ThumbedMap[post_id] !== undefined) {
      setLocalLiked(!!ThumbedMap[post_id]);
    }
  }, [ThumbedMap, post_id]);

  useEffect(() => {
    if (currentPost?.likes !== undefined) {
      setLocalLikes(currentPost.likes);
    }
  }, [currentPost?.post_id]); // 只在切换帖子时同步，不响应 likes 变化（避免覆盖本地操作）


  const [localCollected, setLocalCollected] = useState(() => {
    return !!CollectedMap[post_id];
  });

  const previewImage = useMemo(
    () => currentPost?.images.map(item => ({ uri: item.img_url })) as { uri: string }[],
    [currentPost?.images]
  );


  const onViewerIndexChange = useCallback((index: number) => {
    // #region agent log
    console.log('[DBG-17daf6][post-fix] onViewerIndexChange newIndex=', index, 'openAtIndex=', openAtIndex);
    // #endregion
    lastViewerIndexRef.current = index;
    setCurrentImageIndex(index);
  }, [openAtIndex]);

  const handleImagePress = (index: number) => {
    // #region agent log
    console.log('[DBG-17daf6][post-fix] handleImagePress pressedIndex=', index, 'openAtIndex=', openAtIndex);
    // #endregion
    setOpenAtIndex(index);
    setVisible(true);
  }

  // #region agent log
  console.log('[DBG-17daf6][post-fix] render', { currentImageIndex, openAtIndex, visible, images: previewImage?.length ?? 0, pagerHasRef: !!pagerRef.current });
  // #endregion


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

  const onThumb = async () => {
    console.log("currentpost.likes", currentPost?.likes);
    
    if (isRequesting) return;
    
    const newLocalLiked = !localLiked;
    setIsRequesting(true);
    const newLocalLikes = newLocalLiked ? localLikes + 1 : localLikes - 1;
    setLocalLiked(newLocalLiked);
    setLocalLikes(prev => Math.max(0,newLocalLikes));
    ThumbedMap[post_id] = newLocalLiked;
    try {
      await apiToggleThumb({
        entity_type: "post",
        entity_id: post_id,
        isThumbed: newLocalLiked,
      });

      const refreshThumbedMap = useUserStore.getState().refreshThumbedMap;
      await refreshThumbedMap();

    } catch (error) {
      console.error('Toggle thumb failed:', error);
      setLocalLiked(localLiked);
      setLocalLikes(prev => Math.max(0,newLocalLikes));

    } finally {
      setIsRequesting(false);
    }
  }


  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchPostDetail(post_id),
        refreshThumbedMap(),
        refreshCollectedMap(),
      ]);
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
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
      <View className="flex-1 bg-white justify-center items-center">
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
      <StatusBar backgroundColor="#6c92b6" style="dark" />
      <SafeAreaView className="flex-1" edges={['left', 'right']}>
        <KeyboardAvoidingView
          className="flex-1 "
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        >
          { /* 顶部区域 */}
          <View className="flex-row px-4 py-3 bg-nice-100">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-20 mt-10"
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push({
                pathname: "/users/[user_id]",
                params: {
                  user_id: currentPost.user.user_id
                }
              })}
              className="flex-row items-center mt-4"
            >
              <Image
                source={{ uri: currentPost?.user?.avatar_url }}
                className="w-10 h-10 rounded-full ml-10 mt-2"
              />
              <Text className="ml-3 text-mediummt-5" style={{ fontFamily: 'OPPOSans-Bold' }}>
                {currentPost.user.user_name}
              </Text>
            </TouchableOpacity>

          </View>
          <ScrollView keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: 40
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }>


            {/* 图片区域 */}
            <View className="flex-1">
              {currentPost.images && currentPost.images.length > 0 ? (
                <View className="px-2 py-2" style={{ height: swiperHeight }}>
                  <PagerView
                    ref={pagerRef}
                    style={{ height: swiperHeight ,backgroundColor: '#eaecf0' }}
                    initialPage={0}
                    pageMargin={10}
                    orientation="horizontal"
                    onPageSelected={(event) => setCurrentImageIndex(event.nativeEvent.position)}
                  >
                    {currentPost.images.map((img, index) => (
                      <TouchableOpacity
                        key={img.img_id}
                        activeOpacity={0.9}
                        onPress={() => handleImagePress(index)}
                      >
                        <ExpoImage
                          source={{ uri: img.img_url }}
                          style={{ width: '100%', height: swiperHeight || 200 }}
                          contentFit="contain"
                        />
                      </TouchableOpacity>
                    ))}
                  </PagerView>
                </View>
              ) :
                <View className="h-[300px] px-2 py-2 bg-gray-100 ">
                  <Text className="text-center text-gray-400">没有图片</Text>
                </View>}
            </View>

            {/* 帖子内容区域 */}
            <View className="flex-1 py-8 px-2">
              {/* 标题 */}
              <Text className="text-3xl mb-3"
              style={{ fontFamily: 'OPPOSans-Bold' }}>
                {currentPost.title}
              </Text>

              {/* 正文 */}
              <Text className="text-lg leading-6 text-gray-700 mb-2 px-6"
              style={{ fontFamily: 'OPPOSans-Regular' }}>
                {currentPost.content}
              </Text>


            </View>
            <TouchableOpacity className="flex-row items-center ml-4" onPress={onThumb}>
              <Image source={localLiked ? icons.loveH : icons.love} className="size-6" />
              <Text className="font-semibold text-base ml-2">
                {localLikes}
              </Text>
            </TouchableOpacity>

            {/* 评论区域 */}
            <View className="min-h-[200px]">
              <CommentDisplay post_id={post_id} user_id={currentPost.user.user_id} />
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
            <TouchableOpacity onPress={onCollect} activeOpacity={1} disabled={isRequesting} >
              <Image source={localCollected ? icons.starH : icons.star} className="size-6" />
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>


      </SafeAreaView>
      <ImageView
        currentIndex={openAtIndex}
        images={previewImage}
        imageIndex={openAtIndex}
        visible={visible && (previewImage?.length ?? 0) > 0}
        onRequestClose={() => {
          setVisible(false);
          pagerRef.current?.setPage(lastViewerIndexRef.current);
        }}
        onImageIndexChange={onViewerIndexChange}
      />

    </>
  )
};

export default PostDetails;
