import { icons } from "@/constants/icons";
import { UserProfileResponse } from "@/interfaces/apiTypes";
import { Post } from "@/interfaces/postInfo";
import { apiGetUserProfile, apiToggleThumb } from "@/services/api";
import { usePostStore } from "@/store/postStore";
import { useUserStore } from "@/store/userStore";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";


interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const ThumbedMap = useUserStore((state) => state.ThumbedMap);
  const post_id = post.post_id;
  const [localLiked, setLocalLiked] = useState(() => {
    return !!ThumbedMap[post_id];
  });
  const { user } = useUserStore();
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(null);

  const { width: screenWidth } = useWindowDimensions();
  const [swiperHeight, setSwiperHeight] = useState(200);

  const currentpost = usePostStore((state) => state.currentPost);
  const [localLikes, setLocalLikes] = useState(() => {
    return post?.likes || 0;
  });
  const [isRequesting, setIsRequesting] = useState(false);


  useEffect(() => {
    if (ThumbedMap[post_id] !== undefined) {
      setLocalLiked(!!ThumbedMap[post_id]);
    }
    const fetchUserProfile = async () => {
      try {
        const profileData = await apiGetUserProfile(post.user.user_id, 1, 5);
        setProfileData(profileData);
      } catch (error) {
        console.error('获取用户资料失败:', error);
      }
    }
    fetchUserProfile();
  }, [ThumbedMap, post_id, post.user.user_id]);

  useEffect(() => {
    if (!post?.images?.length) return;
    const promises = post.images.map(
      (img) =>
        new Promise<number>((resolve) => {
          Image.getSize(
            img.img_url,
            (w, h) => {
              const scaledHeight = (h / w) * (screenWidth * 0.45);
              resolve(scaledHeight);
            },
            () => resolve(100)
          );
        })
    );

    Promise.all(promises).then((heights) => {
      /**
       * 图片先进行判断，如果大小小于一定值，则为某个最小固定值
       * 如果大于最小值，则按照比例进行缩放，同时保证不低于最小值
       * 设置最大值，最后两者也就是缩放后的比例与轨道最大值取其最小值
       * 规定最小值为150，规定最大值为250
       */
      const MIN = 150;
      const MAX = 250;
      const maxHeight = Math.max(...heights);
      const clamped = Math.min(Math.max(maxHeight, MIN), MAX);
      setSwiperHeight(clamped);
    });
  }, [post?.images, screenWidth]);

  const onThumb = async () => {
    /**
     * 外部点赞流程
     * 检测以localliked为准
     * 先更新本地点赞状态，为旧状态的反值
     * 更新点赞表内数据
     * 调用借口更新服务器数据
     * 随后完全刷新点赞表
     * 如果失败，则回滚本地点赞状态
     */
    if (isRequesting) return;
    console.log(post?.likes);
    
    const newLocalLiked = !localLiked;
    const newLocalLikes = newLocalLiked ? localLikes + 1 : localLikes - 1;
    setIsRequesting(true);
    setLocalLiked(newLocalLiked);

    ThumbedMap[post_id] = newLocalLiked;
    try {
      await apiToggleThumb({
        entity_type: "post",
        entity_id: post_id,
        isThumbed: newLocalLiked,
      });
      setLocalLikes(prev => Math.max(0,newLocalLikes));
      const refreshThumbedMap = useUserStore.getState().refreshThumbedMap;
      await refreshThumbedMap();

    } catch (error) {
      console.error('Toggle thumb failed:', error);
      setLocalLiked(localLiked);
    } finally {
      setIsRequesting(false);
    }
  }

  return (
    <View className="bg-white p-1 shadow-md border-gray-600 border mb-2 mx-1">
      {/* 用户信息 */}
      <View className="mb-3 flex-row items-center">

        <TouchableOpacity
          onPress={() => router.push({
            pathname: "/users/[user_id]",
            params: {
              user_id: profileData?.user.user_id as string
            }
          })}
          className="flex-1 flex-row items-center"
        >
          <Image
            source={profileData?.user?.avatar_url
              ? { uri: profileData.user.avatar_url }
              : icons.A0}
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-base">
              {profileData?.user?.user_name || '未知用户'}
            </Text>
          </View>
        </TouchableOpacity>


        <TouchableOpacity className="flex-row items-center mr-2" onPress={onThumb} activeOpacity={1} >
          <Image source={localLiked ? icons.loveH : icons.love} className="size-6" />
        </TouchableOpacity>

        {/* <View className="ml-1">
          <Image source={icons.star} className="size-6" />
        </View> */}
      </View>

      {/*封面图*/}
      <TouchableOpacity>
        <Link href={`/posts/${post.post_id}`}>
          {post.images?.[0] && (
            <Image
              source={{ uri: post.images[0].img_url }}
              style={{ width: '100%', height: swiperHeight * 0.9 }}
              resizeMode="cover"
            />
          )}

          {/* 帖子标题 */}

          <View>
            <Text
              className="text-base font-bold mb-2"
              numberOfLines={2}
            >
              {post.title}

            </Text>
          </View>

        </Link>
      </TouchableOpacity>
    </View>
  );
};

export default PostCard;
