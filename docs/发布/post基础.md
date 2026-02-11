# UI

### 顶部路由

左边为'x'退出键，右边为发送按钮

### 发布

最上方为专门的输入标题框
之间是输入正文框
最下方支持图片

refreshtoken


# 计划
使用专门的store存贮输入的内容和上传的图片文件，然后通过接口来上传

# 错误
使用的refreshtoken可以正常测试成功，在fastapi处完全正常。但是实际报错token异常
这里只有refreshtoken而不使用accesstoken是因为