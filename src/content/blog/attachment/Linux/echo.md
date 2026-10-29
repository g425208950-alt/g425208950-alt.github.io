---
title: echo
description: echo 的输出、转义、引号和与 printf 的区别
pubDate: 2026-10-29
draft: true
---

`echo` 把参数拼成一行写到标准输出，末尾自动加换行。

它有两个身份：bash 的**内建命令**，和 `/usr/bin/echo`（coreutils）。默认走内建，`type echo` 可以确认：

```bash
$ type echo
echo is a shell builtin
```

两者的选项处理不完全一样，脚本里对可移植性有要求时用 `printf`，见最后一节。

## 基本用法

```bash
echo hello                 # hello
echo hello world           # hello world，参数间自动补一个空格
echo "hello   world"       # 引号里的空格原样输出
echo                       # 只输出一个换行
echo "a" "b"               # a b
echo "$HOME"               # 变量展开
echo '$HOME'               # 原样输出 $HOME
echo {1..3}                # 1 2 3，花括号展开
echo *.md                  # 通配符展开成文件名
echo $?                    # 上一条命令的退出码
```

不加引号时，`*`、`?` 会先被 shell 展开，变量会做分词，多个空格会被压成一个。要原样输出就加引号。

## 转义

bash 内建的 echo 默认**不解释**反斜杠，`echo "a\tb"` 输出的是字面量 `a\tb`。要解释得加 `-e`：

```bash
echo -e "line1\nline2"
echo -e "a\tb"
```

| 转义 | 结果 |
| --- | --- |
| `\n` | 换行 |
| `\t` | 制表符 |
| `\\` | 反斜杠 |
| `\a` | 响铃 |
| `\b` | 退格 |
| `\e` 或 `\033` | ESC，做颜色用 |
| `\x41` | 十六进制，输出 `A` |
| `\u4f60` | Unicode，输出「你」（bash 4.2+） |
| `\c` | 停止输出，且不加换行 |

`\c` 常被忽略：`echo -e "abc\c"` 只输出 `abc`，后面同一条命令的内容都不再输出。

bash 里还有 ANSI-C 引号 `$'...'`，不用 `-e` 也能解释：

```bash
echo $'line1\nline2'
```

## -n、-e、-E

| 选项 | 作用 |
| --- | --- |
| `-n` | 不输出末尾换行 |
| `-e` | 解释反斜杠转义 |
| `-E` | 关闭转义解释（默认） |

```bash
echo -n "loading..."      # 光标停在同一行
echo -e "a\tb"
```

`-n` 和 `-e` 的写法在各 shell 里不统一：dash 的 echo 默认就解释转义，`sh` 下 `echo -e` 甚至会原样打印 `-e`。所以写脚本时别依赖这些选项。

## 写文件

```bash
echo "hello" > file        # 覆盖
echo "hello" >> file       # 追加
echo "error" >&2           # 输出到标准错误
```

`>` 会立刻截断文件，手滑就是清空，重要文件先备份。

## 颜色

```bash
echo -e "\033[31m红色\033[0m"
echo -e "\e[1;32m粗体绿\e[0m"
```

`\033[31m` 设置前景红，`0m` 重置。写脚本建议用变量，别把转义串散落在各处：

```bash
RED='\033[31m'; NC='\033[0m'
echo -e "${RED}error${NC}"
```

## 用 printf 代替

只要输出内容来自变量、可能含 `-` 开头或反斜杠，就换 `printf`：

```bash
printf '%s\n' "$var"           # 安全，不解释转义
printf '%-10s %s\n' "$name" "$value"
printf '\033[31m%s\033[0m\n' "text"
```

`printf` 的格式是固定的，`%s` 不会受变量内容影响，也不用担心某个 shell 的 `-e` 差异。

## 坑

- **以 `-` 开头的字符串被当成选项**：`echo "-n"` 什么都不输出。bash 内建和 coreutils 的 echo 都不支持用 `--` 结束选项，正确做法是 `printf '%s\n' "-n"`。
- **变量不加引号会丢空格**：`echo $var` 中 `var="a  b"` 会被压成一个空格，用 `echo "$var"`。
- **`echo -e` 不可移植**：脚本里如果想稳，直接用 `printf`。
- **`\c` 会截断整行输出**，混在变量里很容易出意外。
- **颜色到了管道里也是转义字符**，重定向到文件会出现乱码，需要判断 `[ -t 1 ]` 再加色。
- **echo 不适合拼 JSON/代码**，引号和反斜杠会让输出和预期差一层，用 `jq -n` 或 heredoc。

## 一句话

交互时用 echo 足够；写进脚本、内容来自变量，就用 `printf '%s\n'`。
