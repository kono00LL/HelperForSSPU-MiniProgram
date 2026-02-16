import { icons } from "@/constants/icons";
import { Post } from "@/interfaces/postInfo";
import { apiToggleThumb } from "@/services/api";
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

  useEffect(() => {
    if (ThumbedMap[post_id] !== undefined) {
      setLocalLiked(!!ThumbedMap[post_id]);
    }
  }, [ThumbedMap, post_id]);

  const onThumb = async () => {
    console.log('last localLiked', localLiked);
    const newLocalLiked = !localLiked;
    setLocalLiked(newLocalLiked);
    console.log('new localLiked', newLocalLiked);

    ThumbedMap[post_id] = true;
    try {
      await apiToggleThumb({
        entity_type: "post",
        entity_id: post_id,
        isThumbed: newLocalLiked,
      });
      console.log(ThumbedMap);

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
          source={{ uri: post.user.avatar_url }}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-base">
            {post.user.user_name}
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
