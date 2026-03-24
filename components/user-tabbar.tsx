import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TopTabBarProps {
	activeTab: number; 
	onTabChange: (index: number) => void;
}

const UserTabBar = ({
	activeTab,
	onTabChange,
}: TopTabBarProps) => {
	return (
		<View className="h-[34px] w-full flex-row bg-nice-100 border-b border-gray-100">
			{/* 已发布帖子 Tab */}
			<TouchableOpacity
				className="flex-1 items-center justify-center relative"
				onPress={() => onTabChange(0)}
				activeOpacity={0.7}
			>
				<Text
					className={
						activeTab === 0
							? "font-bold text-white text-base"
							: "text-gray-300 text-base"
					}
				>
					发布
				</Text>
				{/* 下划线指示器 */}
				{activeTab === 0 && (
					<View className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600" />
				)}
			</TouchableOpacity>

			{/* 收藏帖子 Tab */}
			<TouchableOpacity
				className="flex-1 items-center justify-center relative"
				onPress={() => onTabChange(1)}
				activeOpacity={0.7}
			>
				<Text
					className={
						activeTab === 1
							? "font-bold text-white text-base"
							: "text-gray-300 text-base"
					}
				>
					收藏
				</Text>
				{/* 下划线指示器 */}
				{activeTab === 1 && (
					<View className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600" />
				)}
			</TouchableOpacity>
		</View>
	);
};

export default UserTabBar;