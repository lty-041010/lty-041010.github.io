---
title: "你好，世界"
date: "2026-09-10"
tags: ["随笔", "博客"]
categories: ["生活"]
summary: "第一篇正式的文章。聊聊为什么要写博客，以及这个站点是怎么搭起来的。"
draft: false
---

## 为什么要写博客

写博客这件事，我想了很久。

不是为了流量，也不是为了「建立个人品牌」这种听起来很功利的目的。更朴素的原因大概是：

- 把学过的东西**用自己的话重新组织一遍**，才能真正留下
- 有些想法在脑子里转和写下来，完全不是一回事
- 几年后回头看，会感谢现在留下记录的人

> 写作不是为了被理解，而是为了理解。

## 这个站点

技术栈很克制，没有用任何重型 UI 库：

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')