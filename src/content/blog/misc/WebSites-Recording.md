---
title: 记录一些网站
pubDate: 2026-10-12
draft: true
description: 单纯记录一些网站，闲的时候可以看看
---

**1. rauno.me — 开发者站 — [https://rauno.me](https://rauno.me/)** 页面底是纯 `#000`，但所有面与文字来自一条 12 级灰阶：`--colors-gray1: hsl(0 0% 8.5%)` → `gray3 13.6%` → `gray6 20.5%` → `gray12 hsl(0 0% 93%)`。surface 从 8.5% 起跳，正文最高级也只到 93%，没有 #fff。

**2. emilkowal.ski — 开发者站 — [https://emilkowal.ski](https://emilkowal.ski/)** 深色下描边一律做成内阴影环 `--ds-inset-border: inset 0 0 0 1px hsla(0,0%,100%,.07)`，卡片的“阴影”token 是 `0 0 0 1px hsla(0,0%,100%,.08)`：用 7–8% 白描边替换黑色投影。

**3. blog.maximeheckel.com — 个人博客 — [https://blog.maximeheckel.com](https://blog.maximeheckel.com/)** 中性灰用 oklch + 单个 `--base-hue` 变量生成（深色底 `--gray-000: oklch(12.92% …)`），层级全走语义 token：`--background: var(--gray-100)`、`--card-background`/`--code-snippet-background: var(--gray-200)`、`--border-color: var(--gray-400)`。

**4. leerob.com — 开发者站 — [https://leerob.com](https://leerob.com/)** 深色刻意偏暖而非中性灰：`--background:#0f0d0b`、`--bg:#1b1a19`、`--code-background:#242321`、`--border:#ffffff1a`，行内代码暖红 `#e06c5f`；分隔线用 `color-mix(in srgb, currentColor 18%, transparent)`，跟着文字色走。

**5. joshwcomeau.com — 个人博客/教学站 — [https://www.joshwcomeau.com](https://www.joshwcomeau.com/)** 代码块比页面亮一档：`--color-background:#0d0f12` → `--color-code-bg:#1a1f23`；吸顶导航底是 `rgba(13,15,18,.75)`（页面底色 75% alpha）+ backdrop 模糊，滚动时不出现异色块。

**6. antfu.me — 个人博客 — [https://antfu.me**（跟随系统，以下为深色值）](https://antfu.xn--me%2A%2A\(,\)-mq8q9sy8ec2htu8l4o7b6dh4ksh27coeyb/) 底色 `#050505` 而不是 #000；文字固定三级 `--fg:#bbb` / `--fg-deep:#ddd` / `--fg-deeper:#fff`；shiki 代码块 `#0e0e0e`，与页面只差一档。

**7. zed.dev — 产品站/开发者站 — [https://zed.dev](https://zed.dev/)** 整套配色靠 `html.light` / `html.dark` 两个类切换（`html.dark{--nav-bg-color:#121417 …}`），正文底 `hsl(218,13%,7.5%)`——暗色里保留冷蓝色相，不是纯灰。

**8. ghostty.org — 文档站（终端软件）— [https://ghostty.org/docs](https://ghostty.org/docs)** 6 级灰阶 `--gray-0:#0f0f11` → `--gray-6:#c3c3c4`；正文 `--gray-5:#959597`、强调才用 gray-6；行内代码 = 1px `--gray-3:#4c4c50` 边框 + `--gray-2:#242428` 底；`pre code` 底 `--gray-1:#16161a`，只比页面亮一档。（首页是客户端渲染，web_fetch 只回标题，故用 /docs 验证。）

**9. ziglang.org — 文档站 — [https://ziglang.org](https://ziglang.org/)** 深色正文 `#bbb`（不是纯白）、链接柔和 `#88f`、页面 `#111`、代码块 `#1e1e1e` 且代码文字 `#ccc`、引用块 `border-left .25em solid #666` + 文字 `#949494`；语法色是 One Dark 那套 `--blue:#61afef --magenta:#c678dd --light-yellow:#e5c07b --comment-gray:#5c6370`，与你首页现用三色同源。

**10. ui.shadcn.com — 文档站 — [https://ui.shadcn.com](https://ui.shadcn.com/)** 深色 token 只有“纯色底 + 10% 白描边”：`--background:#0a0a0a`、`--border:#ffffff1a`；代码块单独一个 `--color-code` 面 + 大圆角，全站没有一处阴影。

**11. bun.sh — 文档站 — [https://bun.sh](https://bun.sh/)** 颜色存成 RGB 三元组：`--c-canvas: 13 10 12`、`--c-code-bg: 14 14 14`、`--c-line: 40 40 43`、`--c-fg: 234 234 232`、`--c-fg-muted: 168 168 165`、`--c-fg-faint: 128 128 126`。好处是随处可 `rgb(var(--c-fg) / .6)`；画布偏暖、代码块中性，同亮度换色相也能分层。

**12. raycast.com — 产品站 — [https://www.raycast.com](https://www.raycast.com/)** 四级灰面 `#101111 / #18191a / #313133 / #494b4d`，四级文字 `#f4f4f6 / #c2c7ca / #78787c`；行内代码底是 `rgba(255,255,255,.06)` 而非固定灰，所以叠在任何一层面上都成立；边框 `#242728`。

**13. linear.app — 产品站 — [https://linear.app](https://linear.app/)** 页面色 `#08090a`（比 #000 抬一点）；`--token-text:#E2E4E7`、`--token-comment:#8B93A1`（注释色兼作次级文字色）；状态色不用实心，用低 alpha：`rgba(39,166,68,.07)` / `rgba(243,78,82,.1)`。

**14. vercel.com — 产品站 — [https://vercel.com**（Geist](https://vercel.com%2A%2A\(geist/) 深色值） `--ds-background-100: hsla(0,0%,4%)`（#0a0a0a）、`--ds-background-200: hsla(0,0%,0%)`，两个近黑构成层级；发丝线是 `box-shadow: 0 1px 0 0 var(--ds-gray-alpha-400)`，该 token 深色下 `#ffffff24`——不占布局的 1px 线。

**15. astro.build — 产品/框架站 — [https://astro.build](https://astro.build/)** 深色是唯一定制色板（`astro-dark-900/800` 底、`astro-dark-100/20` 描边）；面板与输入框底 `rgb(35 38 45)`、边框 `rgb(52 56 65)`、行内代码固定冷灰 `rgb(52 56 65)`：亮一档但色相不动。

**打不开/未验证，不计入上表** [https://hono.dev](https://hono.dev/) — curl 200 且能抓到暗色 token（`--docsearch-modal-background:#15172a`），但 web_fetch 报 fetch failed。[https://orm.drizzle.team](https://orm.drizzle.team/) — web_fetch 30s 超时。[https://effect.website](https://effect.website/) — 连接失败（curl 000）。[https://gleam.run、https://www.roc-lang.org](https://gleam.xn--runhttps-hm3g//www.roc-lang.org) — curl 返回 0 字节，未验证。另：shud.in、thesephist.com 抓下来是浅底（`#fcfcfc` / `#fff`），已排除。