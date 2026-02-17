import { icons } from "@/constants/icons";
import { UserProfileResponse } from "@/interfaces/apiTypes";
import { Post } from "@/interfaces/postInfo";
import { apiGetUserProfile, apiToggleThumb } from "@/services/api";
import { useUserStore } from "@/store/userStore";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
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


  useEffect(() => {
    if (ThumbedMap[post_id] !== undefined) {
      setLocalLiked(!!ThumbedMap[post_id]);
    }
    const fetchUserProfile = async () => {
      try {
        const profileData = await apiGetUserProfile(user!.user_id, 1, 5);
        setProfileData(profileData);
      } catch (error) {
        console.error('获取用户资料失败:', error);
      }
    }
    fetchUserProfile();
  }, [ThumbedMap, post_id, user?.user_id]);

  const onThumb = async () => {
    const newLocalLiked = !localLiked;
    setLocalLiked(newLocalLiked);

    ThumbedMap[post_id] = true;
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
    }
  }

  return (
    <View className="w-[100%] bg-white p-4 rounded-lg shadow-md border-gray-200 border mb-2">
      {/* 用户信息 */}
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: profileData?.user?.avatar_url || 'http://110.40.190.116:54128/static/avatar_default/3.jpg' }}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-base">
            {profileData?.user?.user_name || ''}
          </Text>
        </View>
        <View className="ml-6">
          <TouchableOpacity className="flex-row items-center ml-4" onPress={onThumb} activeOpacity={1} >
            <Image source={localLiked ? icons.loveH : icons.love} className="size-6" />
          </TouchableOpacity>
        </View>
        {/* <View className="ml-1">
          <Image source={icons.star} className="size-6" />
        </View> */}
      </View>

      {/* 帖子标题 */}
      <Link href={`/posts/${post.post_id}`} asChild>
        <TouchableOpacity>
          <Text
            className="text-base font-bold mb-2"
            numberOfLines={2}
          >
            {post.title}
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default PostCard;
