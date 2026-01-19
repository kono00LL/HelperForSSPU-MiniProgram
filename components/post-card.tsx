import { icons } from "@/constants/icons";
import { Post } from "@/interfaces/postInfo";
import { Link } from "expo-router";
import React from "react";
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
  return (
    <View className="w-[100%] bg-white p-4 rounded-lg shadow-md border-gray-200 border flex-1 justify-between">
      {/* 用户信息 */}
      <View className="flex-row items-center mb-3 bg-blue-800">
        <Image
          source={{ uri: post.user.avatar_url }}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-base">
            {post.user.user_name}
          </Text>
        </View>
        <View className="ml-6 bg-blue-800">
          <Text className="font-semibold text-base ml-1">
            <Image source={icons.love} className="size-6" />{" "}
            {post.likes}
          </Text>
        </View>
        <View className="ml-1 bg-blue-800">
          <Image source={icons.star} className="size-6" />
        </View>
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
