---
title: JavaScript学习
description: 简单学一下JavaScript
pubDate: 2026-10-1
draft: true
---
[js-mdx-toolkit](js-mdx-toolkit.md)

## JavaScript关键词

## 后缀

| 后缀   | 全称                                          |
| ---- | ------------------------------------------- |
| .mjs | ES Module(ESM)                              |
| .csj | CommonJS(CJS)                               |
| .js  | JavaScript                                  |
| ESM  | ECMAScript Modules                          |
| ECMA | European Computer Manufacturers Association |
| RSS  | Really Simple Syndication/Rich Site Summary |
| MDX  | Markdown + JSX                              |
| JSX  | Javascript XML                              |
### ECMAScript

ECMAScript是语言规范，ESM是其中一章。
### ESM是什么 

ECMAScript Modules，JS 官方的模块标准，用 `import`/`export` 语法。
于CommonJS对应。
### CommonJS(CJS)

与ESM相对，用 `require`/`module.exports`，Node 早期默认的模块系统。
### Node.js

Node.js是一个运行环境(run time)，包含V8引擎和一大堆通过C++提供的接口，Node标准库 + libuv，libuv没有官方的名字。

Node.js运行时标准由OpenJS Foundation 维护,规定宿主环境提供哪些API,以及模块如何加载。Node的模块同时支持CommonJS（`require`）和 ESM（`import`）
### v8引擎

V8引擎是Google写的JavaScript引擎，本质是一个C++写的程序，它的工作是读JS源码，编译成机器码并在CPU上执行。

> 运行时（runtime）是指程序被当作库或可执行文件链接进内存中陪着主要程序运行的；对比编译时，编译器在编译完成程序后就退场了。编译时，链接时，运行时（compile time/link time/run time）并不是JS的术语，JS主要划分成构建时(Build time)和运行时(run time)

### TypeScript

TypeScript包含JavaScript，是Javascript的超集，即JavaScript是TypeScript的真子集，TypeScript提供了一些关于类型的附加功能。
## 运算符

`||` 和 `??` 对 falsy 值的处理不同。`||` 把 `0`、`''`、`false`、`NaN`、`null`、`undefined` 全部当空；`??` 只把 `null`、`undefined` 当空。
```
0 || 'x'    // 'x'
0 ?? 'x'    // 0
'' || 'x'   // 'x'
'' ?? 'x'   // ''
false || 'x' // 'x'
false ?? 'x' // false
null ?? 'x'  // 'x'
```

`?.`是可选链(optional chaining) ``repoName?.endsWith(...)` 的意思是：如果 `repoName` 是 `null` 或 `undefined`，整个表达式直接返回 `undefined`，不调用 `endsWith`；否则正常调用。

本质是短路：只对 `null`/`undefined` 短路，`0`、`''` 不会触发。

## 对象

process.env 被封装成了一个对象，C++里对应`getenv/environ`，但Node把它做成了一个对象
