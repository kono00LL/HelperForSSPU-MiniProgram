# 样式
顶部路由方面，最左侧为返回，中间用户头像和姓名
接下来是占据约一半屏幕的图片，如果没有则显示null
然后是标题和正文，大小暂未定。
底部左侧是输入框，右侧为点赞和收藏。

首先是图片，可以进行左右滑动，展示images数组
然后是标题和正文。
最后是底部输入框
点击输入框后，可以会正常弹出输入界面。这时整个滑动区域应该会被顶起。
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

# 评论组件
父组件是[post_id].tsx,需要向子组件传入post_id
### 样式

首先是评论头，会统计评论总数
然后是评论页，会展示评论，上边部分是用户头像与昵称，下半部分是评论正文
### 接口 
/comment/{post_id}，传入post_id,page和page_size,返回json
```json
{
  "page": 0,
  "page_size": 0,
  "total": 0,
  "total_pages": 0,
  "items": [
    {
      "content": "string",
      "comment_id": "string",
      "user": {
        "user_id": "string",
        "user_name": "string",
        "avatar_url": "string"
      },
      "post_id": "string",
      "user_id": "string",
      "parent_comment_id": "string",
      "images": [
        {
          "img_id": "string",
          "img_url": "string"
        }
      ],
      "created_at": "2026-01-27T07:19:45.117Z",
      "likes": 0
    }
  ]
}
```

