---
title: npm用法
description: 日常遇到的npm的疑问
pubDate: 2026/9/30
draft: true
---

## command
### ci
npm ci 的 ci 是 Continuous Integration的缩写

为什么叫 npm ci：ci 就是 CI/CD 里的 Continuous Integration，因为它的设计目标就是给流水线用的——每次构建都从零、精确、可复现，所以拿这个场景命名。

`^` 的意思：语义化版本里的"允许升级到次版本"。`^1.2.0` 表示 `>=1.2.0 且 <2.0.0`，主版本不变、次版本和补丁可以往上升。常见符号还有 `~`（只允许补丁升级，`>=1.2.0 <1.3.0`）和精确版本 `1.2.0`（锁死）。

npm install 其实会读 package-lock。区别是：有 lock 且和 package.json 不冲突时，它按 lock 装；但如果你改了 package.json 里的版本范围，或者 lock 缺失/过期，它就会重新求解并更新 lock。npm ci 则完全以 lock 为准，lock 和 package.json 对不上就直接报错，绝不擅自改。

比如 `@babel/core`、`@types/node`，`@` 前是作用域，后是包名，这是一个整体包名，不是两个东西。文件系统里就表现为 `node_modules/@babel/core` 这样的两层目录。
## 选项
### --save选项
老版本 npm 装包只放 `node_modules`，不会改 `package.json`，必须显式加 `--save` 才把依赖记进 `dependencies`，加 `--save-dev` 才记进 `devDependencies`
npm 5 以后 `npm install` 默认就写进 `package.json`，`--save` 成了默认行为。

## npx
`npx` 本质上是 `npm exec` 的简写。
`npm`和`npx`职责上要分开看。npm 管**依赖**：安装、卸载、升级，查看依赖树（`npm ls`）、检查漏洞（`npm audit`）、发布（`npm publish`）。它还会**跑脚本**：`npm run dev` 会读 `package.json` 的 `scripts` 字段，把里面写的命令执行掉。npx 只管一件事：**执行某个包提供的命令行工具**，而且不需要事先全局安装。npm 7 之后 npx 就是 `npm exec` 的别名，`npx astro dev` 和 `npm exec astro dev` 完全等价。
**`npm run` 之所以能跑 `astro dev`，是因为 npm 在跑脚本前临时把 `node_modules/.bin` 加进了 PATH**。这正是 npx 帮你做的事。所以 `npm run dev` 里的 `astro`、`npx astro`、以及直接写 `node_modules/.bin/astro`，三者最终调用的是同一个文件。再补一组等价关系：`npm run dev`（脚本内容是 `astro dev`）、`npx astro dev`、`npm exec astro dev` 是同一条命令的不同写法；而 `npm create astro@latest` 是 `npm init astro@latest` 的别名，等价于 `npx create-astro@latest`，都表示「临时下载这个脚手架跑一次」。