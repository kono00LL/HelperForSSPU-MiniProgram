import { apiGetUserPosts } from '@/services/api'
import { usePostStore } from '@/store/postStore'
import { useUserStore } from '@/store/userStore'
import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import PostCard from './post-card'


interface UserCardDisplayProps {
    user_id: string;
}

const CollectCardDisplay = ({ user_id }: UserCardDisplayProps) => {

    const [posts, setPosts] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const pageSize = 5;
    const [pageStack, setPageStack] = useState<number[]>([0])
    const [refreshing, setRefreshing] = useState(false)
    const userPostList = usePostStore((state) => state.userPostList)
    const addUserPosts = usePostStore((state) => state.addUserPosts)

    const CollectedMap = useUserStore((state) => state.CollectedMap)
    const collectedPosts = userPostList.filter(post => CollectedMap[post.post_id])


    const leftPosts = collectedPosts.filter((_, i) => i % 2 === 0);
    const rightPosts = collectedPosts.filter((_, i) => i % 2 === 1);


    useEffect(() => {
        if (!user_id || user_id.trim() === "") {
            console.warn("user_id 无效");
            return;
        }

        loadMorePage()
    }, [])

    const loadSinglePage = async (page: number) => {
        if (!hasMore) return;
        try {
            const response = await apiGetUserPosts(user_id, page, pageSize)
            if (page > response.total_pages) {
                setHasMore(false)
                return;
            }
            addUserPosts(response.items)

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

    return (
        <View className="flex-1 py-2">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 80 }}
                onScroll={({ nativeEvent }) => {
                    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                    const isNearBottom =
                        layoutMeasurement.height + contentOffset.y >= contentSize.height - 200; // 距底 200px 触发
                    if (isNearBottom && hasMore) {
                        loadMorePage();
                    }
                }}
                scrollEventThrottle={300}
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

export default CollectCardDisplay