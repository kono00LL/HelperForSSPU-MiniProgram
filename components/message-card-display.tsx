import { apiGetUnreadNotifications } from '@/services/api'
import { useMessageStore } from '@/store/messageStore'
import React, { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import MessageCard from './message-card'

const CardDisplay = () => {

    const [hasMore, setHasMore] = useState(true)
    const pageSize = 10;
    const [pageStack, setPageStack] = useState<number[]>([0])
    const [refreshing, setRefreshing] = useState(false)
    const messageList = useMessageStore((state) => state.messageList)
    const addMessages = useMessageStore((state) => state.addMessages)

    useEffect(() => {
        loadMorePage()
    })

    const loadSinglePage = async (page: number) => {
        if (!hasMore) return;
        try {
            const response = await apiGetUnreadNotifications(page, pageSize)
            if (page > response.total_pages) {
                setHasMore(false)
                return;
            }
            addMessages(response.items)

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
                data={messageList}
                renderItem={({ item }) => (
                    <MessageCard message={item} />
                )}
                keyExtractor={(item) => String(item?.id ?? Math.random())}
                contentContainerStyle={{ padding: 8, paddingBottom: 120 }}
                onEndReached={loadMorePage}
                onEndReachedThreshold={0.1}
                refreshing={refreshing}
                onRefresh={() => { }}
                ListEmptyComponent={<Text className="text-center text-gray-400 mt-8">暂无消息</Text>}
            />
        </View>
    )
}

export default CardDisplay