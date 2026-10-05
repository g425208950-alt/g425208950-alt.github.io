---
title: JavaScript学习
description: 简单学一下JavaScript，还包含TypeScript知识
pubDate: 2026-10-1
draft: true
---
[js-mdx-toolkit](js-mdx-toolkit.md)

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
## JavaScript关键字

### default


## TypeScript关键字

### declare
`declare` 不是 JS 关键字，是 TypeScript 独有的。它告诉编译器：这个东西运行时**已经存在**，我这里只描述它的类型，别为我生成任何代码。所以你写 `export declare function defineConfig(...)` 等于说"defineConfig 这个函数在别处有实现，我只声明长什么样"。它只存在于类型世界，编译产物里没有它。

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

`?.`是可选链(optional chaining) ``repoName?.endsWith(...)` 的意思是：如果 `repoName` 是 `null` 或 `undefined`，整个表达式直接返回 `undefined`，不调用 `endsWith`；否则正常调用。

本质是短路：只对 `null`/`undefined` 短路，`0`、`''` 不会触发。
## 类型

### 字面量类型
字面量类型就是"具体某个值本身当作一个类型"。`'redis'` 是一个类型，`'mysql'` 是另一个，各自只包含那一个值。它跟 `string` 的关系是子类型，`'redis'` 属于 `string`，反过来不成立。
#### 怎么会让例如’redis‘自成一种类型？
为什么 TS 能内建：TS 的类型系统是纯编译期的薄壳，字面量在源码里写得清清楚楚，它顺手把值本身登记成类型几乎零成本。而且 JS 里字符串、数字、布尔、null 都是一等值，天然有"某个具体值"的概念，给它配个类型顺理成章。

>一等值指这个值能像其他任何值一样随便用：赋给变量、当参数传、当返回值、塞进数组或对象、参与运算，处处不受特殊限制。
JS 里字符串、数字、布尔、null 都是一等值，`let x = 'redis'`、`f('redis')`、`['redis']` 都行，它们和普通数据没有区别。
对照 C++，类型就不是一等值。`int` 这个类型不能赋给变量，不能当函数参数传，`int y = int;` 是非法的。你只能写 int 的实例，不能把类型本身当值使唤。

这跟性能无关，类型不产生运行时开销。TS 编译后类型全部擦除，跑的 JS 里什么都没有，快慢跟这套类型系统不沾边。C++ 的 `integral_constant<int, 42>` 同理，也是编译期，运行时不花时间。

真正的差别不在快慢，在于 C++ 的类型要参与代码生成。模板参数会影响最终汇编，所以参数必须是编译期能确切比较的东西。老 C++ 只允许整型、枚举、指针这类非类型模板参数，字符串字面量是运行时内存里的地址，跨编译单元还不一定相等，没法当参数，于是做不出 `'redis'` 这种类型。C++20 放宽了 NTTP，可以用字面量类型的类做参数，硬凑也能造出字面量字符串类型，比如用一个 `constexpr` 字符数组包装，但写法很重，没人真这么干。

>**非类型模板参数** （Non-type Template Parameters，简称NTTP）

一句话：TS 内建是因为类型只是编译期标签、可以随便贴；C++ 受限是因为类型会落成真代码、要对生成结果负责。

JS 没有类型系统，所以谈不上底类型，运行时的 `undefined`/`null` 更像"空值"，不是 TS中的never。

TS 里 never 是唯一没有值的类型，常出现在：抛异常函数的返回类型、不可能到达的分支、穷尽检查的兜底。跟它最容易混的是 `void`——void 表示"有返回但不关心值"，never 表示"根本不会正常返回"。C++ 里对应的更接近 `[[noreturn]]`。
## 函数

```TypeScript
export declare function defineConfig<const TLocales extends Locales = never, const TDriver extends SessionDriverName | SessionDriverConfig = never, const TFontProviders extends Array<FontProvider> = never>(config: AstroUserConfig<TLocales, TDriver, TFontProviders>): AstroUserConfig<TLocales, TDriver, TFontProviders>;

```

>`T` + `Locales`：`T` 是 Type 的缩写，前缀表示"这是个类型参数"，是 TS 社区约定（`T`、`TKey`、`TValue` 之类）。`Locales` 就是 i18n 里的"语言地区"配置。

> i18n 指的是 internationalization i和n中间18个字符，和k8s比较像，哈哈。

三个尖括号里的东西是类型参数，逐个拆第一个：
`const TLocales extends Locales = never`

`TLocales` 是参数名。`extends Locales` 是约束，相当于 C++20 的 `requires std::derived_from<TLocales, Locales>`，只接受满足 Locales 的类型。`= never` 是默认值，相当于 C++ 模板默认参数 `= void`，没推断出来时兜底。`never` 在 TS 里是底类型，表示"无值"，这里当"未指定"用。

`const` 是 TS 5.0 才有的 const 类型参数，C++ 没有对应物。它是个开关，控制推断时保不保字面量。不写 `const` 时，传 `locales: 'en'` 推断成 `string`；写了 `const`，推断成 `'en'`。目的就是让类型尽量精确，别被宽化。
然后看参数和返回值：

代码里这个 `const TDriver`，是类型参数上的 const，跟运行时无关，只在推断时起作用。对比一下加不加的区别：

不加 `const`，你写 `driver: 'redis'`，TS 推断 `TDriver` 为 `string`。字面量 `'redis'` 被"宽化"成了它所属的宽类型 `string`，因为你没要求保留具体值。

加了 `const`，推断 `TDriver` 为 `'redis'`，字面量本身，不宽化。

差别在哪？返回类型里带着 `TDriver`。如果推断成 `string`，那么别处拿到 `defineConfig` 的返回结果时，只知道"这是个字符串"，不知道你选了 redis；推断成 `'redis'`，别处就能精确知道你用的是哪个驱动，可以据此给出更准的类型提示或检查。

所以这里的 const 就是一句要求：推断时别偷懒宽化，把字面量原样保留下来。它作用的对象是类型，不是值，跟 `const x` 那个 const 同名不同义。

`(config: AstroUserConfig<TLocales, TDriver, TFontProviders>): AstroUserConfig<TLocales, TDriver, TFontProviders>`

参数类型和返回类型是同一个泛型类型，且用的泛型参数完全相同。这就跟 C++ 模板实参推导一样：调用时 TS 从你传进去的 config 反推出三个类型参数，然后原样放进返回类型。

设计意图是类型透传——你把配置写进去，TS 推断出里面 locales、session、fonts 的精确类型，返回值同样带着这些类型。这样 `astro.config` 导出后，别处引用它仍能拿到准确类型，不会退化成宽泛的默认类型。不加这层透传，返回值类型就是固定的一坨，传入的具体信息全丢了。

一句话：`defineConfig` 是个恒等函数——传进去什么形状的配置，返回什么形状，唯一作用是让 TS 借调用现场推断并保留类型。


## 对象

### process.env
process.env 被封装成了一个对象，C++里对应`getenv/environ`，但Node把它做成了一个对象。

### 对象字面量(object literal)
```javascript
export default defineConfig({ // default是“默认导出的标记”表示这是这个模块对外暴露的默认那个值。
	site,
	base,
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
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
			},
		},
	],
});
```
`{ ... }` 这一对花括号加里面的键值对是一个对象字面量（object literal）。它作为参数传给了 `defineConfig(...)`。
里面嵌套的 `fonts: [ { ... } ]`，这个 `{ ... }` 也是对象字面量，只是嵌在数组里。`variants` 里的每一项同样是对象字面量。
*对象字面量* 这个术语指的是一整块 `{ key: value }` 语法本身，不管它出现在哪、嵌套几层。整段代码可以叫"一个传给 defineConfig 的对象字面量"，或者直接说"这个对象字面量"。

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