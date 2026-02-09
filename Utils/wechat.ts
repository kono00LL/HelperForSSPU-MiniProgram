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

// 定义微信授权返回的数据类型
export interface WechatAuthResponse {
    code: string;        // 用于换取access_token的临时票据，有效期10分钟
    state?: string;      // 第三方程序发送时用来标识的唯一性标志
    lang?: string;       // 微信客户端当前语言
    country?: string;    // 微信用户当前国家信息
}

export interface WechatLoginResult {
    success: boolean;
    data?: WechatAuthResponse;
    error?: any;
}

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
export const wechatLogin = async (): Promise<WechatLoginResult> => {
    try {
        console.log('正在拉起微信授权...');

        const response = await sendAuthRequest({
            scope: SCOPE.USER_INFO,
        });

        console.log('✅ 微信授权成功，返回数据:', response);

        // response.data 包含 code
        if (response?.data?.code) {
            return {
                success: true,
                data: response.data as WechatAuthResponse
            };
        } else {
            console.warn('⚠️ 微信返回数据中没有 code:', response);
            return {
                success: false,
                error: new Error('未获取到授权码')
            };
        }
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

