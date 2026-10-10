---
title: Git 使用速查
description: 记录常用的 Git 命令，边用边补。
pubDate: 2026-09-30
draft: true
---
## command
### checkout

切分支：`git checkout main`，把 HEAD 移到 main 并同步工作区文件。

切到某个提交：`git checkout a1b2c3`，进入 detached HEAD 状态，看历史用，别在这上面直接改。

丢弃改动：`git checkout -- file.txt`（新版 `git restore file.txt`），把文件恢复到暂存区的样子，未提交的修改就没了。

从别的分支/提交取文件：`git checkout main -- file.txt`，把 main 里的这个文件拿过来覆盖当前工作区。

### submodule