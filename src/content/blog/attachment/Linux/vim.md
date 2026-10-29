---
title: vim
description: vim 的模式、移动、编辑、搜索替换、宏和配置速查
pubDate: 2026-10-29
draft: true
---

vim 的用法是「模式 + 动作 + 对象」：普通模式下敲命令，命令由一个动词（删除、修改、复制）加一个范围（单词、括号、到行尾）组成。

先跑一遍 `vimtutor`，半小时能覆盖基础。下面按用途整理。

## 模式

| 模式 | 怎么进 | 用途 |
| --- | --- | --- |
| 普通模式 | `Esc`（默认） | 敲命令、移动 |
| 插入模式 | `i` `a` `o` `I` `A` `O` | 打字 |
| 可视模式 | `v` `V` `Ctrl+v` | 选中再操作 |
| 命令行模式 | `:` `/` `?` | 保存、替换、执行命令 |
| 替换模式 | `R` | 覆盖输入 |

所有键位区分大小写，`dd` 和 `DD` 效果不同。

## 启动

```bash
vim file            # 打开文件
vim +25 file        # 跳到第 25 行
vim +/pattern file  # 跳到第一次匹配
vim -R file         # 只读
vim -p a b c        # 每个文件一个标签页
```

退出：`:wq` 或 `ZZ` 保存退出，`:q!` 不保存强退，`:w` 只保存。

## 移动

| 键 | 作用 |
| --- | --- |
| `h` `j` `k` `l` | 左 下 上 右 |
| `w` / `b` / `e` | 下一个词首 / 词首回退 / 词尾 |
| `0` / `^` / `$` | 行首 / 第一个非空白 / 行尾 |
| `gg` / `G` | 文件首 / 文件尾 |
| `5G` 或 `:5` | 第 5 行 |
| `f x` / `t x` | 跳到本行下一个 x / x 前一个字符 |
| `%` | 括号间跳转 |
| `{` / `}` | 按段落跳 |
| `Ctrl+d` / `Ctrl+u` | 翻半屏 |
| `Ctrl+f` / `Ctrl+b` | 翻整屏 |
| `H` `M` `L` | 屏幕顶 / 中 / 底 |
| `zz` | 当前行居中 |

前缀数字表示重复，`3w` 前进三个词，`10j` 下移十行。

## 编辑

| 键 | 作用 |
| --- | --- |
| `i` / `a` | 光标前 / 后插入 |
| `I` / `A` | 行首 / 行尾插入 |
| `o` / `O` | 下方 / 上方新开一行 |
| `x` / `X` | 删一个字符 / 前一个字符 |
| `dd` / `D` | 删整行 / 删到行尾 |
| `cc` / `C` | 改整行 / 改到行尾 |
| `yy` / `Y` | 复制整行 |
| `p` / `P` | 粘贴到后 / 前 |
| `u` / `Ctrl+r` | 撤销 / 重做 |
| `.` | 重复上一次修改 |
| `r` / `R` | 替换一个字符 / 进入替换模式 |
| `>>` / `<<` | 缩进 / 反缩进 |
| `J` | 把下一行接到本行 |
| `~` | 切换大小写 |
| `gJ` | 接行但不加空格 |

`dd`、`yy`、`cc` 都能加数字：`3dd` 删三行，`5yy` 复制五行。

## 文本对象

动词后面可以接「对象」，比按字符数靠谱：

| 对象 | 范围 |
| --- | --- |
| `iw` / `aw` | 一个词（不含 / 含周围空格） |
| `i"` / `a"` | 引号内 / 含引号 |
| `i(` / `a(` | 括号内 / 含括号，`ib` 同义 |
| `i{` / `a{` | 大括号内 / 含括号，`iB` 同义 |
| `it` / `at` | 标签内 / 含标签 |
| `ip` / `ap` | 段落 |

组合起来：`ciw` 改当前词，`di(` 删括号内容，`ya"` 复制引号里的一段，`cit` 改标签内容。

## 搜索

```vim
/word      " 向下搜
?word      " 向上搜
n / N      " 下一个 / 上一个
*          " 搜光标下的词
#          " 反向搜光标下的词
:noh       " 清掉高亮
```

`:set incsearch` 边输入边跳，`:set hlsearch` 高亮所有匹配。

## 替换

```vim
:s/old/new/        " 当前行第一个
:s/old/new/g       " 当前行全部
:%s/old/new/g      " 整个文件
:%s/old/new/gc     " 每次询问
:5,20s/old/new/g   " 第 5 到 20 行
:'<,'>s/old/new/g  " 可视选区，选中后按 : 自动出现
```

正则默认是「魔法」模式，括号和加号要转义。用 `\v` 切到 very magic，写法接近 PCRE：

```vim
:%s/\v(\w+)@(\w+)/\2 at \1/g
```

## 可视模式

| 键 | 作用 |
| --- | --- |
| `v` | 字符选择 |
| `V` | 整行选择 |
| `Ctrl+v` | 块选择 |
| `o` | 跳到选区另一端 |
| `gv` | 重选上次的选区 |
| `>` / `<` | 缩进 / 反缩进（按 `.` 可重复） |
| `y` / `d` / `c` | 复制 / 删除 / 修改选区 |
| `I` / `A` | 块模式下在每行行首 / 行尾插入 |
| `$` | 块模式选到行尾 |

列编辑：`Ctrl+v` 选一竖列，按 `I` 输入，`Esc` 后每行同时插入。

## 宏

```vim
qa          " 开始录到寄存器 a
...         " 做操作
q           " 停止
@a          " 执行
@@          " 重复上一次宏
5@a         " 执行五次
qA          " 追加录制到已有的 a
```

`:normal @a` 可以对整个选区执行宏。宏里注意用 `j` 前进，否则会在原地打转。

## 寄存器

| 前缀 | 含义 |
| --- | --- |
| `"a` | 命名寄存器 a |
| `"+` | 系统剪贴板 |
| `"*` | X11 主选区 |
| `"0` | 最近一次复制 |
| `"1`–`"9` | 最近删除的九条 |
| `"_` | 黑洞，删了不存 |

```vim
"ayy      " 复制当前行到寄存器 a
"ap       " 粘贴 a
"_dd      " 删除但不覆盖寄存器
:reg      " 查看所有寄存器
```

系统剪贴板需要 vim 编译时带 `+clipboard`，`vim --version | grep clipboard` 确认；没有就用 `:set clipboard=unnamedplus` 前先装 `gvim` 或改用 neovim。

## 文件、缓冲区、窗口

```vim
:e other.txt     " 打开文件
:r other.txt     " 把文件内容读进来
:w               " 保存
:wa              " 保存全部
:q               " 退出
:ls              " 列出缓冲区
:b 2             " 切到第 2 个缓冲区
:bn / :bp        " 下一个 / 上一个缓冲区
:bd              " 关掉当前缓冲区
:sp / :vsp       " 上下 / 左右分屏
Ctrl+w h/j/k/l   " 在窗口间移动
Ctrl+w =         " 窗口等宽
:tabe file       " 新标签页，gt / gT 切换
```

`:e .` 打开内置文件浏览器（netrw），`gf` 跳到光标下的文件。

## 命令行里干活

```vim
:!ls             " 执行命令
:r !date         " 把命令输出插到当前位置
:%!sort          " 用命令过滤整个文件
:w !sudo tee %   " 忘了 sudo 时的救命写法
:%d              " 清空文件
```

`:.!cmd` 只过滤当前行。

## 配置

`~/.vimrc`，常用几行：

```vim
set number            " 行号
set relativenumber    " 相对行号
set tabstop=4         " tab 显示宽度
set shiftwidth=4      " 缩进宽度
set expandtab         " tab 转空格
set ignorecase        " 搜索忽略大小写
set smartcase         " 有大写时区分
set incsearch         " 边搜边跳
set hlsearch          " 高亮匹配
set nowrap            " 不自动折行
set mouse=a           " 鼠标
set clipboard=unnamedplus
syntax on
filetype plugin indent on
```

临时改的用 `:set xxx`，`:set noxxx` 关闭，`:set xxx?` 查当前值。

`~/.vimrc` 属于 vim；neovim 读 `~/.config/nvim/init.vim` 或 `init.lua`，两者不共用。

## 插件

最小可用的管理方式是 vim-plug：

```vim
call plug#begin()
Plug 'tpope/vim-surround'
Plug 'preservim/nerdtree'
call plug#end()
```

装完执行 `:PlugInstall`。插件不是必需品，先熟悉原生操作再考虑。

## 坑

- **粘贴时疯狂缩进**：`:set paste` 再粘，粘完 `:set nopaste`；或者用 `"+p`。
- **`Ctrl+s` 卡死**：终端流控，按 `Ctrl+q` 恢复，或在 shell 里 `stty -ixon`。
- **`:w !sudo tee %` 后要 `:e!`** 重新加载，否则提示文件已变。
- **swap 文件残留**：崩溃后下次打开会问，按 `r` 恢复、`d` 删除、`q` 退出。
- **改了 `.vimrc` 不生效**：用 `:source ~/.vimrc`，或看 `:scriptnames`。
- **用方向键会破坏肌肉记忆**，但没人强制，先能干活最重要。

## 帮助

```vim
:help            " 总目录
:help dd         " 查具体命令
:help :s         " 查命令行命令
K                " 查光标下的词，默认调 man
```
