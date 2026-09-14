# .

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh

lty-041010.github.io/  (你的博客仓库根目录)
│
├── .github/                   🤖 【自动化机器人】
│   └── workflows/             (存放部署脚本，你每次提交代码，它自动帮你打包并发布到线上)
│       └── deploy.yml         (部署流程配置，千万别删)
│
├── .vscode/                   🛠️ 【编辑器配置】(本地开发时的设置，不影响网站，可无视)
│
├── public/                    🖼️ 【公共仓库】(存放静态文件，如图片、图标)
│   ├── favicon.ico            (浏览器标签页左边的小图标)
│   └── my-avatar.jpg          (你上传的头像图片等，直接放这里，路径就是 /my-avatar.jpg)
│
├── scripts/                   📜 【辅助脚本】(平时用不到，可无视)
│
├── src/                       🏠 【核心工作区】(你90%的维护工作都在这里！)
│   ├── assets/                (放 CSS样式、本地小图标，打包时会被合并压缩)
│   ├── components/            (放导航栏、页脚等积木组件，改版式时才会动)
│   ├── config/                ⚙️ (网站总控台)
│   │   └── site.ts            ⭐ (改网站名字、简介、头像路径、备案号等，都在这里！)
│   ├── pages/ 或 views/       📝 (你的文章页面)
│   │   ├── index.vue          (首页)
│   │   └── posts/             (你的博客文章，写新文章就在这里加)
│   ├── router/                (路由表，决定了哪个网址显示哪个页面，一般不用动)
│   ├── App.vue                (主入口组件，相当于房子的框架)
│   └── main.ts                (项目入口启动文件，相当于房子的总电闸)
│
├── .editorconfig              (代码格式规范，不用管)
├── .gitattributes             (Git配置文件，不用管)
├── .gitignore                 (告诉Git哪些不要上传，千万别删)
├── .oxlintrc.json             (代码检查配置，不用管)
├── .prettierrc.json           (代码格式化配置，不用管)
├── index.html                 (网站的入口骨架，自动生成的，不用改)
├── package.json               📦 (项目说明书+购物清单，记录用了哪些插件、有哪些命令)
├── package-lock.json          (依赖版本锁定文件，不用管)
├── README.md                  (仓库说明书，你可以写点项目简介)
├── tsconfig.json              (TypeScript配置，不用管)
└── vite.config.ts             ⚙️ (打包配置，你上次白屏就是改这里的 base 路径)
npm run lint
```
