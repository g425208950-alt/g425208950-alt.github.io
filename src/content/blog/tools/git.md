---
title: Git 使用速查
description: 记录常用的 Git 命令，边用边补。
pubDate: 2026-09-30
draft: true
---
## .git
### refs

## command
`refs/heads/` 是本地分支，一个文件就是一个分支。存在即分支存在，`git branch -d` 就是删这个文件。
`refs/tags/` 是标签。注意标签文件里可能直接存 tag 对象的哈希，一层套一层，所以要 `git show-ref --dereference` 剥开看真正的 commit。
### push
HTTPS和SSH都同时支持clone和push，github在2021年弃用账号和密码后，https改用PAT(Personal Access Token)当密码。
### fetch
### pull
### reset
### branch
### switch

### checkout

切分支：`git checkout main`，把 HEAD 移到 main 并同步工作区文件。

切到某个提交：`git checkout a1b2c3`，进入 detached HEAD 状态，看历史用，别在这上面直接改。

丢弃改动：`git checkout -- file.txt`（新版 `git restore file.txt`），把文件恢复到暂存区的样子，未提交的修改就没了。

从别的分支/提交取文件：`git checkout main -- file.txt`，把 main 里的这个文件拿过来覆盖当前工作区。

### submodule
#### 基础介绍
submodule 是一个仓库中嵌套另一个仓库时需要的指令
外层仓库中有许多子目录，一些子目录中有`.git`,那这些子目录就是子仓库，外层仓库根目录中会有一个`gitmodules`文件，用来记录子模块的`name、path、URL`，
#### 指令
普通clone仓库时，内层的子仓库默认是空的，所以得这样clone:
`git clone --recurse-submodules 外层仓库地址`
或者先普通clone再`git submodule update --init --recursive`
update 是submodule 的子命令，--init是

`git submodule status` 可以查看子模块状态，如果前面有 '-' 说明目录是空的，源码不在磁盘上。


#### 实际使用
这是在一个git仓库里加上一个submodule子仓库的代码。
```bash
git submodule add https://github.com/flazz/vim-colorschemes.git
```

这个是源代码本身包含子仓库时clone子仓库的代码。

```bash
git submodule update --init --recursive
```

`update`：按照父仓库记录的那个 commit，去把子模块的代码检出到正确版本。不是子模块的最新版，是在
### remote
`git remote -v` (verbose)列出所有远程和它们的地址，
`git remote`只列远程的名字，一行一个
`git remote add origin <url>` 添加一个叫 origin 的远程，`git remote remove origin` 删掉，`git remote set-url origin <新地址>` 改地址。

### ls-remote

可以看远端版本
```powershell
PS D:\Personal Projects\Coding\ActicityWatch-src\activitywatch> git ls-remote
From https://github.com/g425208950-alt/activitywatch.git
33f667d9069bd5c02506716fd84b0e9454a6997a        HEAD 
33f667d9069bd5c02506716fd84b0e9454a6997a        refs/heads/master
```
HEAD是远程仓库的默认分支指针;refs用来存放所有引用，heads放分支。
>`tags/` 放标签，`remotes/` 放远程跟踪引用，还有 `notes/`、`stash/` 等。
### git ls-files --stage
可以看到子仓库，索引为160000的条目就是gitlink。
`100644`的前三位`100`是git的类型前缀，表示普通文件，644表示'rw-r--r--'
`120000`是符号链接，160000是gitlink，子模块，040000表示目录(tree对象)，这个一般不出现在ls-files里。但是这些权限在windows里不生效。
### status

#### -sb
`-s`是short，`-b`是branch，
### clone
`git clone [url]`

### config
#### 代理
`git config --global --get http.proxy`
`git config --global --get https.proxy`
`git config --global --unset http.proxy`
`git config --global --unset https.proxy`

#### 文件模式
`git config core.fileMode false` 在Windows上应该设置为false，因为windows的文件系统ACL和Unix权限不同
### branch
#### -r
#### -vv
### fetch