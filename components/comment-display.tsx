import { icons } from '@/constants/icons';
import { UserProfileResponse } from '@/interfaces/apiTypes';
import { Comment } from '@/interfaces/commentInfo';
import { apiGetComments, apiGetUserProfile, apiToggleThumb } from '@/services/api';
import useCommentStore from '@/store/commentStore';
import { useUserStore } from '@/store/userStore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

interface CommentDisplayProps {
    post_id: string;
    user_id: string;
}
const CommentItem = ({ comment }: { comment: Comment }) => {
    const CommentThumbedMap = useUserStore((state) => state.CommentThumbedMap);
    const comment_id = comment.comment_id;
    const [localLiked, setLocalLiked] = useState(false);
    const [profileData, setProfileData] = useState<UserProfileResponse | null>(null);
    const { user } = useUserStore();

    const { width: screenWidth } = useWindowDimensions();
    const [swiperHeight, setSwiperHeight] = useState(100);

    useEffect(() => {
        if (CommentThumbedMap[comment_id] !== undefined) {
            setLocalLiked(!!CommentThumbedMap[comment_id]);
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


    }, [CommentThumbedMap, comment_id, user?.user_id]);

    useEffect(() => {
        if (!comment?.images?.length) return;
        const promises = comment.images.map(
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
    }, [comment?.images, screenWidth]);


    const onThumb = async () => {
        const newLocalLiked = !localLiked;
        setLocalLiked(newLocalLiked);

        CommentThumbedMap[comment_id] = true;
        try {
            await apiToggleThumb({
                entity_type: "comment",
                entity_id: comment_id,
                isThumbed: newLocalLiked,
            });

            const refreshCommentThumbedMap = useUserStore.getState().refreshCommentThumbedMap;
            await refreshCommentThumbedMap();

        } catch (error) {
            console.error('Toggle thumb failed:', error);
            setLocalLiked(localLiked);
        }
    }

    return (
        <>
            <View className="py-3 border-b border-gray-100">
                <View className="flex-row">
                    {/* 左侧头像 */}
                    <Image
                        source={{ uri: comment.user.avatar_url }}
                        className="w-10 h-10 rounded-full"
                    />

                    {/* 中间内容区 */}
                    <View className="flex-1 ml-3">

                        <Text className="text-sm font-semibold text-gray-900 mb-1">
                            {comment.user.user_name}
                        </Text>

                        <Text className="text-sm text-gray-700 leading-5 mb-2">
                            {comment.content}
                        </Text>

                        {/* 评论图片 */}
                        {/* {comment.images && comment.images.length > 0 && (
                            <View className="flex-row flex-wrap mt-2">
                                {comment.images.map((img) => (
                                    <Image
                                        key={img.img_id}
                                        source={{ uri: img.img_url }}
                                        className="w-24 h-24 rounded mr-2 mb-2"
                                        resizeMode="cover"
                                    />
                                ))}
                            </View>
                        )} */}

                        {/* 底部操作：回复数、点赞 */}
                        <View className="flex-row items-center  gap-4">
                            <TouchableOpacity className="flex-row ml-[200px]">
                                <Image source={icons.message} className="size-6" />
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-row items-center ml-4" onPress={onThumb} activeOpacity={1} >
                                <Image source={localLiked ? icons.loveH : icons.love} className="size-6" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}
const CommentDisplay = ({ post_id }: CommentDisplayProps) => {

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false)
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    const [pageStack, setPageStack] = useState<number[]>([0])
    const pageSize = 40;
    const comments = useCommentStore((state) => state.comments[post_id])
    const addComments = useCommentStore((state) => state.addComments)
    const clearComments = useCommentStore((state) => state.clearComments)


    const loadSinglePage = async (page: number) => {
        if (!hasMore) return;
        setLoading(true);
        try {
            const response = await apiGetComments(post_id, page, pageSize)
            setTotal(response.total)
            if (page > response.total_pages) {
                setHasMore(false)
                return;
            }
            addComments(post_id, response.items)
        } catch (error) {
            console.error(`Load comment ${page} page failed:`, error)
        } finally {
            setLoading(false);
        }
    }

    const loadMorePage = async () => {
        if (!hasMore) return;
        try {
            const nextPage = pageStack[pageStack.length - 1] + 1
            setPageStack([...pageStack, nextPage])
            await Promise.all([
                loadSinglePage(nextPage),
            ])

        } catch (error) {
            setHasMore(false)
            console.error(`Load more comment page failed:`, error)
        }

    }

    const handleRefresh = async () => {
        setRefreshing(true);
        clearComments(post_id);
        setPageStack([0]);
        setHasMore(true);
        try {
            const response = await apiGetComments(post_id, 1, pageSize);
            if (1 > response.total_pages) {
                setHasMore(false);
            } else {
                addComments(post_id, response.items);
                setPageStack([0, 1]);
            }
        } catch (error) {
            console.error("Refresh failed:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadMorePage()
    }, [])

    const renderFooter = () => {
        if (loading) return (
            <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#3b82f6" />
            </View>
        )
        if (!hasMore) return (
            <View>
                <Text className="py-4 text-center text-gray-400 text-sm">
                    没有更多评论了
                </Text>
            </View>
        )


    }
    const renderEmpty = () => {
        return (
            <View>
                <Text className="text-gray-400">暂无评论</Text>
            </View>
        )
    }

    return (
        <View className="flex-1 px-4 py-4 ">
            <View className="flex-row items-center justify-between mb-4 -mx-4 bg-nice-100">
                <Text className="text-lg font-bold text-white py-1 px-4">
                    评论{total}
                </Text>
                {/* TODO 评论栏最好做成吸顶 */}
            </View>
            {/* 评论列表 */}
            {/* TODO 组件样式还能再优化一些 */}
            <FlatList
                data={comments}
                renderItem={({ item }) => <CommentItem comment={item} />}
                keyExtractor={(item) => item.comment_id}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                nestedScrollEnabled
                style={{ width: '100%' }}
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEnabled={false}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
        </View>

    )
}

export default CommentDisplay