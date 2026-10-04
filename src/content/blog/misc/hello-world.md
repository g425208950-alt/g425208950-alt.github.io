---
title: 你好，世界：这个博客终于开张了
description: 用 Astro + GitHub Pages 搭一个纯 Markdown 的博客，第一篇当然要写清楚它是怎么跑起来的。
pubDate: 2024-01-01
heroImage: ../../../assets/blog-placeholder-1.jpg
draft: true
---

这是第一篇文章。写下它的时候，我只需要在这个文件里敲 Markdown，剩下的交给 GitHub。

## 写一篇新文章要做什么

1. 在 `src/content/blog/` 下新建一个 `.md` 文件，文件名就是网址里的 slug，比如
   `hello-world.md` → `/blog/hello-world/`。
2. 在文件开头写上 frontmatter（也就是上面 `---` 包起来的那几行）。
3. 本地 `npm run dev` 看一眼效果。
4. `git add` + `git commit` + `git push`，GitHub Actions 会自动发布。

就这样，没有后台、没有数据库、不用登录什么编辑器。

## frontmatter 有哪些字段

| 字段          | 是否必填 | 说明                             |
| ------------- | -------- | -------------------------------- |
| `title`       | 必填     | 文章标题                         |
| `description` | 必填     | 摘要，会用在列表页和 SEO meta 里 |
| `pubDate`     | 必填     | 发布日期，写成 `2024-01-01` 就行 |
| `updatedDate` | 可选     | 更新日期，写了会在标题下额外显示 |
| `heroImage`   | 可选     | 封面图，路径相对于当前 md 文件   |

字段的校验规则在 `src/content.config.ts` 里。如果哪天 frontmatter 写错了，
`npm run build` 会直接报错告诉你哪一项不对——这比上线之后才发现好得多。

## 正文支持什么

标准的 Markdown 都支持，另外这个模板还装了 MDX，所以需要的时候可以直接在
`.mdx` 文件里写组件。日常写博客其实用不到。

代码块带语法高亮：

```js
export function greet(name) {
	return `你好，${name}！`;
}
```

> 引用也支持。
>
> ——某个说得很有道理的人

## 想改外观的话

- 站点标题、描述、作者、社交链接：`src/consts.ts`
- 页头导航：`src/components/Header.astro`
- 页脚：`src/components/Footer.astro`
- 文章页排版：`src/layouts/BlogPost.astro`
- 全局样式：`src/styles/global.css`

好了，去写第二篇吧。
