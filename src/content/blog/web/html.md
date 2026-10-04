---
title: HTML文档学习
description: HTML文档学习
pubDate: 2026-10-1
---

教程推荐：[HTML 教程 | 菜鸟教程](https://www.runoob.com/html/html-tutorial.html)

`<html lang="zh-CN">` 告诉浏览器语言是什么，lang是属性language，zh是语言码，CN是地区码。不写也能显示页面，但会影响SEO和无障碍。

`<html meta charset="UTF-8">` 告诉浏览器编辑html内容的编码是什么，避免浏览器解析乱码。

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

### 链接写法

```
<a href="https://www.runoob.com">这是一个链接</a>
```



### 图像写法

```
<img src="/images/logo.png" width="258" height="39" />
```



## 实际代码

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





