import { icons } from "@/constants/icons";
import { UserProfileResponse } from "@/interfaces/apiTypes";
import { Post } from "@/interfaces/postInfo";
import { apiGetUserProfile, apiToggleThumb } from "@/services/api";
import { useUserStore } from "@/store/userStore";
import { Image as ExpoImage } from "expo-image";
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
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(null);

  const { width: screenWidth } = useWindowDimensions();
  const [swiperHeight, setSwiperHeight] = useState(200);

  const [localLikes, setLocalLikes] = useState(() => {
    return post?.likes || 0;
  });
  const [isRequesting, setIsRequesting] = useState(false);

  const coverUrl = post.images?.[0]?.img_url;


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
      const MIN = 150;
      const MAX = 250;
      const maxHeight = Math.max(...heights);
      const clamped = Math.min(Math.max(maxHeight, MIN), MAX);
      setSwiperHeight(clamped);
    });
  }, [post?.images, screenWidth]);

  const isAnimatedImage = (url:string) => {
    if (!url) return false;
    return /\.(gif|webp)(\?|#|$)/i.test(url);
  };

  const isAnimated = isAnimatedImage(coverUrl);

  const onThumb = async () => {
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
              user_id: post?.user.user_id as string
            }
          })}
          className="flex-1 flex-row items-center"
        >
          <Image
            source={post?.user?.avatar_url
              ? { uri: post.user.avatar_url }
              : icons.A0}
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-base">
              {post?.user?.user_name || '未知用户'}
            </Text>
          </View>
        </TouchableOpacity>


        <TouchableOpacity className="flex-row items-center mr-2" onPress={onThumb} activeOpacity={1} >
          <Image source={localLiked ? icons.loveH : icons.love} className="size-6" />
        </TouchableOpacity>

      </View>
{/* TODO 如果是GIF或者其他动图，展示为静态图 */}
      {/*封面图*/}
      <TouchableOpacity>
        <Link href={`/posts/${post.post_id}`}>
          {post.images?.[0] && (
            <ExpoImage
              source={coverUrl}
              style={{ width: '100%', height: swiperHeight * 0.9 }}
              contentFit="cover"
              cachePolicy="memory-disk"
              autoplay={!isAnimated}
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
