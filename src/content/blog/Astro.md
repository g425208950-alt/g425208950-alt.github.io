---
title: astro代码切入学习
description: 通过读源码学习astro有关的前端知识
pubDate: 2026-10-01
draft: true
tags: 前端
---
## Obsidian
[[json-usage]]
[[npm-usage]]
[[html]]
astro文件永远都有两个区域，是astro自己的"代码栅栏"

## 一些缩写
| 缩写  | 全称                                          |
| --- | ------------------------------------------- |
| RSS | Really Simple Syndication/Rich Site Summary |
|     |                                             |




*index.astro*

```as
import BaseHead from '../components/BaseHead.astro';
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { withBase } from '../utils/url';
---

<!doctype html>
<html lang="zh-CN">
	<head>
		<BaseHead title={SITE_TITLE} description={SITE_DESCRIPTION} />
	</head>
	<body>
		<Header />
		<main>
			<h1>{SITE_TITLE}</h1>
			<p>{SITE_DESCRIPTION}</p>
			<p>
				这个站点是用 <a href="https://astro.build/">Astro</a> 搭的：你只需要在
				<code>src/content/blog/</code> 里放 Markdown 文件，推到 GitHub 之后，
				GitHub Actions 会自动构建并发布到 GitHub Pages。
			</p>
			<p>
				<a href={withBase('blog/')}>去看看文章 →</a>
			</p>
		</main>
		<Footer />
	</body>
</html>

```

*BaseHead.astro*

```
---
// Import the global.css file here so that it is included on
// all pages through the use of the <BaseHead /> component.
import '../styles/global.css';
import type { ImageMetadata } from 'astro';
import FallbackImage from '../assets/blog-placeholder-1.jpg';
import { SITE_TITLE } from '../consts';
import { withBase } from '../utils/url';
import { Font } from 'astro:assets';

interface Props {
	title: string;
	description: string;
	image?: ImageMetadata;
}

const canonicalURL = new URL(Astro.url.pathname, Astro.site);

const { title, description, image = FallbackImage } = Astro.props;

// 静态资源同样要带 base，否则项目站点下会去根路径找 favicon / sitemap。
const rssUrl = new URL(withBase('rss.xml'), Astro.site);
---

<!-- Global Metadata -->
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<link rel="icon" type="image/svg+xml" href={withBase('favicon.svg')} />
<link rel="icon" href={withBase('favicon.ico')} />
<link rel="sitemap" href={withBase('sitemap-index.xml')} />
<link rel="alternate" type="application/rss+xml" title={SITE_TITLE} href={rssUrl} />
<meta name="generator" content={Astro.generator} />

<Font cssVariable="--font-atkinson" preload />

<!-- Canonical URL -->
<link rel="canonical" href={canonicalURL} />

<!-- Primary Meta Tags -->
<title>{title}</title>
<meta name="description" content={description} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content={Astro.url} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(image.src, Astro.url)} />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />

```

