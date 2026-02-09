PUT
/user/userinfo
需要请求头
传入
user_name
string | (string | null)
gender
integer | (integer | null)
city
string | (string | null)
avatar
array<string> | (array<string> | null)

传出
```json
{
  "user_id": "string",
  "user_name": "string",
  "user_email": "user@example.com",
  "user_phone_number": "string",
  "avatar_url": "string",
  "created_time": "2026-02-09T10:35:48.849Z",
  "gender": 0,
  "city": "string",
  "status": 0,
  "last_login_time": "2026-02-09T10:35:48.849Z",
  "likes": 0,
  "follower_cnt": 0,
  "fans_cnt": 0
}
```

创建帖子
POST
/post/
需要请求头，multipart/form-data
title *
string
content *
string
images
array<string>
传出
```json
{
  "title": "string",
  "content": "string",
  "post_id": "string",
  "user": {
    "user_id": "string",
    "user_name": "string",
    "avatar_url": "string"
  },
  "created_time": "2026-02-09T10:36:57.851Z",
  "view": 0,
  "likes": 0,
  "collect": 0,
  "comment_count": 0,
  "images": []
}
```

创建评论
POST
/comment/
需要请求头
传入
parent_comment_id
string | (string | null)
(query)
和
Request body

multipart/form-data
post_id *
string
content *
string
images
array<string> | (array<string> | null)

传出
```json
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
  "created_at": "2026-02-09T10:38:17.559Z",
  "likes": 0
}
```

上传图片
POST
/images/
需要请求头
传入
Request body

multipart/form-data
entity_type *
string
entity_id *
string
files *
array<string>
传出
```json
[
  {
    "img_id": "string",
    "user_id": "string",
    "entity_type": "post",
    "entity_id": "string",
    "img_url": "https://example.com/",
    "created_time": "2026-02-09T10:39:41.068Z"
  }
]
```


点赞与取消点赞
POST
/thumb/
需要请求头
传入
```json
{
  "entity_type": "post",
  "entity_id": "string",
  "isThumbed": true
}
```
传出
```json
{
  "entity_type": "post",
  "entity_id": "string",
  "isThumbed": true,
  "thumb_id": 0,
  "user_id": "string",
  "updated_at": "2026-02-09T10:40:52.590Z"
}
```

查询用户点赞对象
POST
/thumb/user
需要请求头
传入
```json
{
  "entity_type": "post"
}
```
传出
```json
[
  {
    "entity_type": "post",
    "entity_id": "string",
    "isThumbed": true,
    "thumb_id": 0,
    "user_id": "string",
    "updated_at": "2026-02-09T10:41:59.736Z"
  }
]
```

收藏与取消收藏帖子
POST
/collect/

需要请求头
传入
```json
{
  "post_id": "string"
}
```

传出
```json
{
  "post_id": "string",
  "user_id": "string",
  "collect_id": 0,
  "isCollected": true
}
```

查询用户收藏对象
GET
/collect/user
需要请求头
传出
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
    "created_time": "2026-02-09T10:43:57.047Z",
    "view": 0,
    "likes": 0,
    "collect": 0,
    "comment_count": 0,
    "images": []
  }
]
```

关注/取关用户
POST
/follow/
需要请求头

A用户关注/取关B用户
follow=true: 关注
follow=false: 取关

传入
Name	Description
follow
boolean
(query)
Default value : true

和

Request body

application/json
Example Value
Schema
{
  "followee_id": "string"
}

传出
```json
{
  "follower_id": "string",
  "followee_id": "string",
  "is_following": true
}
```

查询粉丝数量+列表(user_id列表)
GET
/follow/fans
需要请求头
传出
```json
{
  "count": 0,
  "user_ids": [
    "string"
  ]
}
```

查询关注数量+列表(user_id列表)
GET
/follow/following
需要请求头
传出
```json
{
  "count": 0,
  "user_ids": [
    "string"
  ]
}
```

通过user_id查询用户信息+帖子(分页)
GET
/follow/profile/{user_id}
不需要请求头
个人主页聚合：用户信息 + 该用户帖子分页列表

说明：

用户不存在：404
该用户无帖子：返回空分页（total=0, items=[]）

传入
Name	Description
user_id *
string
(path)
user_id
page
integer
(query)
Default value : 1

1
minimum: 1
page_size
integer
(query)
Default value : 3

3
maximum: 10
minimum: 1

传出
```json
{
  "user": {
    "user_id": "string",
    "user_name": "string",
    "user_email": "user@example.com",
    "user_phone_number": "string",
    "avatar_url": "string",
    "created_time": "2026-02-09T10:47:59.002Z",
    "gender": 0,
    "city": "string",
    "status": 0,
    "last_login_time": "2026-02-09T10:47:59.002Z",
    "likes": 0,
    "follower_cnt": 0,
    "fans_cnt": 0
  },
  "posts": {
    "page": 0,
    "page_size": 0,
    "total": 0,
    "total_pages": 0,
    "items": [
      {
        "title": "string",
        "content": "string",
        "post_id": "string",
        "user": {
          "user_id": "string",
          "user_name": "string",
          "avatar_url": "string"
        },
        "created_time": "2026-02-09T10:47:59.002Z",
        "view": 0,
        "likes": 0,
        "collect": 0,
        "comment_count": 0,
        "images": []
      }
    ]
  }
}
```


消息-未读列表
GET
/notification/unread
需要请求头
传入
Name	Description
page
integer
(query)
Default value : 1

1
minimum: 1
page_size
integer
(query)
Default value : 5

5
maximum: 50
minimum: 1

传出
```json
{
  "page": 0,
  "page_size": 0,
  "total": 0,
  "total_pages": 0,
  "items": [
    {
      "id": 0,
      "user_id": "string",
      "actor_id": "string",
      "type": "like_post",
      "target_type": "post",
      "target_id": "string",
      "content": "string",
      "is_read": true,
      "created_at": "2026-02-09T10:50:55.157Z"
    }
  ]
}
```

消息-标记已读
POST
/notification/read/{notification_id}
需要请求头

传出
```json
{
  "id": 0,
  "is_read": true
}
```