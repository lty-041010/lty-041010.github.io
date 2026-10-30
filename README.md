# lty-041010.github.io

> 一个基于 Hexo 与 Butterfly 主题构建的个人技术博客，记录开发实践、运维笔记与折腾日常。

---

## 📖 项目简介

这是博客站点 `lty-041010.github.io` 的源代码仓库。站点使用 Hexo 作为静态博客框架，搭配高度可定制的 Butterfly 主题，通过 GitHub Actions 自动化部署到 GitHub Pages。博客内容涵盖 Linux 桌面、网络代理、边缘计算、开发工具等多个技术方向，同时集成了 Waline 评论系统与透明毛玻璃视觉效果，兼顾阅读体验与交互性。

---

## 🛠️ 技术栈

| 分类 | 技术 |
|------|------|
| 博客框架 | [Hexo](https://hexo.io/) |
| 主题 | [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly) |
| 评论系统 | [Waline](https://waline.js.org/)（基于 Valine，支持服务端部署） |
| 包管理器 | pnpm |
| 运行时 | Node.js 22（见 `.nvmrc`） |
| 部署 | GitHub Actions → GitHub Pages |
| 样式增强 | 自定义 CSS（毛玻璃效果、背景过渡等） |

---

## 📁 目录结构

```text
lty-041010.github.io/
├── .github/                  # GitHub Actions 工作流
├── scaffolds/                # Hexo 文章脚手架模板
├── source/                   # 博客源内容
│   ├── _data/                # 数据文件（友链等）
│   ├── _posts/               # 文章 Markdown 源文件
│   ├── about/                # “关于”页面
│   ├── categories/           # 分类页
│   ├── css/                  # 自定义样式
│   ├── js/                   # 自定义脚本
│   ├── link/                 # 友链页
│   └── message/              # 留言板页
├── themes/
│   └── butterfly/            # Butterfly 主题（含定制修改）
├── _config.yml               # Hexo 主配置
├── _config.butterfly.yml     # Butterfly 主题独立配置（含 Waline 评论配置）
├── package.json              # 依赖与脚本
└── .nvmrc                    # Node.js 版本锁定
```

---

## 🚀 本地开发

### 环境要求

- Node.js 22（建议使用 nvm 切换，仓库已提供 `.nvmrc`）
- pnpm

### 安装依赖

```bash
git clone https://github.com/lty-041010/lty-041010.github.io.git
cd lty-041010.github.io
pnpm install
```

### 启动开发服务器

```bash
pnpm hexo server
```

默认访问 `http://localhost:4000`。

### 构建静态站点

```bash
pnpm hexo generate
```

生成的静态文件位于 `public/` 目录。

---

## 📦 部署

项目通过 GitHub Actions 自动部署至 GitHub Pages，工作流定义在 `.github/workflows/` 中。推送代码到 `main` 分支后，Actions 会自动完成依赖安装、Hexo 构建与 Pages 发布。

**仓库 Pages 设置参考：**

1. 进入仓库 **Settings → Pages**
2. **Source** 选择 **GitHub Actions**
3. 推送 `main` 分支即触发部署

若需本地手动部署，可安装 `hexo-deployer-git` 并配置 `_config.yml` 中的 `deploy` 字段。

---

## 🎨 主题与定制说明

### Butterfly 主题配置

主题的个性化配置集中在根目录的 `_config.butterfly.yml` 中，与 `_config.yml` 分离，便于主题升级时保留定制项。

### 自定义样式与脚本

- `source/css/`：存放毛玻璃效果、背景过渡等自定义样式
- `source/js/`：自定义交互逻辑（如“关于”页动态语录等）
- `themes/butterfly/`：主题目录内包含对 Waline 评论透明毛玻璃风格的集成修改

### 评论系统

评论后端使用 [Waline](https://waline.js.org/)，在 `_config.butterfly.yml` 的 `waline` 字段中配置服务端地址（`serverURL`）及相关选项。Waline 支持 Markdown、表情、评论通知与访问统计等功能；前端通过 `@waline/client` 接入，服务端可参考官方文档部署到 Vercel、Netlify 或自有服务器。评论框同样适配了站点的透明毛玻璃视觉风格。

---

## ✨ 功能特性

- **毛玻璃视觉**：全站局部采用透明毛玻璃效果，并针对低性能设备做了降级处理
- **背景平滑过渡**：背景图切换带有淡入动画，提升浏览体验
- **友链系统**：支持友链搜索与申请表单，适配多端布局
- **动态“关于”页**：关于页语录的样式与逻辑已抽离，便于维护和扩展
- **自动化部署**：GitHub Actions 完成构建与发布，无需手动推送静态文件
- **Node 版本锁定**：通过 `.nvmrc` 与 CI 配置统一使用 Node 22，配合 pnpm 的 frozen-lockfile 保证依赖一致性

---

## 📄 许可证

本仓库为个人博客项目，未指定开源许可证。博客文章版权归作者所有，主题及依赖组件遵循其各自的原许可证。如需引用或转载内容，请通过博客留言板或 Waline 评论联系作者。

---

## 🔗 相关链接

- **博客站点**：https://lty-041010.github.io
- **Hexo 官方文档**：https://hexo.io/docs/
- **Butterfly 主题文档**：https://butterfly.js.org/
- **Waline 官方文档**：https://waline.js.org/