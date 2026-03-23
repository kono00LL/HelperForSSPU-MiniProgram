import { usePostStore } from '@/store/postStore';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
const TEMPLATES = [
    require('@/assets/images/dis1.png'),
    require('@/assets/images/dis2.png'),
    require('@/assets/images/dis3.png'),
];

const CoverEdit = () => {
    const router = useRouter();
    const { width } = useWindowDimensions();

    const { draftTitle, setDraftTitle, addDraftImage, publishPost, clearDraft } = usePostStore();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isPublishing, setIsPublishing] = useState(false);
    const captureViewRef = useRef(null);

    const displayTitle = draftTitle.length > 10
        ? draftTitle.slice(0, 10) + '...'
        : draftTitle

    const handlePublish = async () => {
        if (!draftTitle.trim()) {
            Alert.alert('提示', '标题不能为空');
            return;
        }
        setIsPublishing(true);
        try {
            // 截图预览区 → 得到本地图片 URI
            const uri = await captureRef(captureViewRef, {
                format: 'jpg',
                quality: 0.9,
            });
            addDraftImage(uri);   // 加入草稿
            await publishPost();  // 发布

            Alert.alert('发布成功', '您的帖子已成功发布！', [
                {
                    text: '确定',
                    onPress: () => {
                        clearDraft();
                        router.push('/(tabs)');
                    },
                },
            ]);
        } catch (error) {
            console.error('发布失败:', error);
            Alert.alert('发布失败', '请稍后重试');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-nice-10">

            {/* 模板预览区（截图目标） */}
            {/* <View className="flex-1">
                <View className=" flex-1">
                    <PagerView
                        style={{ height: '90%' }}
                        initialPage={0}

                    // onPageSelected={(event) => setCurrentImageIndex(event.nativeEvent.position)}
                    >
                        {TEMPLATES.map((img, index) => (
                            <TouchableOpacity
                                key={index}

                            // style={{ flex: 1 }}
                            >
                                <Image
                                    source={img}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        ))}
                    </PagerView>
                </View>

            </View> */}
            {/* 截图目标区域 */}
            <View ref={captureViewRef} collapsable={false} style={{ flex: 1 }}>
                {/* 当前选中的模板图 */}
                <Image
                    source={TEMPLATES[selectedIndex]}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                />
                {/* 文字绝对定位叠加在图片上 */}
                <Text style={{
                    position: 'absolute',
                    bottom: 222,
                    left: 48,
                    right: 32,
                    color: '#23272e',
                    fontSize: 42,
                    fontWeight: 'bold',

                }}>
                    {displayTitle}
                </Text>
            </View>


            {/* 底部缩略图选择 */}
            <View
                className="flex-row justify-center items-center gap-2 px-4 py-2 rounded-lg"
            >
                {TEMPLATES.map((tpl, i) => (
                    <TouchableOpacity key={i} onPress={() => setSelectedIndex(i)}>
                        <Image
                            source={tpl}
                            style={{
                                width: 64, height: 48,
                                borderRadius: 6,
                                borderWidth: selectedIndex === i ? 2 : 0,
                                borderColor: '#3b82f6',
                            }}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                ))}
            </View>
            <View className="h-[80px] bg-white px-4 py-4">
                <View className=" bg-[#afbfce] rounded-xl ">
                    {/* <Text>标题</Text>
                    <Text>{displayTitle}</Text> */}
                    <TextInput
                        className="text-2xl font-bold py-4 "
                        placeholder={displayTitle}
                        placeholderTextColor="#23272e"
                        style={{ color: '#fff' }}
                        value={draftTitle}
                        onChangeText={setDraftTitle}
                        maxLength={30}
                    />
                </View>
            </View>



            {/* 标题输入框 */}

            {/* 发布按钮 */}
            <View className="px-4 mb-6">
                <TouchableOpacity
                    className={`py-3 rounded-full items-center ${isPublishing ? 'bg-gray-300' : 'bg-blue-700'}`}
                    onPress={handlePublish}
                    disabled={isPublishing}
                >
                    {isPublishing ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text className="text-white font-semibold text-base">发布</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default CoverEdit;