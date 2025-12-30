为了使用 Pinia store 统一管理帖子数据

- 更改了postList定义，删除了原有的定义
  `// const postList = ref([]);`
  只使用 store 的数据（第 30 行）
  `const { postList } = storeToRefs(postsStore);`
- 移除重复的数据添加操作
  `postList.value.push(mockPost00, mockPost01, ...);`
