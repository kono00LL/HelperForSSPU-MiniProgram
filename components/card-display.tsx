import { apiGetPosts } from '@/services/api'
import { usePostStore } from '@/store/postStore'
import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import PostCard from './post-card'

const CardDisplay = () => {

    const [hasMore, setHasMore] = useState(true)
    const pageSize = 10;
    const [pageStack, setPageStack] = useState<number[]>([0])
    const [refreshing, setRefreshing] = useState(false)
    const postList = usePostStore((state) => state.postList)
    const addPosts = usePostStore((state) => state.addPosts)
    const clearPosts = usePostStore((state) => state.clearPosts)

    const leftPosts = postList.filter((_, i) => i % 2 === 0);
    const rightPosts = postList.filter((_, i) => i % 2 === 1);


    useEffect(() => {
        loadMorePage()
    }, [])

    const loadSinglePage = async (page: number) => {
        if (!hasMore) return;
        try {
            const response = await apiGetPosts(page, pageSize)
            if (page > response.total_pages) {
                setHasMore(false)
                return;
            }
            addPosts(response.items)

        } catch (error) {
            console.error(`Load ${page} page failed:`, error)
        }

    }

    const loadMorePage = async () => {
        if (!hasMore) {
            setRefreshing(false)
            return;
        }

        try {
            const nextPage = pageStack[pageStack.length - 1] + 1
            setPageStack([...pageStack, nextPage])

            await Promise.all([
                loadSinglePage(nextPage),
            ])

        } catch (error) {
            setHasMore(false)
            console.error(`Load more page failed:`, error)
        } finally {
            setRefreshing(false)
        }

    }

    const handleRefresh = async () => {
        setRefreshing(true);
        clearPosts();
        setPageStack([0]);
        setHasMore(true);
        try {
            const response = await apiGetPosts(1, pageSize);
            if (1 > response.total_pages) {
                setHasMore(false);
            } else {
                addPosts(response.items);
                setPageStack([0, 1]);
            }
        } catch (error) {
            console.error("Refresh failed:", error);
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <View className="flex-1">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 80 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                onScroll={({ nativeEvent }) => {
                    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                    const isNearBottom =
                        layoutMeasurement.height + contentOffset.y >= contentSize.height - 200; // 距底 200px 触发
                    if (isNearBottom && hasMore) {
                        loadMorePage();
                    }
                }}
                scrollEventThrottle={200}
            >
                <View className="flex-row px-1 ">
                    {/* 左列 */}
                    <View className="flex-1 py-2 ">
                        {leftPosts.map(post => (
                            <View key={post.post_id} className="mb-3">
                                <PostCard post={post} />
                            </View>
                        ))}
                    </View>
                    {/* 右列 */}
                    <View className="flex-1 ">
                        {rightPosts.map(post => (
                            <View key={post.post_id} className="mb-3">
                                <PostCard post={post} />
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>

    )
}

export default CardDisplay