## Assistant behavior (default prompt)

你是一个精准、克制的助手。
规则：

- 先给结论，再说理由。不要铺垫。
- 能一句话说清就不写第二句。
- 除非用户要求，否则：不用 emoji；不用标题；不主动举例；不重复用户的问题。
- 不确定就直说"不确定"，不要编。
- 用户要"详细"再展开；否则默认简短。
- 没让你动手就不要动文件。用户问"能不能 / 怎么写 / 为什么"时，只回答、只给步骤，不要顺手改代码或新建文件；只有明确说了"帮我改 / 加上 / 删掉 / 写进去"才动手。意图有歧义就先问一句再动。
- 教学类请求（用户说"教我 / 带我 / 一步步 / 我是第一次接触"）时，把内容拆成连续的小步骤，**一次只讲一步**，等用户反馈"做完了"或"卡住了"再讲下一步；不要一次抛完整方案。每个术语第一次出现要用一句话解释，不假设他知道。每步都要说清三件事：改哪个文件的哪一行、具体写什么、做完应该在屏幕上看到什么变化。

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project conventions

### Never hardcode root-relative URLs

This site is deployed to GitHub Pages. For a *project* site the whole site lives
under a sub-path (`base = "/<repo-name>"`), so a hardcoded `href="/about"` or
`src="/favicon.svg"` will 404 in production even though it works in `npm run dev`.

Always build internal URLs with the helpers in `src/utils/url.ts`:

```astro
import { basePath, withBase } from '../utils/url';

<a href={withBase('blog/my-post/')}>…</a>   <!-- → /<base>/blog/my-post/ -->
<a href={basePath}>…</a>                    <!-- → /<base>/ -->
```

`import.meta.env.BASE_URL` is **not** guaranteed to end with a slash, so never
concatenate it directly (`${import.meta.env.BASE_URL}favicon.svg` breaks).

`site` and `base` are derived automatically from `GITHUB_REPOSITORY` in
`astro.config.mjs`; override with the `SITE_URL` / `BASE_PATH` env vars.

### Verifying a change

Always build once with a sub-path base before committing — this is what catches
base-path regressions that the dev server hides:

```bash
SITE_URL=https://example.github.io BASE_PATH=/blog npm run build
grep -o 'href="/[^"]*"' dist/index.html | sort -u
```

### Writing posts

Posts live in `src/content/blog/<slug>.md`; the filename becomes the URL slug.
Required frontmatter: `title`, `description`, `pubDate`. See `src/content.config.ts`.

Drafts: `draft: true` keeps a post out of the build output, the blog list, and RSS,
while still rendering in `astro dev` (`import.meta.env.DEV` guards in
`src/pages/blog/[...slug].astro`, `src/pages/blog/index.astro`, `src/pages/rss.xml.js`).
Draft frontmatter must still be complete — files with no frontmatter at all still fail
the build, so keep unfinished notes outside `src/content/blog/`.

### Windows / filesystem constraints

This repo lives on a Windows drive (`/mnt/d`, a 9p mount) and is also used through
Windows git (PowerShell / Git Bash). Four rules follow from that:

- **Never create symlinks in the repo.** Symlinks on the 9p mount are half-broken;
  Windows git fails to read them with `error: open("x"): Function not implemented`,
  which aborts `git add` entirely. To share content between files, use a real file
  plus an `@path` import — that is why `CLAUDE.md` contains `@AGENTS.md` instead of
  being a symlink. Check with `find . -type l -not -path "./node_modules/*"`.
- **Keep line endings LF.** `.gitattributes` pins `* text=auto eol=lf`; do not
  remove it. If a whole-file diff ever appears, run `git add --renormalize .`.
  Never write CRLF into a text file.
- **Run npm on the Windows side only.** `node_modules/` is one directory shared by
  both environments, but native binaries are platform-specific (rolldown, sharp).
  Installing from WSL writes linux-x64 binaries and breaks the Windows side, and
  the reverse is also true — the build then dies with
  `Cannot find native binding ... @rolldown/binding-<platform>`. So `npm install`,
  `npm run dev` and `npm run build` belong to Windows. The WSL side does file edits,
  git and text search only, which means it **cannot verify a build**: after changing
  styles or components, ask the human to run the build/dev server and report back.
- **Component `<style>` blocks are the fragile kind of CSS in dev — not WSL edits.**
  This was once blamed on the WSL/Windows file watcher. That was wrong: measuring it
  showed a `global.css` edit reaching the dev server within seconds. The real
  mechanism is that in dev Astro emits a component's `<style>` **twice** — once as a
  `<style>` tag in the SSR'd HTML, and once as a Vite JS module
  (`/src/components/X.astro?astro&type=style&index=0&lang.css`). The browser caches
  that module and re-runs the *old* copy, which overwrites the fresh SSR CSS. Hence the
  misleading split: **new markup appears while the old CSS keeps being applied**, and
  `<style>` edits look like they did nothing.

  When a human reports "my change had no effect": first confirm the server is actually
  serving the new rule, by fetching it directly (`curl -s localhost:4321/` works from
  WSL on this machine, and the dev server's HTML contains the CSS). If the new rule is
  there, the browser is the problem — have them clear site data (DevTools →
  Application → Storage → Clear site data), which is stronger than Ctrl+Shift+R.

  The durable fix is to keep these styles out of component `<style>` blocks entirely:
  put them in `global.css` (that is why `Footer.astro` has none) or in a plain
  imported stylesheet. Component scoping via `data-astro-cid` is not worth this
  failure mode for site-wide chrome.

Note that `git status` can report a clean tree even when a file is unreadable,
because it short-circuits on cached stat data. Run `git add -A` (or a build)
before trusting that a checkout is healthy.

## 待办：首页合并与文章页页头（已定方向，尚未动手）

### 首页与「关于」合并成一个个人页

把 `src/pages/about.astro` 的内容并进首页顶部做成 hero 区，去掉首页的导航栏，
「笔记」的入口放进这个页面里。

注意：文章详情页**仍然需要**一个页头。它是被搜索引擎和 RSS 直接打开的，
没有页头读者既不知道这是哪个站，也没有路回首页，只能按浏览器后退。

`/about/` 和 `/blog/` 两个路由是否保留还没定。视觉上的待办记在
`DESIGN-NOTES.md`，那份不是这件事。

### 文章页页头用 favicon / 头像作为回首页的入口

文章页的页头放一个站点 favicon 或头像，点击即返回首页。这样页头可以保持极简，
不必再摆「首页 / 笔记 / 关于」那一排链接。
