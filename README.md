# 🌸 LTY 的个人博客

一个基于 Hexo 和 Butterfly 深度定制的极简风个人博客。
这里是 LTY 的个人数字花园，主要用于记录技术学习笔记、生活随笔以及各种有趣的前端折腾。

线上地址：[https://lty04.dpdns.org](https://lty04.dpdns.org)
备用地址：[https://lty-041010.github.io](https://lty-041010.github.io)

## 🛠️ 技术栈

- 核心框架：Hexo (v7.x)
- 主题引擎：Butterfly (v5.x)
- 包管理器：pnpm
- 评论系统：Giscus (基于 GitHub Discussions)
- 代码托管与部署：GitHub + GitHub Actions
- CDN / 字体：Google Fonts 镜像 + 必应 / 随机图片 API

## ✨ 核心特性 (UI & 交互)

- 全局无缝毛玻璃 UI：背景大图与卡片完美融合，通过纯 CSS 的 backdrop-filter 实现极致通透感。
- 一镜到底动态背景：顶部横幅与底层背景共用同一张随机壁纸（多端自适应 PC / 移动端图源），随页面滑动固定不动。
- 现代化字体排版：引入 Inter (英文) + Noto Sans SC (中文) + JetBrains Mono (代码)，并调整了全局行高和字色，提升阅读体验。

### 趣味交互组件

- “关于” 页面：内置发疯文学 / 毒鸡汤随机抽卡 + 打字机效果。
- 评论系统：全透明接入 Giscus，完美融入毛玻璃背景。

### 多端深度适配 (Mobile & Tablet)

- 基于 UA + 屏幕短边 + 触摸检测的精准设备判定，按需请求不同尺寸的壁纸。
- 移动端采用 ::before 伪元素模拟视差背景，解决 iOS 等浏览器兼容性问题，并减少 GPU 压力。
- 移动端卡片降级为更低的模糊半径，并调整间距，保证滑动手感。

## 🚀 本地开发指南

### 1. 环境准备

- 安装 Node.js (推荐 v20 或以上)
- 安装 pnpm：`npm install -g pnpm`
- 安装 Git

### 2. 克隆项目并安装依赖

```bash
git clone [https://github.com/lty-041010/lty-041010.github.io.git](https://github.com/lty-041010/lty-041010.github.io.git)
cd lty-041010.github.io
pnpm install
```

### 3. 启动本地预览

```bash
pnpm run server

# 或者使用 hexo server

```
打开浏览器访问 `http://localhost:4000` 即可实时预览。

### 4. 清理缓存

如果修改了配置或样式没有生效，或者遇到莫名其妙的报错，请运行：
```bash
hexo clean
```

## ✍️ 日常写作流程

- 新建文章
```bash
hexo new "我的新文章标题"
```
- 编辑内容
文章会生成在 `source/_posts/` 目录下，使用 Markdown 格式编写。
- 推送到线上
```bash
git add .
git commit -m "post: 发布了文章《我的新文章标题》"
git push origin main
```
(推送到 main 分支后，GitHub Actions 会自动触发云端构建与部署，无需手动执行 hexo deploy)。

## 📂 目录结构说明

```
.
├── .github/workflows/ # GitHub Actions 自动部署工作流配置
├── scaffolds/ # Hexo 文章 / 页面模板
├── source/ # 博客资源目录 (核心)
│   ├── _posts/ # ★ 你的 Markdown 博客文章都存放在这里
│   ├── css/custom.css # ★ 全站自定义 CSS (毛玻璃、排版等核心样式都在这里)
│   ├── data/ # 数据文件 (如 hitokoto.json 发疯语录库)
│   ├── img/ # 存放本地图片 (头像、图标等)
│   ├── about/ # 关于页
│   ├── categories/ # 分类页
│   ├── link/ # 友链页
│   ├── message/ # 留言板页
│   ├── tags/ # 标签页
│   └── CNAME # 自定义域名绑定文件
├── themes/butterfly/ # Butterfly 主题源码 (一般不需修改)
├── _config.yml # ★ Hexo 全局配置 (站点标题、URL、插件等)
├── _config.butterfly.yml # ★ 主题配置 (导航、侧边栏、注入代码 inject、Giscus 等)
├── giscus.json # Giscus 评论域名白名单配置
├── package.json # 项目依赖及脚本定义
└── pnpm-lock.yaml # pnpm 依赖版本锁定文件
```

## 🧠 核心配置备忘录 (防失忆专区)

如果你以后想修改博客样式或功能，请直接查阅以下说明：

### 1. 毛玻璃与随机背景实现逻辑

- 背景注入：在 `_config.butterfly.yml` 的 `inject.bottom` 中，使用 JS 进行设备判定（综合 UA、屏幕短边、触摸事件），按需选择手机、平板或 PC 的图池，并赋值给 CSS 变量 `--bg-img`，同时给 body 添加 `ui-glass` 和 `bg-random-image` 类。
- PC 端视差：通过 `background-attachment: fixed` 实现背景固定，内容上浮。
- 移动端视差：为规避 iOS 等浏览器对 fixed 的兼容性问题，在 `custom.css` 的移动端媒体查询中，使用 `position: fixed` 的 `::before` 伪元素承载背景，实现更稳定的视差效果，并降低 `backdrop-filter` 的模糊半径以优化性能。

### 2. Giscus 评论系统配置

- 主题设置：不能使用 `transparent_light` 这种不存在的主题（会报 MIME 错误），目前使用基础的 `light` 和 `dark`。
- 权限验证：`giscus.json` 文件必须放在仓库根目录，且确保包含你的域名白名单。
- 分类要求：GitHub Discussions 中的分类必须是 Open-ended discussion，否则普通访客无法发起评论。
- 本地测试：在 [localhost](https://localhost) 下测试评论区报错（CORS）是正常现象，以线上 HTTPS 环境为准。
- -------------------------------------------------------------------------------
- 2026年10月26日21:13:59  更新为waline评论系统

### 3. 关于页发疯语录

实现代码在 `source/about/index.md` 中，包含 HTML 结构 + CSS 样式 + 原生 JS 打字机逻辑。
语录库支持随时扩充，修改 `const quotes = [...]` 数组即可。

## ⚠️ 避坑指南 (千万别碰这些红线)

- 严禁提交 node_modules：依赖文件夹极大，已被 .gitignore 忽略，千万别强行 `git add -f`。
- 绝对不要存在 package-lock.json：本项目使用 pnpm，如果有 npm 生成的 package-lock.json，会导致 GitHub Actions 构建冲突红叉，见一次删一次。
- 不要提交 db.json：这是本地缓存文件，应在 .gitignore 中将其忽略。
- 修改主题配置时注意缩进：YAML 文件对缩进极其敏感，修改 `_config.butterfly.yml` 时务必使用空格，别用 Tab。

---

Created with ❤️ by LTY. Powered by Hexo & Butterfly.