---
title： my to-do list
description: 想要做或者想问的事物
pubDate: 2026/9/30
draft: true
---





>装 Node（package.json 要求 ≥ 22.12，建议直接 24，和 CI 一致）。先查：node -v、npm -v。没有就用 winget install OpenJS.NodeJS.LTS 或官网安装包，装完重开终端才会进 PATH。
>进项目根目录：cd "D:\Personal Projects\Coding\blog"，先 Get-Location 确认没跑错地方。
>停掉正在跑的 dev server，关掉可能占用 node_modules 的编辑器窗口。
>删掉旧依赖：Remove-Item -Recurse -Force .\node_modules
>重装：npm ci（按 package-lock.json 精确还原，比 npm install 更适合这个场景）。
>自证装成了 Windows 版：dir node_modules\@img 里应该出现 sharp-win32-x64，而不是只有 sharp-linux-x64；再跑 npx astro --version 能打印版本。
>构建：npm run build，产物在 dist\。看效果用 npm run preview。
>两个坑：如果第 7 步报 Cannot find module '@rolldown/binding-win32-x64-msvc' 或 sharp 相关错误，说明第 4 步没删干净，重开终端再删一次（通常是编辑器或杀软锁着文件）。另外以后回到 WSL，要再 npm ci 一遍，反之亦然。想在 Windows 上验证子路径 base，PowerShell 的写法是 $env:SITE_URL="https://example.github.io"; $env:BASE_PATH="/blog"; npm run build——变量=值 命令 那种语法只有 bash 支持。

> winget install OpenJS.NodeJS.LTS

答:因为winget用的是包标识符（package identifier）OpenJS 是 OpenJS Foundation（Node.js 所属基金会），NodeJS 指 Node.js，LTS 是 Long Term Support