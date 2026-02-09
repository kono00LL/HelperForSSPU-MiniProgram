第一步：请求 CODE
移动应用微信授权登录

开发者需要配合使用微信开放平台提供的 SDK 进行授权登录请求接入。正确接入 SDK 后并拥有相关授权域（scope）权限后，开发者移动应用会在终端本地拉起微信应用进行授权登录，微信用户确认后微信将拉起开发者移动应用，并带上授权临时票据（code）。

iOS 平台应用授权登录接入代码示例（请参考 iOS 接入指南）：


-(void)sendAuthRequest
{
	//构造SendAuthReq结构体
	SendAuthReq* req =[[[SendAuthReq alloc]init]autorelease];
	req.scope = @"snsapi_userinfo"; // 只能填 snsapi_userinfo
	req.state = @"123";
	//第三方向微信终端发送一个SendAuthReq消息结构
	[WXApi sendReq:req];
}

Android 平台应用授权登录接入代码示例（请参考 Android 接入指南）：

{
	// send oauth request
	final SendAuth.Req req = new SendAuth.Req();
	req.scope = "snsapi_userinfo"; // 只能填 snsapi_userinfo
	req.state = "wechat_sdk_demo_test";
	api.sendReq(req);
}

鸿蒙Next 平台应用授权登录接入代码实例 （请参考 鸿蒙接入指南）：

{
  let req = new wxopensdk.SendAuthReq;
  req.scope = "snsapi_userinfo"; // 只能填 snsapi_userinfo
  req.state = "wechat_sdk_demo_test";
  this.wxApi.sendReq(getContext(this) as common.UIAbilityContext, req)
}
参数说明

参数	是否必须	说明
appid	是	应用唯一标识，在微信开放平台提交应用审核通过后获得
scope	是	应用授权作用域，获取用户个人信息则填写 snsapi_userinfo （只能填 snsapi_userinfo）
state	否	用于保持请求和回调的状态，授权请求后原样带回给第三方。该参数可用于防止 csrf 攻击（跨站请求伪造攻击），建议第三方带上该参数，可设置为简单的随机数加 session 进行校验。在state传递的过程中会将该参数作为url的一部分进行处理，因此建议对该参数进行url encode操作，防止其中含有影响url解析的特殊字符（如'#'、'&'等）导致该参数无法正确回传。
返回示例：

appid: wxd477edab60670232
scope: snsapi_userinfo
state: wechat_sdk_demo
可拉起微信打开授权登录页：


返回说明

用户点击授权后，微信客户端会被拉起，跳转至授权界面，用户在该界面点击允许或取消，SDK 通过 SendAuth 的 Resp 返回数据给调用方。

返回值	说明
ErrCode	ERR_OK = 0(用户同意) ERR_AUTH_DENIED = -4（用户拒绝授权） ERR_USER_CANCEL = -2（用户取消）
code	用户换取 access_token 的 code，仅在 ErrCode 为 0 时有效
state	第三方程序发送时用来标识其请求的唯一性的标志，由第三方程序调用 sendReq 时传入，由微信终端回传，state 字符串长度不能超过 1K
lang	微信客户端当前语言
country	微信用户当前国家信息
第二步：通过 code 获取 access_token
获取第一步的 code 后，请求以下链接获取 access_token：

https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
参数说明

参数	是否必须	说明
appid	是	应用唯一标识，在微信开放平台提交应用审核通过后获得
secret	是	应用密钥 AppSecret，在微信开放平台提交应用审核通过后获得
code	是	填写第一步获取的 code 参数
grant_type	是	填 authorization_code
返回说明

正确的返回：

{
  "access_token": "ACCESS_TOKEN",
  "expires_in": 7200,
  "refresh_token": "REFRESH_TOKEN",
  "openid": "OPENID",
  "scope": "snsapi_userinfo",
  "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
}
参数	说明
access_token	接口调用凭证
expires_in	access_token 接口调用凭证超时时间，单位（秒）
refresh_token	用户刷新 access_token
openid	授权用户唯一标识
scope	用户授权的作用域（snsapi_userinfo）
unionid	当且仅当该移动应用已获得该用户的 userinfo 授权时，才会出现该字段
错误返回样例：

{"errcode":40029,"errmsg":"invalid code"}
第三步：刷新 access_token 有效期
access_token 是调用授权关系接口的调用凭证，由于 access_token 有效期（目前为 2 个小时）较短，当 access_token 超时后，可以使用 refresh_token 进行刷新，access_token 刷新结果有两种：

1. 若access_token已超时，那么进行refresh_token会获取一个新的access_token，新的超时时间；
2. 若access_token未超时，那么进行refresh_token不会改变access_token，但超时时间会刷新，相当于续期access_token。
refresh_token 拥有较长的有效期180 天），当 refresh_token 失效的后，需要用户重新授权。

请求方法

获取第一步的 code 后，请求以下链接进行 refresh_token：

https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN
参数说明

参数	是否必须	说明
appid	是	应用唯一标识
grant_type	是	填 refresh_token
refresh_token	是	填写通过 access_token 获取到的 refresh_token 参数
返回说明

正确的返回：

{
  "access_token": "ACCESS_TOKEN",
  "expires_in": 7200,
  "refresh_token": "REFRESH_TOKEN",
  "openid": "OPENID",
  "scope": "SCOPE"
}
参数	说明
access_token	接口调用凭证
expires_in	access_token 接口调用凭证超时时间，单位（秒）
refresh_token	用户刷新 access_token
openid	授权用户唯一标识
scope	用户授权的作用域，使用逗号（,）分隔
错误返回样例：

{ "errcode": 40030, "errmsg": "invalid refresh_token" }
注意：

Appsecret 是应用接口使用密钥，泄漏后将可能导致应用数据泄漏、应用的用户数据泄漏等高风险后果；存储在客户端，极有可能被恶意窃取（如反编译获取Appsecret）；
access_token 为用户授权第三方应用发起接口调用的凭证（相当于用户登录态），存储在客户端，可能出现恶意获取access_token 后导致的用户数据泄漏、用户微信相关接口功能被恶意发起等行为；
refresh_token 为用户授权第三方应用的长效凭证，仅用于刷新access_token，但泄漏后相当于access_token 泄漏，风险同上；
如无特别业务需求，建议开发者自行管理业务登录态并合理设置过期时间，减少用户重新授权登录次数，优化用户体验。
建议将Appsecret、用户数据（如access_token）放在App云端服务器，由云端中转接口调用请求。

第四步：获取用户信息
获取access_token后，进行接口调用，有以下前提：

access_token有效且未超时；
微信用户已授权给第三方应用账号相应接口作用域（scope）。
对于接口作用域（scope 为 snsapi_userinfo），可参考如下接口获取用户个人信息：

接口	接口说明
/sns/oauth2/access_token	通过code换取access_token、refresh_token和已授权scope
/sns/oauth2/refresh_token	刷新或续期access_token使用
/sns/auth	检查access_token有效性
/sns/userinfo	获取用户个人信息
接口文档可查阅授权后接口调用指南
第五步：接口调用建议
5.1 接口说明及频率

5.2 接口调用建议
开发者在调用上述接口时应按照文档说明控制调用频率，如果超出调用频率，接口将返回错误码 45011。因此开发者可在调用上述接口时遵循以下建议：

1、/sns/oauth2/access_token接口中会返回openid 和 unionid，若只需这两个信息，则无需另外调用 /sns/userinfo，减少不必要的调用

2、/sns/userinfo建议不要做为关键路径，获取的数据可以适当缓存一段时间，减少重复调用

3、access_token的有效期是2小时，可以控制好调用时机，减少无效刷新次数

4、同一用户（openid）在一分钟内不能调用以上接口合计180次，超过会被当成恶意攻击返回 45011

5.3 接口频率提升流程
若已按照上述建议进行接口调用，仍有超出调用频率的情况，如大型活动或推广等，可通过微信开放平台-管理中心-移动应用中的能力专区申请提升接口频率。

点击查看微信登录接口付费提额指引

F.A.Q
1. 什么是授权临时票据（code）？

答：第三方通过code进行获取access_token的时候需要用到，code的超时时间为10分钟，一个code只能成功换取一次access_token即失效。code的临时性和一次保障了微信授权登录的安全性。第三方可通过使用https和state参数，进一步加强自身授权登录的安全性。

2. 什么是授权作用域（scope）？

答：授权作用域（scope）代表用户授权给第三方的接口权限，第三方应用需要向微信开放平台申请使用相应scope的权限后，使用文档所述方式让用户进行授权，经过用户授权，获取到相应access_token后方可对接口进行调用。

3. 未上架应用使用微信登录能力有什么限制吗？

答：已认证主体的未上架应用的微信登录用户次数限制为100次/天。如果超了，则会出现 ”系统错误，错误码：10060“。如下截图：


解决方案为：前往微信开放平台 - 管理中心 - 移动应用 - 编辑，将移动应用的上架状态设置为已上架（注意，Android、iOS、鸿蒙分别都需要设置为已上架，未设置上架状态的端依旧还是会出现 10060 报错），设置上架状态后提交审核，审核通过即可生效。