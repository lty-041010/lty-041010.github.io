---
title: 从 Giscus 迁移到 Waline：在 Hexo + Butterfly 上搭一套访客免登录的评论区
date: 2026-10-24 19:14:24
tags:
  - Waline
  - Hexo
  - Butterfly
  - 评论系统
categories:
  - 博客折腾
description: 你的博客用 Giscus 有一段时间了，它简洁、免费、和 GitHub 深度融合。但只要你写过一篇面向非开发者读者的文章，就会隐约感觉到那层 GitHub 登录墙的存在。这篇记录从 Giscus 切换到 Waline 的完整过程，重点放在 Butterfly 主题下的实际配置，而不是通用部署教程。
---

## 为什么换掉 Giscus

Giscus 本身没有“坏掉”。它把评论存进 GitHub Discussions，不需要维护任何后端，对技术博客来说几乎是零成本方案。问题出在**读者结构**上：一旦博客里出现生活随笔、工具推荐、经验总结这类内容，就会引入大量没有 GitHub 账号、或者不愿意为了留一句话而授权登录的读者。GitHub 登录墙会把这些声音全部挡在外面。

Waline 的解法很直接：**昵称必填，邮箱和网址选填，不需要任何第三方账号**。评论数据存在你自己的 PostgreSQL 里，管理通过独立后台完成，不和 Issues 混在一起。它同时保留了 Markdown、表情、图片上传、浏览量统计和邮件通知，迁移成本主要集中在前端主题适配，而不是功能缺失。

## 整体结构：静态博客不变，评论按需请求

你的博客仍然是 Hexo 生成的静态站点，由 GitHub Actions 推送到 GitHub Pages。Waline 只负责评论区那一小块区域：

```text
GitHub Pages (静态 HTML)
       │
       │ 浏览器加载页面后，前端发起 API 请求
       ▼
Waline Server (Vercel)
       │
       ▼
Neon PostgreSQL (评论 / 用户 / 浏览量)
```

这种拆分的好处是：评论服务暂时不可用时，文章正文照常访问。Waline 官方推荐的 Vercel + Neon 组合对个人博客免费，也不需要管理服务器。

## 第一步：在 Vercel 部署 Waline 后端

打开 Waline 官方文档的“快速上手”页面，点击其中的 Vercel 部署按钮（模板仓库为 `walinejs/waline` 的 `example` 目录）。用 GitHub 登录 Vercel，输入一个项目名（例如 `{{WALINE_PROJECT}}`），点击 Create。Vercel 会自动基于模板创建仓库并开始部署，一两分钟后得到一个 `https://{{WALINE_PROJECT}}.vercel.app` 的地址。

这个地址先记下来，后面在 Butterfly 里配置 `serverURL` 会用到。

## 第二步：创建 Neon 数据库并导入表结构

进入 Vercel 项目控制台的 **Storage** 选项卡，点击 **Create Database**，在 Marketplace 中选择 **Neon**，接受创建 Neon 账号，套餐和区域保持默认。数据库创建完成后，点击 **Open in Neon** 进入 Neon 的 SQL Editor，把 Waline 仓库中 `assets/waline.pgsql` 的内容完整粘贴并执行。这一步会建好 `wl_Comment`、`wl_User`、`wl_Counter` 等所有需要的表。

### 关键的一步：Redeploy

数据库绑定到 Vercel 项目后，**必须重新部署一次**。进入 Vercel 的 Deployments 页面，对最新一次部署点击 Redeploy。数据库连接信息是在 Storage 绑定后注入的，不重新部署的话，Waline 服务端读不到 `PG_HOST`、`PG_PASSWORD` 等环境变量，前端请求会直接报错。

部署状态变为 Ready 后，`{{WALINE_SERVER_URL}}` 就是最终的后端地址。

## 第三步：在 Butterfly 主题中启用 Waline

Butterfly 对 Waline 有一等公民级别的支持，不需要手动引入 JS 和 CSS，直接改主题配置即可。打开 `_config.butterfly.yml`，找到 `comments` 与 `waline` 部分：

```yaml
comments:
  # 原来可能是 giscus，改成 waline（注意首字母大写）
  use: Waline
  text: true

waline:
  serverURL: {{WALINE_SERVER_URL}}
  commentCount: true    # 文章卡片上显示评论数
  pageview: true        # 同时启用浏览量统计
  option:
    # option 下的内容会原样透传给 Waline 的 init()
    locale:
      placeholder: 昵称必填，邮箱选填，说点什么吧...
    emoji:
      - https://unpkg.com/@waline/emojis@1.1.0/weibo
      - https://unpkg.com/@waline/emojis@1.1.0/alus
    dark: '{{DARK_SELECTOR}}'
    requiredMeta:
      - nick
```

`serverURL` 必须带上 `https://`，并且**不要**在结尾加斜杠。Butterfly 会自动处理 `path`（默认取文章路径），不需要额外配置。

### 暗黑模式适配

你的博客有毛玻璃 UI，大概率也启用了暗黑模式。Butterfly 的暗黑模式切换会在 `<html>` 上改变属性，Waline 的 `dark` 选项可以直接对接为 CSS 选择器字符串：

```yaml
waline:
  option:
    dark: '{{DARK_SELECTOR}}'
```

`{{DARK_SELECTOR}}` 的准确值建议在浏览器里确认：打开开发者工具，手动切换暗黑模式，观察 `<html>` 上出现的属性名（常见为 `html[data-theme="dark"]` 或 `html.dark`），把它原样填进去即可。不同 Butterfly 版本可能略有差异，以你当前版本为准。

## 第四步：注册管理员

后端地址拼接 `/ui/register`，例如：

```text
{{WALINE_SERVER_URL}}/ui/register
```

**第一个注册的账号自动成为管理员**。部署完成后尽快去注册，避免被其他人抢先。之后所有评论审核、删除、用户管理都在 `/ui` 后台完成，不再需要进入 GitHub Discussions。

## 安全与反垃圾：默认已经够用

Waline 在服务端用 **DOMPurify** 对每条评论做过滤，`<script>`、`<iframe>`、`<style>`、内联 `style` 属性、`autoplay` 等都会被拦截；所有链接自动加上 `rel="noreferrer noopener"` 并新窗口打开。

频率限制默认开启：同一 IP 一分钟内只能发一条评论。内容相似度过高的评论会被拒绝，防止灌水。如果某段时间受到恶意骚扰，可以在 Vercel 环境变量中开启评论审核（`COMMENT_AUDIT=true`），新评论默认隐藏，审核通过后才显示。

## 两个值得顺手配上的增强功能

### 邮件通知

不配置 SMTP 的话，有人评论你只能主动去后台看。在 Vercel 项目的 Settings → Environment Variables 中添加：

```text
SMTP_SERVICE={{SMTP_SERVICE}}
SMTP_USER={{SMTP_USER}}
SMTP_PASS={{SMTP_PASS}}
SENDER_NAME={{SITE_NAME}}
SENDER_EMAIL={{SMTP_USER}}
SITE_NAME={{SITE_NAME}}
SITE_URL={{SITE_URL}}
AUTHOR_EMAIL={{AUTHOR_EMAIL}}
```

`SMTP_PASS` 填的是邮箱服务商提供的**授权码**，不是登录密码。QQ 邮箱需要先在设置中开启 SMTP 并获取授权码。配置后，博主会收到新评论提醒，评论者被回复时也能收到通知。

### 评论数与浏览量

Butterfly 的 `commentCount` 和 `pageview` 开启后，Waline 会在文章卡片和文章页自动填入对应数值，不需要在主题模板中手动写统计逻辑。如果你之前用过其他浏览量方案，Waline 的计数接口也可以单独调用，但迁移旧数据需要额外写脚本，这里不展开。

## 写在最后

从 Giscus 到 Waline，真正的变化不是“换了一个更花哨的评论区”，而是**把评论的主动权拿回来**：读者不需要 GitHub 账号就能说话，数据在你自己的 Neon 数据库里，管理后台独立于 GitHub Discussions 存在。对于一台已经跑着 Hexo + Butterfly 的 GitHub Pages 博客来说，后端部署是一次性的，前端只需要在 `_config.butterfly.yml` 里改几行配置。

如果你也在用 Giscus，并且注意到评论区长期只有“熟人技术圈”在说话，这个迁移值得做。成本大约半小时，换来的是一扇对所有人都打开的评论入口。