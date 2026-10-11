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
#### 基础介绍
submodule 是"一个 git 仓库里嵌了另一个 git 仓库"的机制，外层仓库只记录"你该从哪个地址、拿哪个版本"，不记录里面的文件内容。
外层仓库里有个子目录，进这个子目录会发现它自己是个完整 git 仓库（有 `.git`）。外层仓库根目录有个 `.gitmodules` 文件，记着子模块的地址和路径；还有个特殊的"gitlink"条目，记着子模块该停在哪个 commit。
普通clone仓库时，内层的子仓库默认是空的，所以得这样clone:
`git clone --recurse-submodules 外层仓库地址`
或者先普通clone再`git submodule update --init --recursive`

#### 实际使用
`git submodule add https://github.com/flazz/vim-colorschemes.git ~/.vim/bundle/colorschemes`
这里就是在一个git仓库里加上一个submodule子仓库的实际代码。