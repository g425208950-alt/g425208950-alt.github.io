---
title: JavaScript的MDX工具学习
description: 好多东西呀
pubDate: 2026-10-03
---

识别.mdx为后缀的文件，可以用Markdown 语法 + 能 import 组件、能写 JSX 表达式。相当于"Markdown 的书写体验 + 组件系统的能力"。
# 1. 内容站里嵌入可复用组件

博客、文档站里，有些内容反复出现且结构复杂，手写 Markdown 很啰嗦。做成组件后在 MDX 里一行调用。
![[js-mdx-toolkit 2026-10-04 14.56.46.excalidraw]]
比如提示框：

```Mdx
import Callout from '../components/Callout.astro';
<Callout type="warning">升级前请先备份数据。</Callout>
```
<Callout type="warning">升级前请先备份数据。</Callout>

不用 MDX 的话，只能每种提示框写一堆 HTML，或者用 Markdown 的引用块硬凑，样式和语义都受限。

# 2. 文章里嵌入可视化 / 交互

教程、技术文章常需要图表、demo、可交互示例。

```Mdx

import LiveDemo from '../components/LiveDemo.jsx';
下面是运行效果，你可以直接改：

<LiveDemo initialCode="console.log(1)" />
```



纯 Markdown 只能放静态截图或外链，MDX 能直接嵌真的运行组件。

# 3. 数据驱动的内容

内容需要根据数据生成，而不是写死。

```Mdx

import versions from '../data/versions.json';
最新版本是 {versions[0].name}，发布于 {versions[0].date}。
```



写文档时版本号、日期这类东西能引用单一数据源，避免到处手改。

# 4. 文档站里的结构化组件

API 文档、组件文档常有大量重复结构：参数表、属性列表、示例块。做成组件后，写一篇新文档就是填参数。

```
Mdx

import PropsTable from '../components/PropsTable.astro';

<PropsTable data={[

  { name: 'size', type: 'string', default: 'md' },

]} />
```
# 5. 多作者 / 团队协作的一致性

给作者一套受控组件（提示框、代码标签、流程步骤），作者只用 Markdown 和这些组件写内容。样式和规范统一，作者也不需要懂 HTML/CSS。