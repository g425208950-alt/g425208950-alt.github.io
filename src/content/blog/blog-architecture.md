---
title: 本博客架构解释
description: 从使用场景切入讲述当前博客的架构，第一篇正式写的博客
pubDate: 2026-09-30
draft: true
---

## 写博客的要点 (第一次用markdown写博客，给自己加一个快捷链接查用法)

[Markdown写作速查](https://g425208950-alt.github.io/blog/markdown-cheatsheet/)  （在Typora中需要ctrl + 鼠标左键）

## 当前博客架构

这是一个Astro静态博客，通过Github pages生成静态页面成为一个网页，域名是g425208950-alt.github.io，slug是markdown文件名称去掉md并且按照path规范后的路径，`[Markdown 写作速查](https://g425208950-alt.github.io/blog/markdown-cheatsheet/)`中间的blog路径不是base，是路由段。



## 我在刚搭建好时的疑惑

1. github为这个网页提供了域名，那我不需要域名，不需要服务器就可以搭建这个博客，和购买域名和服务器搭建的博客网站相比有什么缺点？
2. 例如打开Markdown用法速查时，浏览器路径为 `[Markdown 写作速查](https://g425208950-alt.github.io/blog/markdown-cheatsheet/)`
   **g425208950-alt.github.io**是仓库名，**blog**是什么？仓库中第一层并没有blog目录。
3. 在搭建这个博客时，我用的是WSL中的deepseek harness，现在不能用dsh提到的`npm run build`来查看Markdown的效果，是因为Windows缺少了什么吗？

## AI草稿

按"一次构建从磁盘上的文件变成网页"的顺序读，每一层只依赖上一层，这样最省力。下面每条都给了文件，你可以打开对照。

1. **配置层——`astro.config.mjs`**。这是唯一的全局开关。它做三件事：读 `GITHUB_REPOSITORY` 推出 `site`/`base`；把 `mdx`、`sitemap` 两个集成挂上；用 Fonts API 注册 Atkinson 字体。`site` 决定 canonical、RSS 里的绝对地址，`base` 决定所有站内 URL 的前缀。本地开发没有这个环境变量，所以退化成 `https://example.com` + `/`。
2. **内容层——`src/content.config.ts` + `src/content/blog/\*.md`**。关键认知：`src/content/blog/` 里的 Markdown **不是路由**，它是数据。`glob` loader 把每个文件读成一条记录，文件名（不含扩展名）成为 `post.id`，frontmatter 按 zod schema 校验。这一步在构建时执行，schema 不通过就直接构建失败，不会有"坏文章上线"。
3. **路由层——`src/pages/`**。Astro 只认这个目录：文件名即 URL。这里一共四个出口——`index.astro`（`/`）、`blog/index.astro`（`/blog/`）、`blog/[...slug].astro`（`/blog/<id>/`）、`about.astro`（`/about/`），外加一个非 HTML 的 `rss.xml.js`。
4. **数据怎么接到路由上——`[...slug].astro`**。这是整个项目最值得盯的一处：`getStaticPaths()` 在构建时跑，`getCollection('blog')` 拿到全部文章，每条映射成一个 `{ params: { slug: post.id }, props: post }`；Astro 有几条数据就生成几个 HTML。`render(post)` 把 Markdown 正文变成 `<Content />` 组件塞进布局。**"文件名即 URL"就是这一行 `slug: post.id` 实现的**，不是任何配置写死的。
5. **布局层——`src/layouts/BlogPost.astro`**。它是一整页 HTML（`<html>`/`<head>`/`<body>` 都在里面），接收的正是第 4 步 `props` 里的 `data`。`<slot />` 是插入点，正文、以及 `about.astro` 手写的段落，都从这里进去。这是它同时被文章和"关于"页复用的原因。
6. **组件层——`src/components/`**。`BaseHead` 管 head 里的所有 meta（canonical、OG、favicon、RSS link、sitemap link），并在这里 `import '../styles/global.css'`——所以全局样式实际上是"被 BaseHead 带进来的"，不是框架自动注入的。`FormattedDate` 强制 UTC 显示日期，避免构建机时区造成差一天。`HeaderLink` 自己判断当前页是否高亮。
7. **链接与资源——`src/utils/url.ts`**。`BASE` 从 `import.meta.env.BASE_URL` 去掉结尾斜杠得到，`withBase()` 负责拼前缀。所有站内链接、favicon、RSS、sitemap 都走它。图片则是 `<Image>` 组件在构建时用 sharp 转成 hash 命名的 webp，输出到 `dist/_astro/`；字体由 `<Font>` 注入 `@font-face` 和 preload，并定义 `--font-atkinson` 变量供 `global.css` 使用。
8. **产物与部署——`dist/` + `.github/workflows/deploy.yml`**。`npm run build` 跑完后 `dist/` 里就是纯 HTML/CSS/图片，没有任何服务端。CI 里 `withastro/action@v6` 负责装依赖、构建、上传 artifact（此时 `GITHUB_REPOSITORY` 由 Actions 注入，第 1 步的 site/base 就是这时候算出来的），`deploy-pages@v5` 把 artifact 交给 Pages。仓库的 Settings → Pages → Source 必须选 "GitHub Actions"，否则这条链断在最后一步。

如果你要理解"它是怎么搭起来的"，顺序反过来就是搭建顺序：先 `astro.config.mjs` 定站点地址，再 `content.config.ts` 定数据形状，再写一篇文章，再做 `pages/` 的四个出口，然后抽 `components/`，最后加 `deploy.yml`。

每一层你都能自证，不用信我：改 `site` 的值重新 build，看 `dist/rss.xml` 里的地址变没变（第 1 层）；故意删掉某篇文章的 `title` 再 build，看是否报 schema 错（第 2 层）；把 `Beginning.md` 改名，看 URL 跟着变（第 4 层）；build 完 grep 一下 `dist/index.html` 里的 `href`，就能确认第 7 层的 base 到底拼没拼对。
