# api

需要传入post_id。
成功后返回，同时view+1

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
  "created_time": "2026-01-15T03:43:31.088Z",
  "view": 0,
  "likes": 0,
  "collect": 0,
  "comment_count": 0,
  "images": []
}
```

# 思路

点击进入后触发，退出不触发。可以重复触发
