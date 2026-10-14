---
title: JavaScript学习
description: 简单学一下JavaScript
pubDate: 2026-10-01
draft: true
aliases:
  - JS
---
[js-mdx-toolkit](js-mdx-toolkit.md)
[TypeScript](TypeScript.md)

### ECMAScript

ECMA的全称是“European Computer Manufacturers Association”，中文名称为“欧洲计算机制造商协会”。ECMAScript是语言规范，ESM是其中一章。
### ESM是什么 

ECMAScript Modules，JS 官方的模块标准，用 `import`/`export` 语法。
和 CommonJS 对应。
### CommonJS(CJS)

与ESM相对，用 `require`/`module.exports`，Node 早期默认的模块系统。
### Node.js

Node.js是一个运行环境(run time)，包含V8引擎和一大堆通过C++提供的接口，Node标准库 + libuv，libuv没有官方的名字。

Node.js运行时标准由OpenJS Foundation 维护,规定宿主环境提供哪些API,以及模块如何加载。Node的模块同时支持CommonJS（`require`）和 ESM（`import`）
### v8引擎

V8引擎是Google写的JavaScript引擎，本质是一个C++写的程序，它的工作是读JS源码，编译成机器码并在CPU上执行。

> 运行时（runtime）是指程序被当作库或可执行文件链接进内存中陪着主要程序运行的；对比编译时，编译器在编译完成程序后就退场了。编译时，链接时，运行时（compile time/link time/run time）并不是JS的术语，JS主要划分成构建时(Build time)和运行时(run time)

## JavaScript关键字

### default

是ESM标准定义的，表示这个文件默认export default修饰的***值***
### import 
import后面的内容如果有花括号，是***命名导入***，如果没有花括号则是***默认导入***，命名导入的名字必须和对方export时写的一致。

import的路径如果有`./`或`../`说明是本地文件，如果是`astro/types`这种则是***模块说明符***，是通过node_modules解析的路径，如果其中有`:` 比如`astro:assets`则是***虚拟模块***。
### export
`export { default as Image } from "astro/components/Image.astro` 是"转口"，英文叫 re-export：它自己不定义任何东西，只是把另一个模块的导出原样再导出一次。本模块自己用不到这个export，这里是把Image.astro的default export 作为 Image类名导出。

## 运算符
### || 和 ？？

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


本质是短路：只对 `null`/`undefined` 短路，`0`、`''` 不会触发。
### ?.
`?.`是可选链(optional chaining) ``repoName?.endsWith(...)` 的意思是：如果 `repoName` 是 `null` 或 `undefined`，整个表达式直接返回 `undefined`，不调用 `endsWith`；否则正常调用。]]

## 字面量

### 对象字面量

对象字面量和字面量类型名字挺像的，其实是有很直接的逻辑原因的，因为字面量就是`literal`翻译过来的，表示所见即所得，直接用一个花括号像是`initializer_list`一样创建一个对象，就是对象字面量。
### 数组字面量
和上面意思很接近，看代码就知道了：
```javascript
variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
```
## 函数

### => 箭头函数
`=>` 是箭头函数，写法是 `参数 => 返回值`,等价于一个匿名函数。与普通函数不同的点是箭头函数没有`this`
## 解构
解构是 JavaScript 的语法，ES6（2015）引入的。作用是从数组或对象里，按位置或键名把值批量取出来，赋给变量。
```js
const arr = [1, 2, 3];
const [a, b] = arr;   // a=1, b=2

const obj = { x: 10, y: 20 };
const { x, y } = obj;   // x=10, y=20（变量名必须和键名对上）
const { x: first } = obj;  // 想改名就写 x: first，first=10
```
## 缩写

| 后缀   | 全称                                          |
| ---- | ------------------------------------------- |
| .mjs | ES Module(ESM) JS                           |
| .cjs | CommonJS(CJS)                               |
| .js  | JavaScript                                  |
| ESM  | ECMAScript Modules                          |
| ECMA | European Computer Manufacturers Association |
| RSS  | Really Simple Syndication/Rich Site Summary |
| MDX  | Markdown + JSX                              |
| JSX  | JavaScript XML                              |
