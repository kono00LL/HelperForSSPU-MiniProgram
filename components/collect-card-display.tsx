import { apiGetUserPosts } from '@/services/api'
import { usePostStore } from '@/store/postStore'
import { useUserStore } from '@/store/userStore'
import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native'
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
        <View className='flex-1'>
            <FlatList
                data={collectedPosts}
                renderItem={({ item }) => (
                    <PostCard post={item} />
                )}
                keyExtractor={(item) => item.post_id}
                contentContainerStyle={{ padding: 8, paddingBottom: 120 }}
                onEndReached={loadMorePage}
                onEndReachedThreshold={0.1}
                refreshing={refreshing}
            // ListFooterComponent={isLoading ? <ActivityIndicator /> : <Text>加载完成</Text>}
            />
        </View>
    )
}

export default CollectCardDisplay