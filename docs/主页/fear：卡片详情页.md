# 样式
顶部路由方面，最左侧为返回，中间用户头像和姓名
接下来是占据约一半屏幕的图片，如果没有则显示null
然后是标题和正文，大小暂未定。
底部左侧是输入框，右侧为点赞和收藏。
# 接口
参见/post/detail,需要输入post_id,是一个GET请求
返回数据为json格式的
```json
[
  {
    "title": "string",
    "content": "string",
    "post_id": "string",
    "user": {
      "user_id": "string",
      "user_name": "string",
      "avatar_url": "string"
    },
    "created_time": "2026-01-18T07:16:25.181Z",
    "view": 0,
    "likes": 0,
    "collect": 0,
    "comment_count": 0,
    "images": []
  }
]
```
注意这里返回的是数组而不是对象

# 排版说明
首先是图片，可以进行左右滑动，