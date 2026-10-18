---
title: Git 使用速查
description: 记录常用的 Git 命令，边用边补。
pubDate: 2026-09-30
draft: true
---
## .git
.git里有refs文件，这个文件是用来通过“指针”（姑且这么叫）记录本地版本和远端版本的，本地版本的指针放在.git/heads目录里，远端版本的“指针放在.git/remotes目录里
refs用来存放所有引用，heads放分支。
`tags/` 放标签，`remotes/` 放远程跟踪引用，还有 `notes/`、`stash/` 等。
### refs

## command
`refs/heads/` 是本地分支，一个文件就是一个分支。存在即分支存在，`git branch -d` 就是删这个文件。
`refs/tags/` 是标签。注意标签文件里可能直接存 tag 对象的哈希，一层套一层，所以要 `git show-ref --dereference` 剥开看真正的 commit。
### add
| 命令                          | 作用                                         |
| --------------------------- | ------------------------------------------ |
| `git add <file>`            | 暂存指定文件                                     |
| `git add <dir>/`            | 暂存目录下所有变化                                  |
| `git add .`                 | 暂存当前目录及其子目录的变化，包括删除                        |
| `git add -A`                | 暂存整个仓库的变化，无论当前在哪个子目录（`--all`）              |
| `git add -u`                | 只处理已跟踪文件的修改和删除，不含新文件（`--update`）           |
| `git add -p`                | 逐个片段确认，只暂存想要的部分（`--patch`）                 |
| `git add -i`                | 交互式菜单，按文件或片段挑选                             |
| `git add -e`                | 手动编辑补丁内容再入暂存区                              |
| `git add -n`                | 演练，只列出会加什么（`--dry-run`）                    |
| `git add -f <file>`         | 强制加入被 `.gitignore` 忽略的文件                   |
| `git add -N <file>`         | 只登记意图（intent-to-add），让 `git diff` 能显示未跟踪文件 |
| `git add --chmod=+x <file>` | 改文件权限位为可执行一并暂存                             |
### diff
| 指令                                    | 作用                             |
| ------------------------------------- | ------------------------------ |
| `git diff`                            | 工作区相对暂存区的改动                    |
| `git diff --staged`（= `--cached`）     | 暂存区相对 HEAD 的改动，即“下次提交会提交什么”    |
| `git diff HEAD`                       | 工作区 + 暂存区相对 HEAD 的全部改动         |
| `git diff <commit>`                   | 工作区相对指定提交                      |
| `git diff <a> <b>`                    | 两个提交（或分支、标签）之间的差异              |
| `git diff <a>..<b>`                   | 同上，比较 a 和 b 两个端点               |
| `git diff <a>...<b>`                  | 从 a、b 的共同祖先到 b 的差异，即 b 分支引入的改动 |
| `git diff -- <path>`                  | 把比较范围限定到文件或目录                  |
| `git diff --no-index <f1> <f2>`       | 比较两个任意文件，即使它们不在仓库里             |
| `git diff --stat`                     | 只输出改动统计（文件数、增删行数）              |
| `git diff --name-only`                | 只列出改动的文件名                      |
| `git diff --name-status`              | 列出文件名与状态（A/M/D/R）              |
| `git diff --numstat`                  | 与 `--stat` 相同，但输出机器可读的“增、删”数字  |
| `git diff -w`（= `--ignore-all-space`） | 忽略空白差异                         |
| `git diff -U<n>`                      | 设置上下文行数，默认 3                   |
| `git diff --word-diff`                | 按词级别显示差异，适合长行                  |
| `git diff --check`                    | 检查行尾空白、冲突标记等                   |
| `git diff -M`                         | 检测重命名（R）而非删除+新增                |
| `git diff --diff-filter=<字母>`         | 只看某类改动，如 `--diff-filter=AM`    |
| `git diff --submodule=log`            | 子模块以提交日志形式展示                   |
| `git diff -R`                         | 反向输出（旧变新变成新变旧）                 |
| `git diff --binary`                   | 输出二进制补丁，可配合 `git apply`        |
| `git diff > x.patch`                  | 导出为补丁文件                        |
### push
HTTPS和SSH都同时支持clone和push，github在2021年弃用账号和密码后，https改用PAT(Personal Access Token)当密码。

| 命令                                     | 作用                                     |
| -------------------------------------- | -------------------------------------- |
| `git push -u origin main`              | 首次推送并设置上游                              |
| `git push`                             | 推当前分支到已设好的上游                           |
| `git push origin <branch>`             | 推指定分支，`origin <本地>:<远端>` 可改远端名         |
| `git push origin HEAD:refs/heads/main` | 把当前提交推到远端 main，不受本地分支名影响               |
| `git push origin --delete <branch>`    | 删远端分支（也可写 `git push origin :<branch>`） |
| `git push --all`                       | 推所有本地分支                                |
| `git push --tags`                      | 推所有标签                                  |
| `git push --dry-run`                   | 演练，不实际推送                               |
| `git push --force-with-lease`          | 安全强推，远端被别人改过就拒绝                        |
| `git push -f`                          | 强推，会覆盖远端，慎用                            |
|                                        |                                        |
push的`type`可以是one of `feat, fix, chore, ci, docs, style, refactor, perf, test` (来自开源项目Activity Watch)
### pull
| 命令                     | 作用                    |
| ---------------------- | --------------------- |
| `git pull`             | fetch 加 merge         |
| `git pull --rebase`    | fetch 加 rebase，历史保持直线 |
| `git pull --ff-only`   | 只允许快进，否则报错            |
| `git pull --no-rebase` | 明确用 merge             |
| `git pull origin main` | 指定远程和分支，未设上游时用        |
| `git pull --autostash` | 自动 stash 再恢复，工作区脏也能拉  |
### reset

| 命令                             | 作用                          |
| ------------------------------ | --------------------------- |
| `git reset <file>`             | 把文件移出暂存区，改动留在工作区（`--mixed`） |
| `git reset --soft HEAD~1`      | 撤销最后一次提交，改动进暂存区             |
| `git reset --mixed HEAD~1`     | 撤销提交，改动留在工作区（默认行为）          |
| `git reset --hard HEAD~1`      | 提交和工作区改动全丢                  |
| `git reset --hard origin/main` | 本地强制对齐远端，丢弃一切差异             |
| `git reset --keep HEAD~1`      | 撤销提交但保留工作区未提交改动，有冲突就拒绝      |
| `git reset --merge`            | 撤销合并、保留未提交改动                |
### checkout

切分支：`git checkout main`，把 HEAD 移到 main 并同步工作区文件。

切到某个提交：`git checkout a1b2c3`，进入 detached HEAD 状态，看历史用，别在这上面直接改。

丢弃改动：`git checkout -- file.txt`（新版 `git restore file.txt`），把文件恢复到暂存区的样子，未提交的修改就没了。

从别的分支/提交取文件：`git checkout main -- file.txt`，把 main 里的这个文件拿过来覆盖当前工作区。

| 命令                                    | 作用                               |
| ------------------------------------- | -------------------------------- |
| `git checkout main`                   | 切分支（等价 `git switch main`）        |
| `git checkout -b <name>`              | 新建并切换（等价 `git switch -c`）        |
| `git checkout -B <name> <起点>`         | 已存在则重置后切换                        |
| `git checkout -`                      | 切回上一个分支                          |
| `git checkout -- <file>`              | 丢弃工作区改动（等价 `git restore <file>`） |
| `git checkout HEAD -- <file>`         | 把文件恢复到最近一次提交的版本                  |
| `git checkout <commit> -- <file>`     | 从指定提交取文件覆盖工作区                    |
| `git checkout <commit>`               | 游离 HEAD 查看旧版本                    |
| `git checkout --track origin/main`    | 建跟踪分支                            |
| `git checkout --ours/--theirs <file>` | 冲突时取自己或对方那版                      |
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

| 命令                                | 作用                              |
| --------------------------------- | ------------------------------- |
| `git remote -v`                   | 列出远程和对应地址                       |
| `git remote add <name> <url>`     | 添加远程                            |
| `git remote remove <name>`        | 删除远程及其跟踪分支（`rm`）                |
| `git remote rename <old> <new>`   | 重命名远程                           |
| `git remote set-url <name> <url>` | 改地址，常用 `set-url --push` 单独改推送地址 |
| `git remote show <name>`          | 看地址、默认分支、落后情况                   |
| `git remote prune <name>`         | 清理远端已删除的跟踪分支                    |
| `git remote update`               | 对所有远程做 fetch                    |

### ls-remote

可以看远端版本
```powershell
PS D:\Personal Projects\Coding\ActicityWatch-src\activitywatch> git ls-remote
From https://github.com/g425208950-alt/activitywatch.git
33f667d9069bd5c02506716fd84b0e9454a6997a        HEAD 
33f667d9069bd5c02506716fd84b0e9454a6997a        refs/heads/master
```
HEAD是远程仓库的默认分支指针;
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

| 短              | 长                          | 作用                                   |
| -------------- | -------------------------- | ------------------------------------ |
| 无参数            | —                          | 列本地分支                                |
| `-a`           | `--all`                    | 本地 + 远程跟踪分支都列                        |
| `-r`           | `--remotes`                | 只列远程跟踪分支                             |
| `-l <pattern>` | `--list`                   | 按模式过滤列表                              |
| `-v`           | `--verbose`                | 显示每个分支最后一次提交                         |
| `-vv`          | `--verbose --verbose`      | 再加一列上游分支和领先/落后数                      |
| —              | `--show-current`           | 只打印当前分支名（2.22+）                      |
| —              | `--merged` / `--no-merged` | 只列已合并 / 未合并到当前分支的                    |
| `<name>`       | —                          | 创建分支，不切换                             |
| `-f`           | `--force`                  | 分支已存在时强制把指针移过去                       |
| `-t`           | `--track`                  | 创建时顺带设置上游                            |
| —              | `--no-track`               | 不自动设上游                               |
| `-c` / `-C`    | `--copy`                   | 复制分支，大写 C 表示强制覆盖                     |
| `-m` / `-M`    | `--move`                   | 改名，大写 M 表示强制（目标已存在也覆盖）               |
| `-d` / `-D`    | `--delete`                 | 删除，大写 D 即 `--delete --force`，跳过已合并检查 |
| `-u <up>`      | `--set-upstream-to=<up>`   | 把已有分支的上游指向某分支                        |
| —              | `--unset-upstream`         | 取消上游                                 |
| —              | `--contains <commit>`      | 列出包含该提交的分支                           |
### fetch
|命令|作用|
|---|---|
|`git fetch`|拉取当前远程的更新，不动工作区|
|`git fetch origin`|只拉某个远程|
|`git fetch origin main`|只拉某个分支|
|`git fetch --all`|所有远程都拉|
|`git fetch -p`|顺带清理已删除的远端分支（`--prune`）|
|`git fetch --tags`|连标签一起拉|
|`git fetch origin refs/pull/1/head:pr1`|把任意引用抓到本地某个分支|
### switch
| 命令                                  | 作用                           |
| ----------------------------------- | ---------------------------- |
| `git switch main`                   | 切到已存在的本地分支                   |
| `git switch -c <name>`              | 新建分支并切换                      |
| `git switch -c <name> origin/main`  | 基于远程跟踪分支新建，同时设上游             |
| `git switch -t origin/main`         | 建同名本地分支并跟踪                   |
| `git switch -C <name> <起点>`         | 分支已存在则强制重置到起点再切              |
| `git switch -`                      | 切回上一个分支                      |
| `git switch -d <commit>`            | 游离 HEAD，只看不写（长形式 `--detach`） |
| `git switch --discard-changes <分支>` | 丢弃工作区改动强行切换                  |
### stash
|命令|作用|
|---|---|
|`git stash`|暂存已跟踪文件的改动，工作区清干净（等价 `git stash push`）|
|`git stash push -m "说明"`|带备注，方便日后辨认|
|`git stash push -u`|连未跟踪文件一起收走（长形式 `--include-untracked`）|
|`git stash push -a`|连 `.gitignore` 忽略的文件也收走（`--all`）|
|`git stash push -k`|只收工作区，保留暂存区（`--keep-index`）|
|`git stash push -- <路径>`|只收指定路径的改动|
|`git stash -p`|交互式挑选要收的片段|
|`git stash list`|列出所有 stash，记作 `stash@{0}`、`stash@{1}`|
|`git stash show -p stash@{0}`|看某个 stash 具体改了什么，`--stat` 只看统计|
|`git stash pop`|应用并删除最近一个 stash|
|`git stash apply stash@{1}`|应用但保留，不删除|
|`git stash drop stash@{0}`|删掉指定 stash|
|`git stash clear`|清空全部，不可恢复|
|`git stash branch <name> stash@{0}`|基于 stash 建分支并应用，适合冲突场景|
|`git checkout stash@{0} -- <文件>`|只从 stash 里捞回某个文件|
### rebase
|命令|作用|
|---|---|
|`git rebase origin/main`|把当前分支的提交挪到 origin/main 之后|
|`git rebase <upstream> <branch>`|先切到 branch 再变基|
|`git rebase -i HEAD~3`|交互式整理最近 3 个提交，可 squash、reword、drop|
|`git rebase --continue`|冲突解决并 `git add` 后继续|
|`git rebase --skip`|跳过当前这个提交|
|`git rebase --abort`|整个放弃，恢复变基前状态|
|`git rebase --autostash`|自动暂存未提交改动|
|`git rebase --onto A B C`|把 B..C 这一段的提交嫁接到底座 A 上|
|`git rebase --root`|从第一个提交开始变基|
|`git pull --rebase`|fetch 加 rebase 一步到位|
### merge
| 命令                                               | 作用                                 |
| ------------------------------------------------ | ---------------------------------- |
| `git merge <branch>`                             | 把指定分支合并进当前分支，能快进就快进，否则产生合并提交       |
| `git merge origin/main`                          | 合并远程跟踪分支，等价于从远端拿到更新                |
| `git merge --no-ff <branch>`                     | 一律生成合并提交，保留“这是一个分支合并”的记录           |
| `git merge --ff-only <branch>`                   | 只允许快进，无法快进就失败，最安全                  |
| `git merge --squash <branch>`                    | 把对方所有改动压成一次未提交的改动，进暂存区，由你自己 commit |
| `git merge --no-commit <branch>`                 | 合并但先不停在提交这一步，方便检查再提交               |
| `git merge -m "<msg>" <branch>`                  | 指定合并提交的说明                          |
| `git merge --abort`                              | 冲突或中途放弃，恢复到合并前                     |
| `git merge --continue`                           | 解决冲突并 `git add` 后继续完成合并            |
| `git merge -X ours <branch>`                     | 冲突时自动偏向当前分支（`theirs` 则偏向对方）        |
| `git merge -s ours <branch>`                     | 完全忽略对方内容，只留一个“已合并”记录               |
| `git merge --allow-unrelated-histories <branch>` | 合并两段毫无共同祖先的历史                      |


## 找活干
流程就是 fork、clone、开分支、改、推、发 PR，围绕这六步展开。

1. 先读项目的 CONTRIBUTING.md 和 issue 模板，没写的默认规矩也要看，比如提交信息格式、要不要签 DCO。找活干去看 `good first issue`、`help wanted` 标签，别自己闷头大改。
    
2. 网页上点 Fork，然后 clone 你名下那份：
    

```
git clone https://github.com/<你的用户名>/<repo>.git
cd <repo>
git remote add upstream https://github.com/<原作者>/<repo>.git
git remote -v
```

`upstream` 指向原项目，`origin` 指向你的 fork，这个区分后面一直用得上。

3. 同步默认分支，注意默认分支可能叫 main、master 或 develop：


```
git fetch upstream
git switch main
git merge --ff-only upstream/main
```

4. 从最新的 upstream 开工作分支，不要直接在 main 上改：

```
git switch -c fix-xxx upstream/main
```

5. 改代码、加测试、本地跑通。提交前 `git diff` 自查一遍，别夹带无关的格式改动，一个 PR 只做一件事。
    
6. 推到自己的 fork：
    

```
git push -u origin fix-xxx
```

GitHub 会在页面上给出 “Compare & pull request”，点进去写清楚改了什么、为什么改、怎么验证，关联 issue 用 `Fixes #123`。

7. 等 review。维护者让你改就继续在本地提交再 push 到同一个分支，PR 会自动更新。这个阶段别 force-push，除非对方明确要求；除非项目要求 squash，也别自己 rebase。
    
8. 合了之后清理：本地 `git switch main`、`git pull upstream main`、`git branch -d fix-xxx`、删除 fork 上的远端分支。
    

几个容易踩的点：fork 的 main 不会自动跟上游同步，要定期 `git fetch upstream`；PR 里混入别人提交通常是因为你在旧 main 上开了分支；提交信息写“fix bug”这种等于没写；大改动先开 issue 或 draft PR 问清楚，别写完才被发现方向不对。

## GitHub搜索语法
| 写法                      | 含义                                                 |
| ----------------------- | -------------------------------------------------- |
| `is:issue`              | 只要 issue（排除 PR）                                    |
| `is:pr`                 | 只要 PR                                              |
| `is:open` / `is:closed` | 打开 / 关闭                                            |
| `is:merged`             | 已合并的 PR                                            |
| `label:"help wanted"`   | 带指定标签（**有空格必须加引号**）                                |
| `no:label`              | 没有任何标签                                             |
| `author:用户名`            | 某人创建                                               |
| `assignee:用户名`          | 指派给某人                                              |
| `mentions:用户名`          | 正文里 @ 了谁                                           |
| `comments:>=10`         | 评论数比较，支持 `>` `<` `>=` `<=` `n..m`                  |
| `created:>2026-01-01`   | 创建日期，支持 `>2026-01-01` 和区间 `2026-01-01..2026-06-30` |
| `updated:<2026-06-01`   | 最后更新日期                                             |
| `repo:owner/name`       | 限定仓库，跨仓库搜索时必用                                      |
| `org:ActivityWatch`     | 限定组织下所有仓库                                          |
| `in:title` / `in:body`  | 只搜标题 / 只搜正文                                        |
| `sort:updated-desc`     | 排序（`updated-desc`、`created-desc`、`comments-desc`）  |
**排除用减号。** `-label:stale` 表示"不带 stale 标签"，`-author:foo` 排除某人。