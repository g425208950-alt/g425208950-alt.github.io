---
title: HTML文档学习
description: HTML文档学习
pubDate: 2026-10-1
---

教程推荐：[HTML 教程 | 菜鸟教程](https://www.runoob.com/html/html-tutorial.html)

ps: 本文内容有部分内容引用自菜鸟教程
`<html lang="zh-CN">` 告诉浏览器语言是什么，lang是属性language，zh是语言码，CN是地区码。不写也能显示页面，但会影响SEO和无障碍。

`<html meta charset="UTF-8">` 告诉浏览器编辑html内容的编码是什么，避免浏览器解析乱码。

[[CSS]]
## HTML版本

| 版本      | 发布时间 |
| --------- | -------- |
| HTML      | 1991     |
| HTML+     | 1993     |
| HTML 2.0  | 1995     |
| HTML 3.2  | 1997     |
| HTML 4.01 | 1999     |
| XHTML 1.0 | 2000     |
| HTML 5    | 2012     |
| XHTML 5   | 2013     |

### HTML 4.01

```
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
```



### XHTML 1.0

```<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```

如果没写标准或者写错就是quirk mode怪异模式，模拟旧行为，因为1990年代末浏览器（尤其IE）不按照标准实现，为了兼容老网站，用DOCTYPE作开关。

## 全称

### 琐碎的缩写

| 缩写   | 全称                                                    |
| ------ | ------------------------------------------------------- |
| DTD    | Document Type Definition                                |
| W3C    | World Wide Web Consortium                               |
| WHATWG | Web Hypertext Application Techonology Working Group     |
| SGML   | Standard Generalized Markup language（XML是其简化子集） |
| DOM    | Document Object Model                                   |
|        |                                                         |
|        |                                                         |



### 标签全称

| 缩写     | 全称                |
| :------- | ------------------- |
| h1/h2/h3 | heading level1/2/3  |
| p        | paragragh           |
| b        | bold                |
| a        | anchor              |
| href     | hypertext reference |
| img      | image               |
| hr       | horizontal rule     |
|          |                     |
|          |                     |

## HTML基础

### 链接

```
<a href="https://www.runoob.com">这是一个链接</a>
```

#### 链接属性

##### href
   >这是超链接最重要的属性，用来指定链接的目的地，可以是另一个网页、文件、邮件、电话号码或 JavaScript。

##### target
- `_blank`: 在新窗口或新标签页中打开链接。
- `_self`: 在当前窗口或标签页中打开链接（默认）。
- `_parent`: 在父框架中打开链接。
- `_top`: 在整个窗口中打开链接，取消任何框架。
##### rel
###### nofollow
>表示搜索引擎不应跟踪该链接，常用于外部链接。

它表达"这个链接不是我推荐的"。搜索引擎会把链接当作一种投票——被推荐得多的页面排名靠前，而 `nofollow` 就是告诉它"这一票不算数，也别顺着爬过去"。典型场景是评论区、论坛签名、付费广告，因为这些内容你无法担保。它不影响用户点击，也不会让链接失效或 404，纯粹是给爬虫的语义提示。
noopener 和 noreferrer: 防止在新标签中打开链接时的安全问题，尤其是使用 target="_blank" 时。
###### noopener
> 防止新的浏览上下文（页面）访问`window.opener`属性和`open`方法。

noopener：防的是"新页面反过来控制旧页面"。 早期浏览器里，用 `target="_blank"` 打开的新标签能通过 `window.opener` 拿到上一个页面的引用，进而把它导航走——比如你点开一个链接，新标签被换成钓鱼页面，同时你原来那个标签悄悄跳到了仿冒登录页，这叫 tabnabbing。加了 `noopener`，新页面的 `window.opener` 就是 `null`，什么也做不了。要说明的是，现在的浏览器（Chrome 88 之后）对 `target="_blank"` 已经默认加上这个行为，所以它现在更多是兼容老浏览器和表明意图。你的 Header.astro:16 和 Footer.astro:11 里的 GitHub 链接就写着 `target="_blank" rel="noopener"`，正是为了这个。
###### noreferrer
>不发送referer header（即不告诉目标网站你从哪里来的）。
 `noopener noreferrer`: 同时使用`noopener`和`noreferrer`。例子: `<a href="https://www.example.com" rel="noopener noreferrer">安全链接</a>`

noreferrer：不告诉对方你从哪来。你点一个外部链接时，浏览器默认会在请求头里带一个 `Referer`，写明来源页面的地址。`noreferrer` 表示不带这个头，同时也隐含了 `noopener` 的效果（规范规定它一样会把 opener 置空）。什么时候需要？来源 URL 本身含敏感信息时，比如 `example.com/reset?token=xxx`，你不希望这个 token 泄露给目标站。代价是对方看不到来源，会影响他们的统计和防盗链判断。
##### download
>提示浏览器下载链接目标而不是导航到该目标。
###### title
>定义链接的额外信息，当鼠标悬停在链接上时显示的工具提示。
`<a href="https://www.example.com" title="访问 Example 网站">访问 Example</a>`
##### id
>用于链接锚点，通常在同一页面中跳转到某个特定位置。

```html
<!-- 链接到页面中的某个部分 -->
<a href="#section1">跳转到第1部分</a>
<div id="section1">这是第1部分</div>

```
###### hrelang
>指定链接的目标URL的语言
```html
<a href="https://www.example.com/es" hreflang="es">访问西班牙语网站</a>
```
注：这里通常没有用，因为对应站点会自己声明，还有`Content-Language` 响应头
`hreflang` 真正重要的场景是***多语言站点***。
##### type
>指定链接资源的MIME类型

```html
<a href="style.css" type="text/css">样式表</a>
```
##### class
>用于指定元素的类名（CSS中定义）
```html
<a href="https://www.example.com" class="external-link">外部链接</a>
```
##### style
>直接在元素上定义CSS样式
```html
<a href="https://www.example.com" style="color: red;">红色链接</a>
```
#### 空链接
| 方法                          | 作用            | 是否会跳转 | 场景适用性            |
| --------------------------- | ------------- | ----- | ---------------- |
| `href="#"`                  | 导航到页面顶部       | 是     | 占位符，捕获点击事件       |
| `href="javascript:void(0)"` | 阻止默认行为，不刷新页面  | 否     | 阻止跳转，配合 JS 使用    |
| `href=""`                   | 刷新当前页面        | 是     | 需要页面刷新时          |
| `href="about:blank"`        | 打开空白页面        | 是     | 新窗口打开空白页面        |
| `role="button"`             | 链接表现为按钮，无默认行为 | 否     | 配合 JS 实现按钮功能，无跳转 |
|                             |               |       |                  |

### 图像

```
<img src="/images/logo.png" width="258" height="39" />
```
### 头部
`<head>` 元素包含了所有的头部标签元素。在 `<head>`元素中你可以插入脚本（scripts）, 样式文件（CSS），及各种meta信息。

可以添加在头部区域的元素标签为: `<title>`, `<style>`, `<meta>`, `<link>`,` <script>`, `<noscript>` 和 `<base>`。



#### `<title>` 元素
```html
<!DOCTYPE html> <html> <head> <meta charset="utf-8"> <title>文档标题</title> </head> <body> 文档内容...... </body> </html>
```
#### `<base>` 元素

>`<base>`标签描述了基本的链接地址/链接目标，该标签作为HTML文档中所有的链接标签的默认链接:

```html
<head>
<base href="http://www.runoob.com/images/" target="_blank">
</head>
```

####  `<style>` 元素
>`<style>` 标签定义了HTML文档的样式文件引用地址.
在`<style>` 元素中你也可以直接添加样式来渲染 HTML 文档:
```html
<head> <style type="text/css"> body { background-color:yellow; } p { color:blue } </style> </head>
```

#### `<meta>` 元素

>meta标签描述了一些基本的元数据。
>`<meta>` 标签提供了元数据.元数据也不显示在页面上，但会被浏览器解析。
META 元素通常用于指定网页的描述，关键词，文件的最后修改时间，作者，和其他元数据。
>元数据可以使用于浏览器（如何显示内容或重新加载页面），搜索引擎（关键词），或其他Web服务。
>`<meta>` 一般放置于 `<head>` 区域

```html
<meta name="keywords" content="HTML, CSS, XML, XHTML, JavaScript">
```
```html
<meta name="description" content="免费 Web & 编程 教程">
<meta name="author" content="Runoob">
<meta http-equiv="refresh" content="30">
```
#### `<script>` 元素

`<script>`标签用于加载脚本文件，如： JavaScript。
`<script>` 元素在以后的章节中会详细描述。


#### `<link>` 元素
><link> 标签定义了文档与外部资源之间的关系
><link> 标签通常用于链接到样式表:
```html
<head> <link rel="stylesheet" type="text/css" href="mystyle.css"> </head>
```
```html
<head>
<link rel="stylesheet" type="text/css" href="mystyle.css"> 
</head>
//`type="text/css"` 在现代浏览器里是多余的，因为 `rel="stylesheet"` 已经蕴含了类型，新写的代码通常省略它。只有在 `rel` 本身不足以表明格式时 `type` 才有用（比如 `rel="preload"` 时需要 `as="style"` 之类的提示）。
```
##### rel
`rel` 是 relationship（关系）的缩写，它告诉浏览器"href 指向的这个东西和当前文档是什么关系"。
1. rel="stylesheet" 会把那个文件下载下来、解析成 CSS、应用到当前页面。如果去掉 `rel` 或者写成别的值，浏览器就只把它当作一个不认识的引用，什么都不做——样式不会生效，也不会报错，静默失效。
2. rel="icon" 是站点图标 <!-- BaseHead.astro-->
3. `rel="canonical"` 是"这个页面的规范地址"（给搜索引擎看）
4. `rel="alternate"` 是"同一内容的另一种版本"<!--你的 RSS 就是-->
5. `rel="preload"` 是"提前把它下下来，我马上要用"
6. 

### HTML的CSS语法

CSS 可以通过以下方式添加到HTML中:

- 内联样式- 在HTML元素中使用"style" 属性
- 内部样式表 -在HTML文档头部 `<head>` 区域使用`<style>` **元素** 来包含CSS
- 外部引用 - 使用外部 CSS **文件**
最好的方式是通过外部引用CSS文件。
#### 一些注意点
不建议使用的标签有: `<font>`, `<center>`, `<strike>`
不建议使用的属性: color 和 bgcolor.
## 实际代码


```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>425208950</title>
    </head>
    <body>
        <h1>我的第一个标题</h1>
        <p>我的第一个段落</p>
    </body>
</html>
```


```html
<body style="background-color:yellow;">
<h2 style="background-color:red;">这是一个标题</h2>
<p style="background-color:green;">这是一个段落。</p>
</body>
```

