---
title: pgrep 与 pkill
description: 按名字匹配进程来查 PID、发信号的用法和匹配规则
pubDate: 2026-10-27
draft: true
---

`pgrep` 按名字或命令行找进程，打印 PID；`pkill` 是同一套匹配规则的 `pgrep` 加 `kill`，找到就直接发信号。两者都来自 procps-ng，选项几乎通用。

## 基本用法

```bash
pgrep firefox           # 打印匹配的 PID，一行一个
pgrep -l firefox        # 多打印一列进程名
pgrep -a firefox        # 打印完整命令行
pgrep -c firefox        # 只打印匹配个数

pkill firefox           # 默认发 SIGTERM
pkill -9 firefox        # 发 SIGKILL，强杀
pkill -HUP nginx        # 发 SIGHUP，很多守护进程用它重载配置
```

## 匹配规则

默认只拿进程名（内核的 `comm`，最长 15 个字符）去匹配，而且是**子串匹配**。

```bash
pgrep fire             # 会匹配 firefox、firewalld、firejail
pgrep -x firefox       # -x 要求整名完全相等
pgrep -f "python.*worker"   # -f 改成匹配完整命令行，正则生效
pgrep -i Firefox       # 忽略大小写
pgrep -v -u root       # -v 取反：不是 root 的
```

`-f` 是常用也是危险的那个：它匹配整条命令行，能解决名字被截断 15 字符的问题，但也会匹配到命令行里恰好含这个串的 shell。

## 常用选项

| 选项          | 含义                         |
| ----------- | -------------------------- |
| `-f`        | 匹配完整命令行，而不只是进程名            |
| `-x`        | 进程名必须完全相等                  |
| `-i`        | 忽略大小写                      |
| `-u <user>` | 只看指定有效用户的进程                |
| `-U <uid>`  | 按真实用户 ID 过滤                |
| `-t <tty>`  | 按终端过滤，如 `-t pts/1`         |
| `-P <ppid>` | 只看某个进程的子进程                 |
| `-n`        | 只取最新的一个                    |
| `-o`        | 只取最老的一个                    |
| `-c`        | 只输出匹配数量（仅 pgrep）           |
| `-l`        | 附带进程名（仅 pgrep）             |
| `-a`        | 附带完整命令行（仅 pgrep）           |
| `-d <sep>`  | 输出分隔符，默认换行                 |
| `-e`        | 打印被杀的进程（仅 pkill）           |
| `-v`        | 取反，只处理不匹配的                 |

`-n` 很实用：`pkill -n firefox` 只杀最新启动的那个，不会把整个浏览器相关进程一锅端。

## 发哪个信号

`pkill` 的第一个参数可以写成信号名或编号，不给就是 `TERM`：

| 写法             | 信号       | 用途                  |
| -------------- | -------- | ------------------- |
| `pkill foo`    | SIGTERM  | 礼貌退出，进程能清理资源、存盘     |
| `pkill -9 foo` | SIGKILL  | 内核直接回收，进程没机会反应      |
| `pkill -1 foo` | SIGHUP   | 多数守护进程约定为重载配置        |
| `pkill -2 foo` | SIGINT   | 相当于 Ctrl+C          |
| `pkill -15 foo` | SIGTERM | 同默认                 |
| `pkill -0 foo` | 信号 0    | 只探测进程是否存在，不发信号      |

先 `TERM`，等一会儿还在再 `KILL`。直接 `-9` 会跳过清理，可能留下锁文件、写到一半的文件。

## 安全用法

先查再杀，别一条命令直接下手：

```bash
pgrep -af "python.*worker"      # 确认命中的是什么
pkill -TERM -f "python.*worker"
```

限定用户和终端能避免误伤：

```bash
pkill -u alice -f "node.*dev-server"
pkill -t pts/2 -f vim
```

`-f` 有自伤风险：`bash -c "pkill -f 'git push'"` 里，这个 shell 自己的命令行也含 `git push`，会被一起匹配。稳妥的做法是把模式写得更具体，或者用 `pgrep -f` 先拿到 PID 列表，确认后再 `kill`：

```bash
pgrep -f "vite.*--port 5173" | xargs -r kill
```

## 退出码

| 退出码  | 含义            |
| ---- | ------------- |
| `0`  | 至少匹配到一个       |
| `1`  | 一个都没匹配到       |
| `2`  | 命令行参数有语法错误    |
| `3`  | 其他致命错误        |

所以可以直接用在条件里：

```bash
pgrep -x nginx >/dev/null || systemctl start nginx
```

## 坑

- 进程名超过 15 字符时，`pgrep -x` 永远匹配不上，用 `-f`。
- 僵尸进程（`Z` 状态）杀不掉，得等父进程回收。
- 服务由 systemd 托管时别用 `pkill`，用 `systemctl stop`，否则服务会被自动拉起重启。
- `pkill` 自己不会匹配到自己，但它所在的 shell 可能被匹配到。
- 匹配是正则，`.git` 里的点是通配符，要字面量就用 `\\.` 或 `[.]`。

## 相关命令

| 命令                      | 区别                              |
| ----------------------- | ------------------------------- |
| `kill <pid>`            | 已知 PID 时直接用                      |
| `killall firefox`       | 全名精确匹配，不是子串                     |
| `pidof firefox`         | 只接受程序名，打印 PID 列表                |
| `ps aux` + `grep`       | 老办法，容易把 grep 自己带出来               |
| `systemctl stop <unit>` | 服务优先走 systemd                   |
