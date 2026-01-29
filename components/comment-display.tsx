import { Comment } from '@/interfaces/commentInfo';
import { apiGetComments } from '@/services/api';
import useCommentStore from '@/store/commentStore';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
interface CommentDisplayProps {
    post_id: string;
}


const CommentItem = ({ comment }: { comment: Comment }) => {

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
                        {comment.images && comment.images.length > 0 && (
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
                        )}

                        {/* 底部操作：回复数、点赞 */}
                        <View className="flex-row items-center mt-2 gap-4">

                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}
const CommentDisplay = ({ post_id }: CommentDisplayProps) => {

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    const [pageStack, setPageStack] = useState<number[]>([0])
    const pageSize = 40;
    const comments = useCommentStore((state) => state.comments[post_id])
    const addComments = useCommentStore((state) => state.addComments)


    const loadSinglePage = async (page: number) => {
        if (!hasMore) return;
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

    useEffect(() => {
        loadMorePage()
    }, [])

    const renderFooter = () => {
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
        <View className="flex-1 px-4 py-4">
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold">
                    评论
                </Text>
                <Text className="text-sm text-gray-500">{total}条评论</Text>

            </View>
            {/* 评论列表 */}
            <FlatList
                data={comments}
                renderItem={({ item }) => <CommentItem comment={item} />}
                keyExtractor={(item) => item.comment_id}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                nestedScrollEnabled
                scrollEnabled={false}
            />


        </View>

    )
}

export default CommentDisplay