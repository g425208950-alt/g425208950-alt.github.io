---
title: Markdown 写作速查
description: 写博客时最常用的 Markdown 语法，贴在手边随时查。
pubDate: 2024-01-15
---

这篇当备忘录用，忘了语法就翻出来看一眼。

## 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
```

文章标题由 frontmatter 的 `title` 决定，所以正文一般从 `##` 开始用。

## 强调与链接

```markdown
**加粗**、*斜体*、~~删除线~~、`行内代码`

[链接文字](https://example.com)
```

效果：**加粗**、*斜体*、~~删除线~~、`行内代码`，以及一个[链接](https://example.com)。

## 列表

无序列表用 `-`，有序列表用 `1.`，可以嵌套：

```markdown
- 第一项
  - 嵌套项
- 第二项

1. 第一步
2. 第二步
```

## 引用与分割线

```markdown
> 这是一段引用。

---
```

> 这是一段引用。

---

## 代码块

用三个反引号包起来，并在后面写上语言，就能有语法高亮：

````markdown
```python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```
````

```python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

## 表格

```markdown
| 语法 | 效果 |
| ---- | ---- |
| `**粗**` | **粗** |
| `*斜*`  | *斜*  |
```

| 语法     | 效果   |
| -------- | ------ |
| `**粗**` | **粗** |
| `*斜*`   | *斜*   |

## 图片

把图片放到 `src/assets/` 下，然后在 frontmatter 或者正文里引用：

```markdown
![图片说明](../../assets/blog-placeholder-1.jpg)
```

![图片说明](../../assets/blog-placeholder-1.jpg)

Astro 会自动压缩和优化这些图片，构建时生成合适尺寸的 `webp`。

## 插入 HTML

Markdown 里可以直接写 HTML，比如折叠块：

```html
<details>
  <summary>点开看更多</summary>
  藏起来的内容。
</details>
```

<details>
  <summary>点开看更多</summary>
  藏起来的内容。
</details>
