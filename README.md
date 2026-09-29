# 我的博客

用 Markdown 写文章，`git push` 之后由 GitHub Actions 自动构建，发布到 GitHub Pages。
技术栈：[Astro](https://astro.build/) + [Content Collections](https://docs.astro.build/zh-cn/guides/content-collections/)。

---

## 一、本地开发

需要 Node.js **22.12 或更高**（`node -v` 看一眼）。

```bash
npm install      # 只需第一次
npm run dev      # 启动本地预览，默认 http://localhost:4321
```

`npm run dev` 会监听文件变化，保存 Markdown 后浏览器自动刷新。

其他命令：

```bash
npm run build     # 构建到 dist/，顺便检查有没有写错的地方
npm run preview   # 本地预览构建结果（和线上更接近）
```

> 建议：正式推送前先跑一次 `npm run build`。frontmatter 字段写错、图片路径不对
> 之类的问题都会在这里直接报错，比等 Actions 跑完再发现快得多。

---

## 二、写一篇新文章

在 `src/content/blog/` 下新建一个 `.md` 文件即可，**文件名就是网址里的 slug**：

```
src/content/blog/my-first-trip.md   →   /blog/my-first-trip/
```

文件开头必须有 frontmatter：

```markdown
---
title: 文章标题
description: 一句话摘要，会显示在列表页和搜索引擎结果里
pubDate: 2024-03-01
---

正文从这里开始，正常写 Markdown 就好。
```

可选字段：

| 字段          | 说明                                                 |
| ------------- | ---------------------------------------------------- |
| `updatedDate` | 更新日期，写了会在标题下方多显示一行「最后更新于 …」 |
| `heroImage`   | 封面图，路径相对当前文件，如 `../../assets/cover.jpg` |

字段规则定义在 `src/content.config.ts`，想加标签（tags）之类的字段改那里。

**插入图片**：把图片放进 `src/assets/`，然后在正文里引用：

```markdown
![图片说明](../../assets/图片名.jpg)
```

Astro 会自动压缩、转成合适尺寸的 `webp`，不用你自己处理。

**草稿**：把文件挪到 `src/content/` 以外的目录，或者先不 push，就不会被发布。

---

## 三、部署到 GitHub Pages

### 步骤 1：在 GitHub 上创建仓库

先想好仓库叫什么，因为**仓库名直接决定你的网址**：

| 仓库名                   | 网址                                   | 说明                 |
| ------------------------ | -------------------------------------- | -------------------- |
| `<你的用户名>.github.io` | `https://<你的用户名>.github.io/`      | 用户站点，网址最干净 |
| 其他任意名字，如 `blog`  | `https://<你的用户名>.github.io/blog/` | 项目站点，网址多一层 |

两种都行，本项目都已经配置好，**你不需要改任何代码**。

> 小建议：如果你打算把博客当主页，选第一种。如果选第二种并且仓库名叫 `blog`，
> 文章地址会是 `https://<用户名>.github.io/blog/blog/文章名/` —— 两个 `blog`，
> 能用但有点丑，可以把仓库改叫 `my-blog` 之类。

打开 <https://github.com/new>：

1. **Repository name** 填上表里的名字
2. 选 **Public**（私有仓库用 Pages 需要付费账号）
3. **不要**勾选 "Add a README file"、".gitignore"、license —— 本地已经有了
4. 点 **Create repository**

### 步骤 2：把本地代码推上去

在本项目目录下执行（把 `<你的用户名>` 和 `<仓库名>` 换成实际值）：

```bash
git init
git add -A
git commit -m "chore: 初始化博客"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

推送时会要求登录。GitHub 早就不能用账号密码了，**密码那一栏要填 Personal Access Token**：

- 生成地址：<https://github.com/settings/tokens> → *Generate new token (classic)*
- 勾选 **`repo`** 权限即可
- 生成的 token 只显示一次，复制下来当密码用

（或者配置 SSH key，用 `git@github.com:<用户名>/<仓库名>.git` 作为 remote，就不用每次输 token。）

### 步骤 3：开启 GitHub Pages

**这一步最容易漏，漏了就一直是 404。**

进入仓库页面 → **Settings** → 左侧 **Pages** → 找到 **Build and deployment**：

- **Source** 选择 **`GitHub Actions`**（不是 "Deploy from a branch"）

### 步骤 4：等待自动部署

推上去之后会自动触发。到仓库的 **Actions** 标签页可以看到进度：

1. `build` —— 安装依赖、构建、上传产物（第一次大约 1~2 分钟）
2. `deploy` —— 发布到 Pages

两个都变成绿色对勾就成功了。点开 `deploy` 这一步，里面会显示网站地址。

### 之后每次更新

```bash
git add -A
git commit -m "post: 新增一篇文章"
git push
```

推送完等一两分钟，刷新网页即可。也可以在 Actions 页面手动点 **Run workflow** 触发。

---

## 四、自定义

| 想改什么                           | 改哪里                        |
| ---------------------------------- | ----------------------------- |
| 站点标题、描述、作者、GitHub / 邮箱 | `src/consts.ts`               |
| 首页文案                           | `src/pages/index.astro`       |
| 「关于」页面                       | `src/pages/about.astro`       |
| 顶部导航栏                         | `src/components/Header.astro` |
| 页脚                               | `src/components/Footer.astro` |
| 文章页排版（标题、日期、正文宽度） | `src/layouts/BlogPost.astro`  |
| 全局配色、字体、行距               | `src/styles/global.css`       |
| 站点地址 / base 路径               | `astro.config.mjs`            |

改完记得 `git push`。

### 关于 `astro.config.mjs` 里的 site / base

你不用手动填。`astro.config.mjs` 会自动读取 GitHub Actions 注入的
`GITHUB_REPOSITORY` 环境变量（形如 `用户名/仓库名`），据此推算出 `site` 和 `base`：

- 仓库名以 `.github.io` 结尾 → `base = '/'`，`site = https://用户名.github.io`
- 否则 → `base = '/仓库名'`，`site = https://用户名.github.io`

以后如果绑定了自己的域名（比如 `blog.example.com`），把它写进仓库的
**Settings → Secrets and variables → Actions → Variables**：

- `SITE_URL` = `https://blog.example.com`
- `BASE_PATH` = `/`

本地想模拟带 base 的构建，可以（按你用的终端选一种）：

```powershell
# PowerShell
$env:SITE_URL="https://example.github.io"; $env:BASE_PATH="/blog"; npm run build
```

```bat
:: CMD
set SITE_URL=https://example.github.io && set BASE_PATH=/blog && npm run build
```

```bash
# Git Bash / WSL
SITE_URL=https://example.github.io BASE_PATH=/blog npm run build
```

> 注意：`变量=值 命令` 这种写法只有 bash 支持。在 PowerShell 里必须写成
> `$env:变量="值"`，在 CMD 里必须写成 `set 变量=值`，否则会报
> "无法将 xxx 识别为 cmdlet"。

---

## 五、Windows 用户注意事项

这个仓库同时在 Windows 和 WSL/Linux 下使用，已经做了两处针对性配置：

**1. 换行符统一为 LF**（`.gitattributes`）

Git for Windows 安装时经常把 `core.autocrlf` 设成 `true`，会在检出时把 LF 转成
CRLF、提交时再转回来。如果两边处理不一致，就会出现"整个文件都显示被修改、
其实只差一个 `\r`"的假 diff。

本项目用 `.gitattributes` 里的 `* text=auto eol=lf` 钉死了这个行为 —— 它的
优先级高于任何人本地的 `core.autocrlf`，所以不管谁在什么系统上克隆，换行符
都是确定的。**不要删掉这个文件。**

如果哪天你还是看到了莫名其妙的全文件 diff，跑一次：

```bash
git add --renormalize .
```

**2. 仓库里不能出现符号链接**

符号链接在 Windows 的 `D:` 盘上（WSL 通过 9p 协议访问）是半残状态，Windows 侧
的 git 读取时会直接报错：

```
error: open("xxx"): Function not implemented
fatal: updating files failed
```

原来模板里的 `CLAUDE.md` 就是这种符号链接，已经改成用 `@AGENTS.md` 导入的普通
文件。**以后不要用 `ln -s` 在仓库里建链接**；如果确实需要让多个文件共享内容，
用「一个真文件 + 另一个文件里写 `@路径` 导入」的方式。

---

## 六、常见问题

**`git add` 报错 `Function not implemented`**

仓库里出现了符号链接，见上一节第 2 点。用 `find . -type l` 或
`git ls-files -s | findstr 120000` 找出来，改成普通文件。

**Actions 报错 `Get Pages site failed` / `Not found`**
Settings → Pages → Source 没选成 `GitHub Actions`，回步骤 3。

**部署成功但页面是 404**
等 1~2 分钟，Pages 首次发布有缓存。还不行就确认仓库是 Public。

**页面能打开但样式全丢、链接全 404**
说明 `base` 不对。检查仓库名是否和 `astro.config.mjs` 推算出来的一致。
如果仓库改过名，需要重新 push 触发一次构建。

**构建失败，提示 frontmatter 校验错误**
看 Actions 日志里报的字段名，对照上面「写一篇新文章」的表格改。
`pubDate` 最容易写错，必须是 `YYYY-MM-DD` 格式。

**本地新增的文章线上没出现**
确认文件在 `src/content/blog/` 下、后缀是 `.md`，并且已经 `git push`。
`npm run build` 能帮你提前发现大部分问题。

---

## 七、目录结构

```
├── .github/workflows/deploy.yml   # 自动部署配置
├── .gitattributes                 # 换行符策略（LF），不要删
├── public/                        # 原样拷贝的静态文件（favicon 等）
├── src/
│   ├── assets/                    # 图片、字体（会被 Astro 优化）
│   ├── components/                # 页头、页脚等组件
│   ├── content/blog/              # ★ 你的文章都放这里
│   ├── content.config.ts          # ★ 文章 frontmatter 的字段规则
│   ├── layouts/BlogPost.astro     # 文章页排版
│   ├── pages/                     # 路由：每个文件对应一个网址
│   ├── styles/global.css          # 全局样式
│   ├── utils/url.ts               # base 路径工具（写链接用 withBase）
│   └── consts.ts                  # ★ 站点信息
└── astro.config.mjs               # 站点配置（site / base 自动推导）
```

打 ★ 的是日常最常改的。
