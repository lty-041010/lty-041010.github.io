---
title: "Vue 3 组合式 API 的几个实用模式"
date: "2026-09-10"
tags: ["Vue", "TypeScript", "前端"]
categories: ["技术"]
summary: "组合式 API 不只是换个写法。本文整理了日常开发中最常用的几个模式和容易踩的坑。"
draft: false
---

## 为什么用 `<script setup>`

`<script setup>` 是编译期语法糖，相比 `setup()` 函数有几个明显优势：

- 顶层变量自动暴露给模板，不用 `return`
- 类型推导更完整，`defineProps` / `defineEmits` 直接是泛型
- 更少的样板代码，性能也更好

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
