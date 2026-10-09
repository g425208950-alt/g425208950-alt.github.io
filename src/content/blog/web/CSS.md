---
title: CSS学习
description: 在美化自己的博客网站的同时学一下CSS!
pubDate: 2026-10-05
---
## CSS介绍
全称***Cascading Sheets Style***
CSS是在HTML4开始使用的，是为了更好地渲染HTML元素而引入的。


1.===HTML 和 CSS 在浏览器里怎么连起来===，流程是这样的。浏览器先请求 HTML 文件，边下载边解析，把标签搭成一棵 DOM 树；解析到 `<head>` 里的 `<link rel="stylesheet" href="...">` 时，再发起**第二个独立请求**去拿 CSS 文件；CSS 拿到后被解析成一堆"选择器 → 声明"的规则；然后浏览器做匹配——遍历 DOM 里的每个元素，找出所有能命中它的选择器，按优先级和层叠算出这个元素最终该是什么样；最后才布局、绘制。所以 **HTML 和 CSS 是两个文件、两次请求，一个只有结构，一个只有规则，它们之间唯一的桥梁就是选择器**。在 Astro 里你少写了那句 `<link>`，是因为 `import '../styles/global.css'` 让 Vite 在构建时替你把它插进产物了，最终浏览器看到的仍然是"HTML 里一个 link，再去拿一个 css 文件"。
2.
## 缩写
| 缩写  | 全称                          |
| --- | --------------------------- |
| px  | pixel                       |
| DOM | Document Object Model       |
| SVG | Scalable Vector Graphics    |
| em  | em quad（可以理解成对标当前元素字号的比例单位） |
| rem | root em （相对根元素html）         |
| ch  | character                   |
| fr  | fraction                    |

CSS 的每一条规则都是同一个形状：
```css
selector { property: value; }
```
## 选择器

`ul > li > a` 是一条CSS选择器，`>`叫 子代组合器，空格是后代组合器。
它的作用有三层。一是定位元素，从 DOM 里挑出要改的那些；常见的几类有元素选择器 `a`、类选择器 `.title`、ID 选择器 `#main`、属性选择器 `[type="text"]`、伪类 `:hover`、伪元素 `::before`。二是决定优先级，当多条规则命中同一个元素又互相冲突时，浏览器按选择器的**特异性**算权重，越具体的越赢，`#id .cls a` 就比单个 `a` 强。三是它同时也是 JavaScript 的查询语言，`document.querySelector('ul > li > a')` JS这里用的就是同一套语法
```html
<ul>
  <li>
    <a href="/blog/hello-world/">文章标题</a>
  </li>
  <li>
    <a href="/blog/css/">另一篇</a>
  </li>
</ul>
```
## 语法
`a.cta` 是连写，表示"标签是 `<a>`，并且 class 里有 `cta`"，两个条件同时满足。
`cta`全称`Call To Action`，引导用户点击并响应的意思。

```css
main > p:first-of-type
```
意思是必须在main标签中，p是main的第一个子标签。
如果是` p:first-of-type`就是要求p是每个父元素的第一个。 
### 伪类
伪类写一个冒号

***伪类不能自己命名***

伪类大致分两类：结构性的（`:root`、`:first-child`、`:nth-child`）看的是 DOM 里的位置，状态性的（`:hover`、`:focus`、`:checked`）看的是运行时状态，两者都是浏览器本来就掌握的事实，选择器只是去读它。而 `html` 也不算什么"映射"——解析时标签名就变成了元素，按名字匹配只是一次字符串比较。所以两者的区别不在实现难度，而在 `:root` 描述的是"位置"，`html` 描述的是"名字"。
### 伪元素
伪元素写两个冒号
伪元素不是一个真实存在的标签，是 CSS 凭空生成的一小块内容，用来给元素的某个部分套样式。写法是双冒号，常见的有 `::before`、`::after`（在元素内部的前/后插入内容，要配合 `content` 用）、`::first-line`、`::first-letter`（选中首行、首字母）、`::placeholder`、`::selection`（选中文字的高亮）、`::marker`（列表项符号）。
## btw
***SVG*** 的全称是 Scalable Vector Graphics，可缩放矢量图形，一种基于 XML 的二维图形格式。它和 PNG/JPG 的根本差别在"怎么存"：PNG 存的是**像素网格**，每个点记一个颜色，所以放大就糊、文件大小随尺寸暴涨；SVG 存的是**几何描述**——一堆点、线、曲线、填充色的指令，浏览器收到后按当前尺寸实时画出来，所以放大多少都清晰，这也是它适合做图标的原因。SVG 有两种用法：作为独立文件（你的 `public/favicon.svg`，用 `<img>` 或 `<link rel="icon">` 引用），或者**内联**成 HTML 里的 `<svg>...</svg>` 元素（你 Header.astro 里的 GitHub 图标和 RSS 图标就是）。内联的那种是 DOM 的一部分，能被 CSS 选中、也能用 `fill` 和 `stroke` 上色——你的图标写的是 `fill="currentColor"`，意思是"用当前文字颜色填充"，所以鼠标悬停时文字变灰、图标跟着变，这不是 JS 干的，是 CSS 的 `color` 继承下来的。

***"全局扁平"是什么意思***
在任意一个 `.css` 文件里写下 `.title { color: red }`，这条规则就对**整个页面里所有** `class="title"` 的元素生效——不管它在页头、正文还是页脚，也不管是哪个文件写的。CSS 里没有"这个类只在我这块区域有效"的概念。所谓"扁平"，是说类名之间不存在包含关系：你写 `.card .title` 只是表示"匹配 card 里面的 title"这种**位置关系**，并不代表 title 属于 card 的命名空间，`.title` 拿到别处照样能用。所以所有类名其实挤在**同一个大池子**里，谁都可以取用，也谁都可以撞到别人。
后果很具体：项目一大，A 在页头写了个 `.title` 表示导航标题，B 在文章里也写了个 `.title` 表示文章标题，两条规则会互相污染——你调其中一个，另一个跟着变，而且不报错。这就是"全局命名空间污染"。工程上的三种解法，本质都是在**模拟一个本来不存在的局部作用域**：

BEM(Block Element Modifier) 靠**人自觉**。它规定命名格式 `block__element--modifier`，比如 `.card__title`、`.nav__link--active`。这样每个类名都自带"我属于哪个块"的前缀，全局里天然不会重名。它不改变 CSS 的任何行为，纯粹是命名纪律，代价是名字变长、而且要靠团队每个人都遵守。

CSS Modules（这是个构建工具层的规定，由社区提出，现在由打包器实现，Vite、webpack、Parcel 都支持） 靠**构建工具改名**。你把文件命名成 `xxx.module.css`，里面照常写 `.title`，构建时它变成 `.title_3x9k2` 这种带哈希的名字，只有从这个模块里 import 过的代码才能拿到那个哈希。名字还是你起的，但真正进浏览器的名字是机器生成的，撞车概率归零。btw，虽然也包含import语法，但是这不是EMS的规则，只是实际实现行为。

Astro 的 **scoped style** 靠**编译器改写选择器**。你在 `BlogPost.astro` 的 `<style>` 里写 `.title { }`，编译后变成 `.title.astro-7x2k1 { }`，同时那个组件里的元素会被加上 `astro-7x2k1`。只有同时满足"是 .title"和"带这个标记"的元素才命中——而标记只发给了本组件的元素，于是这条看似全局的规则被悄悄限制住了。