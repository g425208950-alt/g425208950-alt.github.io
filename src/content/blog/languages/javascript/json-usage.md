---
title: JSON 使用速查
description: 以 package.json 为例看 JSON 的对象与数组，并顺带理清 JavaScript、Node 与宿主环境的关系。
pubDate: 2026-09-30
draft: true
---

*package.json*

```json
{
  "name": "blog",
  "type": "module", // 让.js文件按ES Module解析 
  "version": "0.0.1",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/mdx": "^8.0.2",
    "@astrojs/rss": "^4.0.19",
    "@astrojs/sitemap": "^3.7.4",
    "astro": "^7.3.5",
    "sharp": "^0.35.0"
  },
  "allowScripts": {
    "esbuild": true
  }
}
```

花括号 `{}` 是对象，里面是 key-value；方括号 `[]` 是数组，里面是列表。

>**ES Module（ESM）是 JavaScript 在 ES6（2015）中引入的官方模块系统，使用 `import` 与 `export` 来组织代码，具有静态结构、严格模式默认开启、独立作用域与浏览器/Node.js 原生支持等特性。**

JavaScript 是语言规范，Node 是运行这个语言的其中一个宿主环境。

JavaScript 本身只定义语法和语义（变量、函数、async 等），由 ECMAScript 标准规定，不涉及文件读写、网络、进程这些能力。真正让 JS 跑起来、并给它一套系统级 API 的是宿主环境。浏览器和 Node 都是宿主。

区别在宿主提供的能力不同。浏览器给的是 `window`、`document`、DOM、fetch、localStorage。Node 给的是 `process`、`fs`、`path`、`http`、Buffer，能读写文件、开服务器、操作系统资源。同一门语言，两套 API。

> 引擎层面的关系要分清楚：Node 底层用 V8 引擎执行 JS，V8 才负责把 JS 编译成机器码。所以链条是 JS 规范 → V8 引擎实现它 → Node 在 V8 外面套一层 C++ 和系统 API，让 JS 能做后端的事。具体差异可以举几个：浏览器里没有 `require` 也没有 `fs`；Node 里没有 `window` 和 DOM，写不了 `document.getElementById`。所以"能跑 JS 的地方"不等于"能力一样"，取决于宿主。
>
> DOM` 是 Document Object Model，文档对象模型。它是浏览器把 HTML 解析成的一棵可操作的树，JS 通过它改页面，比如 `document.getElementById('app')` 拿到某个元素、改它的内容或样式。DOM 是浏览器提供的，Node 里没有，因为 Node 不显示网页。
