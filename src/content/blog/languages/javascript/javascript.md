---
title: JavaScript学习
description: 简单学一下JavaScript，还包含TypeScript知识
pubDate: 2026-10-1
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
### 类型
#### 联合类型

`string | number` 就是这个值要么是字符串要么是数字
#### 原始类型
`string`、`number`、`boolean`、`null`、`undefined`、`symbol`、`bigint`
可以起别名`type UserId = string`
#### 元组
[string, number]表示正好两项，前一个必须是string，后一个必须是number
(string | number)[] 表示长度任意，每项都可能是两者之一

`[TLocales]` 就是个只有一项的元组，写它的目的不是当数组用，而是阻止条件类型按联合逐项分配。
```ts

type ToArray<T> = T extends any ? T[] : never;
type R = ToArray<string | number>;   // string[] | number[]

type IsNever<T> = T extends never ? true : false;
type A = IsNever<never>;   // 不是 true，而是 never

type IsNever2<T> = [T] extends [never] ? true : false;
type B = IsNever2<never>;    // true
type C = IsNever2<string>;   // false
```
#### 条件类型
类型层面的 if，写法和三元运算符一样：`A extends B ? X : Y`
#### 映射类型
遍历一个类型的所有键，逐个生成新类型。`{ [K in keyof T]: ... }`
`{ [K in keyof TFontProviders]: FontFamily<TFontProviders[K]> }` 就是在遍历你传的字体元组的每一项，把每项交给 `FontFamily` 检查。
#### 模版字面量类型
用反引号和 `${}` 在**类型层面**拼字符串。`` type CssVar = `--${string}` ``
## JavaScript关键字

### default

是ESM标准定义的，表示这个文件默认export default修饰的***值***
### import 
import后面的内容如果有花括号，是***命名导入***，如果没有花括号则是***默认导入***，命名导入的名字必须和对方export时写的一致。
## TypeScript关键字

### declare
`declare` 不是 JS 关键字，是 TypeScript 独有的。它告诉编译器：这个东西运行时**已经存在**，我这里只描述它的类型，别为我生成任何代码。所以你写 `export declare function defineConfig(...)` 等于说"defineConfig 这个函数在别处有实现，我只声明长什么样"。它只存在于类型世界，编译产物里没有它。
### interface
interface的作用是给一种对象起个名字，之后导出引用这个名字就可以了，还能用extends继承其他interface，同名的interface还会***声明合并***

### type
type声明的是***类型别名*** ，可以给任意类型的表达式起名字，语法是`type X = { ... }`
type可以给联合类型、元组、原始类别、条件类型、映射类型、模版字面量类型起别名。
### ### ?:
我在类型定义里看到的，不算是运算符，'?'表示可选，也可以不在对象字面量里定义。
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
### btw
>**非类型模板参数** （Non-type Template Parameters，简称NTTP）

```c++
template <typename T, int N>   // T 是类型参数，N 是 NTTP
struct Array {
    T data[N];
};

Array<double, 4> a;   // T = double，N = 4
// 这个4 必须是预处理阶段就能计算出来的值。
```
## 函数

```TypeScript
export declare function defineConfig<const TLocales extends Locales = never, const TDriver extends SessionDriverName | SessionDriverConfig = never, const TFontProviders extends Array<FontProvider> = never>(config: AstroUserConfig<TLocales, TDriver, TFontProviders>): AstroUserConfig<TLocales, TDriver, TFontProviders>;

```

>`T` + `Locales`：`T` 是 Type 的缩写，前缀表示"这是个类型参数"，是 TS 社区约定（`T`、`TKey`、`TValue` 之类）。`Locales` 就是 i18n 里的"语言地区"配置。

> i18n 指的是 internationalization i和n中间18个字符，和k8s比较像，哈哈。

三个尖括号里的东西是类型参数，逐个拆第一个：


```javascript
(config: AstroUserConfig<TLocales, TDriver, TFontProviders>): AstroUserConfig<TLocales, TDriver, TFontProviders>
```


<!--一句话：`defineConfig` 是个恒等函数——传进去什么形状的配置，返回什么形状，唯一作用是让 TS 借调用现场推断并保留类型。-->

### extend
extends 相当于 C++的 require std::derived_from<Tocales, locales>，只接受符合类型的参数
### =never
`=never` `= never` 是默认值，相当于 C++ 模板默认参数 `= void`，没推断出来时兜底。`never` 在 TS 里是底类型，表示"无值"，这里当"未指定"用。
### const
` const TDriver extends SessionDriverName | SessionDriverConfig = never`这里的|代表可以是两种类型中的一种。`const`是把类型直接设为传入的值，而不是拓宽成宽泛类型（这是TypeScript 5.0的特性）
### 参数列表
是typescript的特性，在参数`:`后面跟着，表示参数的类型
### 返回类型
圆括号后面的`:`后面的类型就是返回值类型

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
## 后缀
### '.d.ts'
`.d.ts` 是 TypeScript 的类型声明文件，d 是 declaration（声明）。

它只描述类型和接口，不含任何实现代码，也不会被编译成 js。作用是给已有的 js 代码或外部模块补一份类型说明，让 TS 能检查和提示。

跟 `.ts` 的区别就是：`.ts` 有实现、会编译；`.d.ts` 只有类型、不参与编译。
## 缩写

| 后缀   | 全称                                          |
| ---- | ------------------------------------------- |
| .mjs | ES Module(ESM) JS                           |
| .csj | CommonJS(CJS)                               |
| .js  | JavaScript                                  |
| ESM  | ECMAScript Modules                          |
| ECMA | European Computer Manufacturers Association |
| RSS  | Really Simple Syndication/Rich Site Summary |
| MDX  | Markdown + JSX                              |
| JSX  | Javascript XML                              |