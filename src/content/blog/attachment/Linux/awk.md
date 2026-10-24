---
title: awk
description: awk 的模式、字段、内置变量和常用写法的速查
pubDate: 2026-10-24
draft: true
---

awk 是一门按行处理文本的小语言，基本结构是「模式 + 动作」：读一行、按分隔符切成字段、模式匹配上了就执行动作。

## 基本形式

```bash
awk '模式 { 动作 }' 文件
```

```bash
awk '{print $1}' file              # 省略模式：每行都执行
awk '/error/' file                 # 省略动作：打印匹配的行
awk -F: '{print $1}' /etc/passwd   # -F 指定字段分隔符
awk -v n=3 'NR<=n' file            # -v 传入变量
awk -f prog.awk file               # 从文件读脚本
```

单引号里面的 `$` 不会被 shell 展开；写成双引号就会被 shell 先吃掉，这是最常见的坑。

## 字段

| 写法       | 含义                    |
| -------- | --------------------- |
| `$0`     | 整行                    |
| `$1` … `$n` | 第 n 个字段              |
| `$NF`    | 最后一个字段               |
| `$(NF-1)` | 倒数第二个字段              |
| `NF`     | 字段个数                  |

`$0` 被重新赋值、或者 `$1` 被修改后，awk 会按 `OFS` 重新拼出 `$0`。

## 内置变量

| 变量           | 含义                        |
| ------------ | ------------------------- |
| `NR`         | 已读的总行数                    |
| `FNR`        | 当前文件的第几行                  |
| `NF`         | 当前行的字段数                   |
| `FS`         | 输入字段分隔符，默认空格（含 tab 和换行）    |
| `OFS`        | 输出字段分隔符，默认空格              |
| `ORS`        | 输出记录分隔符，默认换行              |
| `RS`         | 输入记录分隔符，默认换行              |
| `FILENAME`   | 当前文件名                     |
| `ENVIRON`    | 环境变量数组，如 `ENVIRON["HOME"]` |
| `RSTART`     | `match()` 匹配的起始位置         |
| `RLENGTH`    | `match()` 匹配的长度           |

`FS` 在 `BEGIN` 里设；FS 为单个空格时特别处理（合并连续空白），设成 `"[ \t]+"` 则不合并。

## 模式

```bash
awk '$3 > 100' file                 # 数值比较
awk '$1 == "root"' file             # 字符串比较
awk '/re/' file                     # 匹配整行
awk '$1 ~ /re/' file                # 字段匹配
awk '$1 !~ /re/' file               # 字段不匹配
awk 'NR > 1 && $2 < 5' file         # 逻辑组合
awk '/start/,/end/' file            # 范围，从匹配 start 到匹配 end
awk 'BEGIN { ... } END { ... }' file
```

模式本质上是个表达式，非 0 非空就执行动作。`BEGIN` 在处理第一行前跑一次，`END` 在全部读完后跑一次。

## 常用动作

```bash
awk '{print $1, $3}' file           # 逗号用 OFS 连接
awk '{print $1 $3}' file            # 没有分隔符，直接拼接
awk -v OFS=, '{print $1, $3}' file  # 输出成 CSV
awk '{printf "%-10s %5.2f\n", $1, $2}' file
awk '{sum += $2} END {print sum}' file
awk '{if ($1 > 10) print $0; else print "small"}' file
awk 'NR==1 {next} {print}' file     # next 跳过后面的动作
awk 'NR>5 {exit}' file              # exit 直接结束，仍会执行 END
```

注意 `print a, b` 和 `print a b` 不是一回事：前者中间有 OFS，后者是字符串拼接。

## printf

`printf` 不自动换行，也不会用 OFS，要自己写 `\n`。

| 格式        | 含义              |
| --------- | --------------- |
| `%s`      | 字符串             |
| `%d`      | 整数              |
| `%f`      | 浮点，默认 6 位小数     |
| `%.2f`    | 保留 2 位小数        |
| `%5.2f`   | 宽度 5，保留 2 位     |
| `%-10s`   | 左对齐，宽度 10       |
| `%x` / `%o` | 十六进制 / 八进制      |
| `%e` / `%g` | 科学计数 / 自动选择      |
| `%%`      | 一个字面量 `%`        |

## 字符串与数学函数

| 函数                          | 作用                     |
| --------------------------- | ---------------------- |
| `length(s)`                 | 长度，省略参数是 `$0`          |
| `substr(s, m, n)`           | 从 m 开始取 n 个字符          |
| `index(s, t)`               | t 在 s 中的位置，没有返回 0      |
| `split(s, a, sep)`          | 按 sep 拆进数组 a，返回个数      |
| `sub(re, rep)` / `gsub()`   | 替换第一处 / 全部，第三个参数默认 `$0`，返回替换次数 |
| `match(s, re)`              | 设置 RSTART / RLENGTH    |
| `sprintf(fmt, ...)`         | 格式化但不输出                |
| `tolower(s)` / `toupper(s)`  | 转大小写                   |
| `gensub(re, rep, "g", s)`   | gawk 扩展，支持 `\1` 反向引用，不改原串 |
| `int(x)`                    | 取整（向零）                 |
| `sqrt(x)` / `rand()` / `srand()` | 数学 / 随机数          |

`sub` 和 `gsub` 的替换串里，`&` 代表整个匹配，`\\&` 才是字面量 `&`。

## 数组

awk 的数组都是关联数组，键是字符串：

```bash
awk '{count[$1]++} END {for (k in count) print count[k], k}' file
awk '!seen[$0]++' file              # 去重，保持原顺序
awk '{a[$1] = $2} END {for (k in a) print k, a[k]}' file
awk '{if ($1 in a) print $1}' file  # in 判断键是否存在
```

`for (k in a)` 的遍历顺序不保证；要排序就 `| sort`，或者用 gawk 的 `asort` / `asorti`。

多维数组用 `a[i, j]`，实际键是 `i SUBSEP j`；`delete a` 清空整个数组，`delete a[k]` 删一项。

## 自定义函数

```bash
awk 'function max(a, b) { return a > b ? a : b }
     {m = max(m, $1)} END {print m}' file
```

函数参数按值传递（数组按引用）；函数里没声明的变量是全局的，想局部就写在参数列表末尾多写几个。

## 惯用法

```bash
awk '{s += $3} END {print s}' f                    # 求和
awk '{s += $3} END {print s/NR}' f                 # 平均
awk 'END {print NR}' f                             # 行数（空文件返回 0）
awk '{$1 = $1; print}' f                           # 规范空白
awk 'length > 80' f                                # 超过 80 字符的行
awk '/start/ {f=1} f; /end/ {f=0}' f               # 打印区间
awk 'NF' f                                         # 非空行
awk 'NR == FNR {a[$1]=$2; next} $1 in a {print $1, a[$1]}' a.txt b.txt   # 两文件关联
```

gawk 的原地修改（等价 `sed -i`）：

```bash
gawk -i inplace '{gsub(/foo/, "bar")} 1' file
```

CSV 里有带逗号的引号字段时，`-F,` 会切错，gawk 用 `FPAT`：

```bash
gawk -v FPAT='([^,]*)|("[^"]*")' '{print $2}' data.csv
```

## 易错点

| 现象                       | 原因                                    |
| ------------------------ | ------------------------------------- |
| `$1` 变成空                 | 外层用了双引号，shell 先把 `$1` 展开了             |
| 数值比较结果反常                | 字段和数字比按数值；带引号的常量按字符串比，`"010" == 10` 为假 |
| `print a > b` 没输出         | `>` 在 awk 里是重定向到文件，比较要写 `(a > b)`     |
| `\s`、`\d` 不生效            | 那是 PCRE 写法，POSIX awk 用 `[ \t]`、`[0-9]`  |
| 大文件越跑越慢吃内存              | 数组里存了全部行，考虑用流式写法                 |
| `gsub` 改不到原串             | 第三个参数传了 `$0` 的副本而不是 `$0`             |

输出重定向别写错：`print > "out"` 每次运行都会截断，想追加用 `print >> "out"`。

## 版本差异

系统里的 `awk` 可能是 gawk、mawk、nawk 或 busybox 的，行为有差别。`gensub`、`FPAT`、`asort`、`-i inplace` 都是 gawk 扩展；要可移植就只用 POSIX 的部分，或者显式写 `gawk`。
