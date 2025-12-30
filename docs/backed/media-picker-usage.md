# 底部栏点击相册后选择“拍摄”或“从相册选择”逻辑

在commend send里调用后，确认需要source-type="['album', 'camera']，然后在media里通过计算，返回一个options数组给actionsheet处理，进行渲染。渲染成功后，用户点击其中一个比如album，就会返回事件

```
post-commit-send 组件
    ↓ 调用 MediaPicker，传递 source-type="['album', 'camera']"
media-picker 组件
    ↓ 计算属性 mediaOptions 生成 options 数组
action-sheet 组件
    ↓ 渲染选项列表
用户点击 "从相册选择"
    ↓ 发出 select 事件
media-picker 组件
    ↓ 接收事件，执行 chooseFromAlbum()
uni.chooseImage API
    ↓ 调用成功
post-commit-send 组件
    ↓ 接收 success 事件，处理图片
```

---

```
配置传递: ['album', 'camera']
    ↓
计算生成: [
  { text: '从相册选择', value: 'album', icon: ALBUM },
  { text: '拍摄', value: 'camera', icon: CAMERA }
]
    ↓
渲染显示: 两个可点击的选项
    ↓
用户点击: "从相册选择"
    ↓
事件传递: { item: { text: '从相册选择', value: 'album' } }
    ↓
API调用: uni.chooseImage
    ↓
结果返回: 图片文件路径数组
```
