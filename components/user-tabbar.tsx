import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TopTabBarProps {
	activeTab: number; // 0: 已发布帖子, 1: 收藏帖子
	onTabChange: (index: number) => void;
}

const UserTabBar = ({
	activeTab,
	onTabChange,
}: TopTabBarProps) => {
	return (
		<View className="h-[34px] w-full flex-row overflow-hidden bg-gray-300 relative">
			{/* 顶部高光效果 */}
			<View className="absolute top-0 left-0 right-0 h-[1px] bg-white/30 z-10" />

			{/* 已发布帖子 Tab */}
			<TouchableOpacity
				className={`flex-1 items-center justify-center ${activeTab === 0 ? "bg-gray-300" : "bg-gray-300"}`}
				onPress={() => onTabChange(0)}
				activeOpacity={0.7}
			>
				<Text
					className={
						activeTab === 0
							? "font-bold text-white"
							: "text-white"
					}
				>
					发布
				</Text>
			</TouchableOpacity>

			{/* 收藏帖子 Tab */}
			<TouchableOpacity
				className={`flex-1 items-center justify-center ${activeTab === 1 ? "bg-gray-300" : "bg-gray-300"}`}
				onPress={() => onTabChange(1)}
				activeOpacity={0.7}
			>
				<Text
					className={
						activeTab === 1
							? "font-bold text-white"
							: "text-white"
					}
				>
					收藏
				</Text>
			</TouchableOpacity>

			{/* 底部高光效果 */}
			<View className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/30 z-10" />
		</View>
	);
};

export default UserTabBar;