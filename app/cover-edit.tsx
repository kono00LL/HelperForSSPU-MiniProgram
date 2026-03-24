import { usePostStore } from '@/store/postStore';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot, { captureRef } from 'react-native-view-shot';
const TEMPLATES = [
    require('@/assets/images/dis1b.png'),
    require('@/assets/images/dis2b.png'),
    require('@/assets/images/dis3b.png'),
];

const CoverEdit = () => {
    const router = useRouter();

    const { draftTitle, setDraftTitle, addDraftImage, publishPost, clearDraft } = usePostStore();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isPublishing, setIsPublishing] = useState(false);
    const captureViewRef = useRef<ViewShot>(null);


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
                format: 'png',
                quality: 0.9,
            });
            addDraftImage(uri);   
            await publishPost();  

            Alert.alert('发布成功', '您的帖子已成功发布！', [
                {
                    text: '确定',
                    onPress: () => {
                        clearDraft();
                        router.push('/(tabs)');
                    },
                },
            ]);
        } catch (error:any) {
            const detail: string = error?.response?.data?.detail ?? "";
            const isTitleTooShort = detail.includes("标题长度必须在");
            console.error('发布失败:', error);
            Alert.alert('发布失败', '请稍后重试');
            if(isTitleTooShort) {
                Alert.alert("发布失败", "标题字数不足（至少 3 个字符）");
            }
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-nice-10">
<KeyboardAvoidingView
          className="flex-1 "
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        >
            {/* 截图目标区域 */}
            <ViewShot 
            ref={captureViewRef} 
            options={{ format: 'png', quality: 1 }}
            style={{ flex: 1 }} 
            >
                {/* 当前选中的模板图 */}
                <Image
                    source={TEMPLATES[selectedIndex]}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                />
                {/* 文字绝对定位叠加在图片上 */}
                <Text style={{
                    position: 'absolute',
                    bottom: 218,
                    left: 60,
                    right: 48,
                    color: '#23272e',
                    fontSize: 40,
                    fontFamily: 'OPPOSans-Light',

                }}>
                    {displayTitle}
                </Text>
            </ViewShot>


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
               {/* 标题输入框 */}
            <View className="h-[120px] bg-white px-4 py-4">
                <View className=" bg-[#afbfce] rounded-xl ">
                    <TextInput
                        className="text-2xl font-bold py-4"   
                        placeholder={displayTitle}
                        placeholderTextColor="#23272e"
                        style={{ color: '#fff', fontFamily: 'OPPOSans-Regular' }}
                        value={draftTitle}
                        onChangeText={setDraftTitle}
                        maxLength={30}
                    />
                </View>
            </View>

         

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
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default CoverEdit;