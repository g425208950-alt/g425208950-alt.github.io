---
title: cat
description: cat 的显示、拼接、写文件和显示不可见字符的用法
pubDate: 2026-10-28
draft: true
---

`cat` 全称 concatenate（拼接）：把文件内容按顺序接到标准输出上。它不编辑、不筛选，只负责“读出来”。

## 最常用的

| 命令 | 作用 |
| --- | --- |
| `cat file` | 打印文件 |
| `cat a b c` | 按顺序拼接三个文件 |
| `cat -n file` | 每行加行号 |
| `cat -b file` | 只给非空行加行号 |
| `cat -s file` | 多个连续空行压成一个 |
| `cat -A file` | 显示所有不可见字符 |
| `cat > file` | 从键盘写入，覆盖原文件 |
| `cat >> file` | 追加 |

```bash
cat -n /etc/fstab            # 带行号看配置
cat a.txt b.txt > all.txt    # 合并
cat -      # 读标准输入，Ctrl+D 结束
```

## 写文件

`cat > file` 会**无条件覆盖**，没有确认提示：

```bash
cat > notes.txt          # 输入内容，Ctrl+D 保存
cat >> notes.txt         # 追加
cat /dev/null > app.log  # 清空文件
```

heredoc 是更常见的写法：

```bash
cat > nginx.conf <<'EOF'
server {
    listen 80;
    server_name example.com;
}
EOF
```

引号决定要不要展开变量：`<<'EOF'` 原样写入，`<<EOF` 会先把 `$VAR`、反引号命令替换掉。写配置文件、脚本时用带引号的那种，免得 `$` 被 shell 吃掉。

`<<-EOF` 会去掉每行行首的 tab，适合写在缩进里的脚本。

## 看不可见字符

排查“明明一样却 diff 不一样”时用这个。`-A` 等于 `-vET`：

```bash
cat -A file
```

输出里：

- `$` 表示行尾（LF）
- `^I` 表示 tab
- `^M` 表示 CR（Windows 换行，`^M$` 就是 CRLF）
- `M-` 开头表示高位字节

只看行尾可以用 `-E`、只看 tab 用 `-T`。

文件带 CRLF 时，`cat -A` 能一眼看出来，改法：

```bash
sed -i 's/\r$//' file
```

## 拼接与重定向

```bash
cat part1 part2 > whole          # 合并
cat header.txt - < body.txt      # 文件 + 标准输入混着来
cat file | grep foo              # 能跑，但 grep foo file 更好
```

`cat` 在管道左边多数时候是多余的（俗称 UUOC，useless use of cat），因为 `grep`、`wc`、`sort` 本来就能直接接文件名。只有在需要按顺序喂多个文件时它才有意义：

```bash
cat *.log | sort        # 这里不能省
```

## 和相似命令的区别

| 命令 | 区别 |
| --- | --- |
| `tac` | 反向输出，行序倒过来 |
| `nl` | 加行号，比 `cat -n` 控制更细 |
| `less` | 分页看，大文件用这个 |
| `head` / `tail` | 只看开头 / 结尾 |
| `xxd` / `hexdump -C` | 看二进制，别用 cat |
| `tee` | 一边写屏幕一边写文件 |

## 坑

- **`sudo cat > /etc/file` 不生效**：重定向是当前 shell 做的，提权只作用于 cat。要用 `sudo tee`：

  ```bash
  cat <<'EOF' | sudo tee /etc/config
  ...
  EOF
  ```

- **别 cat 二进制**。往终端打二进制会卡住甚至改坏终端状态，`reset` 才能恢复。看二进制用 `xxd` 或 `hexdump -C`。
- **别 cat 大文件**。几万行会刷屏，用 `less`。
- **`cat > file` 手滑就是覆盖**。重要文件先确认，或者改用编辑器。
- **文件名以 `-` 开头**要加 `--`：`cat -- -weird.txt`。
- **`cat` 不能读目录**，会报 `Is a directory`。

## 一句话

`cat` 就是“把文件内容导到输出”，写文件、合并、看隐藏字符是它的三个实用场景，其余多半有更专门的命令。
