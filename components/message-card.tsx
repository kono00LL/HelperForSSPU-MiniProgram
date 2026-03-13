import { NotificationItem } from "@/interfaces/apiTypes";
import React from "react";
import {
    Text,
    View
} from "react-native";

interface MessageCardProps {
    message: NotificationItem
}
const MessageCard = ({ message }: MessageCardProps) => {
    if (!message) return null;

    const { id, actor_id, type, target_type, target_id, content, created_at } = message;
    return (
        <View className="w-[100%] bg-white p-4 rounded-lg shadow-md border-gray-200 border mb-2">
            {/* 帖子标题 */}
            <View className="flex-row items-center mb-3">
                <Text>{actor_id}</Text>
            </View>
            <Text className="text-sm text-gray-600">{content}</Text>
        </View>
    );
};

export default MessageCard;
