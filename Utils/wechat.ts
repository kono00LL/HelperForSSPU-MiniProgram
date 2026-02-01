import {
    MP_TYPE,
    SCENE,
    SCOPE,
    init,
    open,
    openMiniProgram,
    pay,
    sendAuthRequest,
    shareAudio,
    shareImage,
    shareMiniProgram,
    sharePage,
    shareText,
    shareVideo,
} from '@react-native-hero/wechat';

const WECHAT_APP_ID = 'wxd6296407cab2f81c';
const UNIVERSAL_LINK = '';

// 初始化微信 SDK
export const initWechat = () => {
    try {
        init({
            appId: WECHAT_APP_ID,
            universalLink: UNIVERSAL_LINK,
        });
        console.log('✅ 微信 SDK 初始化成功');
        return { success: true };
    } catch (error) {
        console.error('❌ 微信 SDK 初始化失败:', error);
        return { success: false, error };
    }
};

// 微信登录
export const wechatLogin = async () => {
    try {
        const response = await sendAuthRequest({
            scope: SCOPE.USER_INFO,
        });
        console.log('✅ 微信授权成功:', response);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('❌ 微信授权失败:', error);
        return { success: false, error };
    }
};

// 打开微信 APP
export const openWeChat = async () => {
    try {
        await open();
        return { success: true };
    } catch (error) {
        console.error('❌ 打开微信失败:', error);
        return { success: false, error };
    }
};

// 导出所有功能供高级使用
export {
    MP_TYPE, SCENE, SCOPE, openMiniProgram,
    pay, shareAudio, shareImage, shareMiniProgram, sharePage, shareText, shareVideo
};

