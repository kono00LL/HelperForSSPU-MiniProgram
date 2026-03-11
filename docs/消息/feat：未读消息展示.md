消息表结构

```sql
create table notification (
    id bigint primary key auto_increment,
    user_id char(36) not null comment '接收者(被通知的人)',
    actor_id char(36) null comment '触发者(点赞/评论/关注的人)',
    type enum('like_post', 'comment_post', 'follow_user') not null comment '通知类型',
    target_type enum('post', 'comment', 'user') not null comment '目标实体类型',
    target_id char(36) not null comment '目标实体ID (post_id/comment_id/user_id)',
    content varchar(255) not null,
    is_read boolean not null default false,
    created_at datetime not null default now(),

    index idx_user_read_time (user_id, is_read, created_at),
    index idx_user_time (user_id, created_at)
) comment '站内通知/消息表';
```

未读列表返回

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
      "created_at": "2026-03-04T11:09:40.186Z"
    }
  ]
}
```

已读列表返回

```json
{
  "id": 0,
  "is_read": true
}
```

卡片样式
触发者actor_id + 对应动作（赞或收藏，由通知类型决定） + 你的帖子 + “title” （查询）

加载后即已读
