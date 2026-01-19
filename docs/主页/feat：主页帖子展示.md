# api

通过page和page_size来控制展示帖子的页码和展示数

返回

```json
{
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
      "created_time": "2026-01-15T05:42:07.158Z",
      "view": 0,
      "likes": 0,
      "collect": 0,
      "comment_count": 0,
      "images": []
    }
  ]
}
```

# 准备将mock替换为真实数据
