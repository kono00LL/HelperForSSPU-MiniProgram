// 安全导入：在 dev 模式下原生模块可能为 null，使用 require + try-catch 防止模块级崩溃
let MP_TYPE: any,
    SCENE: any,
    SCOPE: any,
    init: any,
    open: any,
    openMiniProgram: any,
    pay: any,
    sendAuthRequest: any,
    shareAudio: any,
    shareImage: any,
    shareMiniProgram: any,
    sharePage: any,
    shareText: any,
    shareVideo: any;

let _wechatAvailable = false;

try {
    const wechatModule = require('@react-native-hero/wechat');
    MP_TYPE = wechatModule.MP_TYPE;
    SCENE = wechatModule.SCENE;
    SCOPE = wechatModule.SCOPE;
    init = wechatModule.init;
    open = wechatModule.open;
    openMiniProgram = wechatModule.openMiniProgram;
    pay = wechatModule.pay;
    sendAuthRequest = wechatModule.sendAuthRequest;
    shareAudio = wechatModule.shareAudio;
    shareImage = wechatModule.shareImage;
    shareMiniProgram = wechatModule.shareMiniProgram;
    sharePage = wechatModule.sharePage;
    shareText = wechatModule.shareText;
    shareVideo = wechatModule.shareVideo;
    _wechatAvailable = true;
} catch (e) {
    console.warn('⚠️ @react-native-hero/wechat 原生模块不可用（可能在 Expo Go / dev 模式下），微信相关功能已禁用');
}

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

// 检查微信模块是否可用
export const isWechatAvailable = () => _wechatAvailable;

// 初始化微信 SDK
export const initWechat = () => {
    if (!_wechatAvailable) {
        console.warn('⚠️ 微信 SDK 不可用（dev 模式），跳过初始化');
        return { success: false, error: new Error('WeChat native module not available') };
    }
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
    if (!_wechatAvailable) {
        return { success: false, error: new Error('WeChat native module not available') };
    }
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
    if (!_wechatAvailable) {
        return { success: false, error: new Error('WeChat native module not available') };
    }
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
