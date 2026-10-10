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