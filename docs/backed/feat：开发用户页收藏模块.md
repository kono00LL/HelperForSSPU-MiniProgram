# 思路

1. 用户未登录时，为空白。登录后为仿照主页来瀑布式展示收藏帖子
2. 获取数据后，放入store存储，收藏组件从store获取并且渲染

# 注意点

### 刷新时机

登录后调用一次接口，然后每次手动上拉刷新收藏页面会调用一次。

### 滚动问题

用户页分为两个组件head和collect，应该实现滑动collect会带动head，最终滑动是整个页面
为了解决这个问题，使用两者共用同一个滚动位置来解决。

- head和collect放置在同一个滚动容器，将滚动权交给外侧容器
- collect不需要滚动，只是负责内容

```sql
ScrollContainer（唯一滚动容器）
 ├── Head（你的 head 组件）
 ├── Collect（你的 collect 组件）
```

### 收藏列表

这一块我打算沿用index的设计思路，分为collect作为骨架，collect-display为展示组件，内部包含多个pard组件

- collect作为骨架，只需要基本样式即可，通过collect-display来承载具体内容
- collect-display读取数据后，直接全部加载，渲染postcard，不使用上拉加载。

#### 旧有的实现模式

post-display和post-card是“列表容器 + 单项卡片”的组合
PostsDisplay从store获取数据，然后通过V-for拆分，传入card
PostCard使用props接收数据，被点击后通过emit('postClick')，执行跳转
