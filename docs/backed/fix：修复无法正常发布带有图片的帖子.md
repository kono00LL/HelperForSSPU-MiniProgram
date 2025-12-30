# 问题

使用 uni-file-picker 发帖时，提交的图片数组为空。默认启用了 auto-upload，但是疑似组件尝试上传到未配置的云服务失败，导致文件未保存到 v-model，且 uni.uploadFile 仅支持单文件上传路径参数错误。

# 解决方案

禁用自动上传：设置 <uni-file-picker :auto-upload="false">。
手动管理文件：监听 @select 和 @delete 事件，手动维护 selectedFilePaths 数组存储图片临时路径。
修复上传逻辑：提交时使用 selectedFilePaths，并更新 requestWithFiles 支持多文件路径提取。
