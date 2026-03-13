import { icons } from '@/constants/icons';
import { UserProfileResponse, UserUpdateParams } from '@/interfaces/apiTypes';
import { apiGetUserProfile, apiUpdateUserInfo } from '@/services/api';
import { useUserStore } from '@/store/userStore';
import { Asset } from 'expo-asset';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';




const Edit = () => {
    const AVATARS = [
        { key: 'A1', source: icons.A1 },
        { key: 'A2', source: icons.A2 },
        { key: 'A3', source: icons.A3 },
        { key: 'A4', source: icons.A4 },
        { key: 'A5', source: icons.A5 },
    ];

    const { user, setUser } = useUserStore();
    const [profileData, setProfileData] = useState<UserProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // 本地状态
    const [avatarUri, setAvatarUri] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [gender, setGender] = useState<number>(0);
    const [city, setCity] = useState<string>('');

    // 性别选择器显示状态
    const [showGenderPicker, setShowGenderPicker] = useState(false);

    const [selectedAvatarKey, setSelectedAvatarKey] = useState<string>('A2');
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profileData = await apiGetUserProfile(user!.user_id, 1, 5);
                setProfileData(profileData);
                setAvatarUri(profileData?.user?.avatar_url || '');
                setUserName(profileData?.user?.user_name || '');
                setGender(profileData?.user?.gender || 0);
                setCity(profileData?.user?.city || '');
            } catch (error) {
                console.error('获取用户资料失败:', error);
            }
        }
        fetchUserProfile();
    }, [user?.user_id]);

    // 头像选择
    const handlePickAvatar = () => {
        setShowAvatarPicker(true);
    };
    // 保存修改
    const handleSave = async () => {
        if (!userName.trim()) {
            Alert.alert('提示', '昵称不能为空');
            return;
        }

        setIsLoading(true);
        try {
            const params: UserUpdateParams = {
                user_name: userName,
                gender: gender,
                city: city,
            };
            const selectedAvatar = AVATARS.find(a => a.key === selectedAvatarKey);
            if (selectedAvatar) {
                const asset = Asset.fromModule(selectedAvatar.source);
                await asset.downloadAsync();
                const localUri = asset.localUri;
                if (localUri) {
                    params.avatar = [localUri];
                }
            }

            console.log('发送更新请求:', params);
            const updatedUser = await apiUpdateUserInfo(params);
            console.log('更新成功:', updatedUser);

            // 更新本地状态
            if (user) {
                setUser(
                    { ...user, ...updatedUser },
                    useUserStore.getState().accessToken || '',
                    useUserStore.getState().refreshToken || ''
                );
            }

            Alert.alert('成功', '个人信息已更新', [
                { text: '确定', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error('更新失败:', error);
            Alert.alert('失败', '更新个人信息失败，请重试');
        } finally {
            setIsLoading(false);
        }
    };

    const genderOptions = [
        { label: '保密', value: 0 },
        { label: '男', value: 1 },
        { label: '女', value: 2 },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <Stack.Screen
                options={{
                    title: '',
                    headerShown: true,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text className="text-blue-500 text-base">取消</Text>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator size="small" />
                            ) : (
                                <Text className="text-blue-500 text-base font-semibold">保存</Text>
                            )}
                        </TouchableOpacity>
                    ),
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1">
                    {/* 头像 */}
                    <TouchableOpacity
                        className="bg-white py-6 items-center border-b border-gray-200"
                        onPress={handlePickAvatar}
                    >
                        <Image
                            source={AVATARS.find(a => a.key === selectedAvatarKey)?.source}
                            className="w-20 h-20 rounded-full bg-gray-200 mb-2"
                        />
                        <Text className="text-gray-500 text-sm">点击修改头像</Text>
                    </TouchableOpacity>

                    {/* 头像选择面板 */}
                    {showAvatarPicker && (
                        <View className="bg-white py-4 flex-row justify-around border-b border-gray-200">
                            {AVATARS.map((avatar) => (
                                <TouchableOpacity
                                    key={avatar.key}
                                    onPress={() => {
                                        setSelectedAvatarKey(avatar.key);
                                        setShowAvatarPicker(false);
                                    }}
                                >
                                    <Image
                                        source={avatar.source}
                                        className={`w-14 h-14 rounded-full ${selectedAvatarKey === avatar.key
                                            ? 'border-2 border-blue-500'
                                            : ''
                                            }`}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* 昵称 */}
                    <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
                        <Text className="text-gray-700 w-20">昵称</Text>
                        <TextInput
                            className="flex-1 text-right text-gray-900 text-base"
                            placeholder={'请输入昵称'}
                            value={userName}
                            onChangeText={setUserName}
                            maxLength={20}
                        />
                        <Text className="text-gray-400 ml-2">›</Text>
                    </View>

                    {/* 性别 */}
                    <TouchableOpacity
                        className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200"
                        onPress={() => setShowGenderPicker(!showGenderPicker)}
                    >
                        <Text className="text-gray-700 w-20">性别</Text>
                        <Text className="flex-1 text-right text-gray-900 text-base">
                            {profileData?.user?.gender || ''}
                        </Text>
                        <Text className="text-gray-400 ml-2">›</Text>
                    </TouchableOpacity>

                    {/* 性别选择器 */}
                    {showGenderPicker && (
                        <View className="bg-gray-50">
                            {genderOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    className="bg-white px-4 py-3 border-b border-gray-200"
                                    onPress={() => {
                                        setGender(option.value);
                                        setShowGenderPicker(false);
                                    }}
                                >
                                    <Text className={`text-base ${gender === option.value ? 'text-blue-500 font-semibold' : 'text-gray-700'}`}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* 城市 */}
                    {/* <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
                        <Text className="text-gray-700 w-20">城市</Text>
                        <TextInput
                            className="flex-1 text-right text-gray-900 text-base"
                            placeholder="上海"
                            value={city}
                            onChangeText={setCity}
                            maxLength={20}
                        />
                        <Text className="text-gray-400 ml-2">›</Text>
                    </View> */}

                    {/* 手机号（只读） */}
                    <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
                        <Text className="text-gray-700 w-20">手机号</Text>
                        <Text className="flex-1 text-right text-gray-400 text-base">
                            {profileData?.user?.user_phone_number || '未绑定'}
                        </Text>
                        <Text className="text-gray-400 ml-2">›</Text>
                    </View>

                    {/* ID号（只读） */}
                    <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
                        <Text className="text-gray-700 w-20">ID号</Text>
                        <Text className="flex-1 text-right text-gray-400 text-base">
                            {user?.user_id?.substring(0, 8) || ''}
                        </Text>
                        <Text className="text-gray-400 ml-2">›</Text>
                    </View>

                    {/* 邮箱号（只读） */}
                    <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
                        <Text className="text-gray-700 w-20">邮箱号</Text>
                        <Text className="flex-1 text-right text-gray-400 text-base">
                            {user?.user_email || '未绑定'}
                        </Text>
                        <Text className="text-gray-400 ml-2">›</Text>
                    </View>

                    {/* 其他 */}
                    <TouchableOpacity className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
                        <Text className="text-gray-700 w-20">其他</Text>
                        <Text className="text-gray-400 ml-2">›</Text>
                    </TouchableOpacity>

                    <View className="h-8" />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Edit;