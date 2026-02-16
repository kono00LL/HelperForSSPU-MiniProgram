import { wechatLogin } from '@/Utils/wechat';
import { apiWechatLogin } from '@/services/authApi';
import { useUserStore } from '@/store/userStore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WechatTest = () => {
    const [loading, setLoading] = useState(false);
    const { user, isLoggedIn, setUser, logout } = useUserStore();

    // 处理微信登录
    const handleWechatLogin = async () => {
        if (loading) return; // 防止重复点击

        setLoading(true);
        try {
            const wechatResult = await wechatLogin();

            if (!wechatResult.success || !wechatResult.data?.code) {
                Alert.alert('登录失败', '微信授权失败，请重试');
                return;
            }

            const code = wechatResult.data.code;

            // 2. 立即将 code 发送到后端（避免过期）
            const loginResponse = await apiWechatLogin(code);

            // 3. 保存用户信息和 token 到本地
            setUser(
                loginResponse.user,
                loginResponse.access_token,
                loginResponse.refresh_token
            );

            Alert.alert('登录成功', `欢迎回来，${loginResponse.user.user_name || '用户'}！`);

        } catch (error: any) {
            console.error('❌ 登录流程失败:', error);

            // 更详细的错误提示
            let errorMessage = '请检查网络连接';
            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.message) {
                errorMessage = error.message;
            }

            Alert.alert('登录失败', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // 处理退出登录
    const handleLogout = () => {
        Alert.alert('确认退出', '确定要退出登录吗？', [
            { text: '取消', style: 'cancel' },
            {
                text: '确定',
                style: 'destructive',
                onPress: () => {
                    logout();
                    Alert.alert('已退出', '您已成功退出登录');
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>微信登录测试</Text>

            {isLoggedIn && user ? (
                // 已登录状态
                <View style={styles.userInfo}>
                    <Text style={styles.welcomeText}>欢迎回来！</Text>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>用户ID:</Text>
                        <Text style={styles.infoValue}>{user.user_id}</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>用户名:</Text>
                        <Text style={styles.infoValue}>{user.user_name || '未设置'}</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>城市:</Text>
                        <Text style={styles.infoValue}>{user.city || '未设置'}</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>粉丝数:</Text>
                        <Text style={styles.infoValue}>{user.fans_cnt || 0}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutButtonText}>退出登录</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // 未登录状态
                <View style={styles.loginSection}>
                    <Text style={styles.description}>
                        点击下方按钮使用微信登录
                    </Text>

                    <TouchableOpacity
                        style={[styles.wechatButton, loading && styles.buttonDisabled]}
                        onPress={handleWechatLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.wechatButtonText}>微信登录</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 40,
    },
    loginSection: {
        alignItems: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    wechatButton: {
        backgroundColor: '#07C160',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 8,
        minWidth: 200,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    wechatButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    userInfo: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#07C160',
        textAlign: 'center',
        marginBottom: 20,
    },
    infoCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    logoutButton: {
        marginTop: 30,
        backgroundColor: '#ff4d4f',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default WechatTest;