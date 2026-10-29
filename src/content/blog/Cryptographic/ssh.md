---
title: ssh
description: ssh 登录、配置、端口转发和常见故障的用法
pubDate: 2026-10-28
draft: true
---

`ssh` 是 OpenSSH 的客户端，用加密通道登录远程机器、执行命令、转发端口。密钥本身的生成和管理在 ssh-keygen.md，这里讲怎么用。

## 登录

```bash
ssh user@host                # 默认 22 端口
ssh -p 2222 user@host        # 指定端口
ssh -i ~/.ssh/id_ed25519 user@host   # 指定私钥
ssh host                     # host 在 ~/.ssh/config 里定义过
ssh user@host 'uptime'       # 只执行一条命令
```

第一次连接会问是否信任服务器指纹，确认后写入 `~/.ssh/known_hosts`。之后指纹变了会报警，见下面「常见故障」。

## 公钥登录的原理

不是“把密码换成公钥”，而是证明你手里有私钥：

1. 客户端说：“我想用这把公钥登录”
2. 服务器查 `~/.ssh/authorized_keys`，有这把公钥就发一个挑战
3. 客户端用私钥对挑战签名，服务器用公钥验签
4. 验过就放行

私钥全程不出本机，服务器拿到的只有签名。所以 `authorized_keys` 里放的永远是 `.pub` 那一半。

## 配置文件

`~/.ssh/config` 用来省掉重复参数，写法：

```
Host myserver
  HostName 192.168.1.10
  User root
  Port 2222
  IdentityFile ~/.ssh/id_ed25519
```

之后 `ssh myserver` 就够了。常用字段：

| 字段 | 作用 |
| --- | --- |
| `HostName` | 实际地址，`Host` 只是你敲的别名 |
| `User` / `Port` | 登录用户和端口 |
| `IdentityFile` | 用哪把私钥 |
| `IdentitiesOnly yes` | 只用指定的钥匙，不把 agent 里的全试一遍 |
| `AddKeysToAgent yes` | 首次使用后自动加进 agent |
| `ServerAliveInterval 60` | 每分钟发一次保活，防止空闲被断开 |
| `ServerAliveCountMax 3` | 连续 3 次没响应才断开 |
| `ProxyJump` | 经跳板机连接 |
| `ProxyCommand` | 自定义连接方式，如走代理 |
| `ControlMaster auto` + `ControlPath` | 复用连接，第二次登录几乎瞬间完成 |

匹配规则：从上往下，**先匹配到的值生效**，所以具体的 Host 块要写在 `Host *` 前面。`Host` 支持 `*`、`?` 和 `!` 取反。

`chmod 600 ~/.ssh/config` 是必须的，权限过宽 ssh 会拒绝加载。

## 走代理连接

GitHub 的 22 端口常被墙，但 443 可用，于是借代理：

```
Host github.com
  HostName ssh.github.com
  Port 443
  User git
  ProxyCommand nc -X connect -x 127.0.0.1:7897 %h %p
```

`ProxyCommand` 的意思是：ssh 不自己建 TCP 连接，而是启动这条命令，把它的 stdin/stdout 当成网络通道。这里的 `nc` 负责连本机 7897 端口的代理，让它去连 `ssh.github.com:443`，ssh 再在这个管道里跑协议。

`-X connect` 是 HTTP CONNECT 代理，`-X 5` 是 SOCKS5。`%h` 和 `%p` 由 ssh 替换成目标主机和端口。

`ProxyJump` 是更省事的写法，走 SSH 跳板：

```bash
ssh -J root@bastion 10.0.0.5
```

## 端口转发

```bash
ssh -L 8080:localhost:80 user@host     # 本地 8080 → 远端 80
ssh -L 5432:db.internal:5432 user@host # 本地 5432 → 内网数据库
ssh -R 9000:localhost:3000 user@host   # 远端 9000 → 本地 3000
ssh -D 1080 user@host                  # 本地 1080 开 SOCKS5 代理
```

| 参数 | 方向 | 用途 |
| --- | --- | --- |
| `-L` | 本地 → 远端 | 访问远端的服务 |
| `-R` | 远端 → 本地 | 把本地服务暴露给远端 |
| `-D` | 动态 | 本地起一个 SOCKS 代理，全部流量走远端 |

常配 `-N`（不执行命令）和 `-f`（转后台）：

```bash
ssh -fN -L 8080:localhost:80 user@host
```

转发默认只绑 127.0.0.1，要让别人也能连，写 `-L 0.0.0.0:8080:...`，但等于对外暴露服务，慎用。

`-R` 在服务端还需要 `GatewayPorts` 配合才能监听非回环地址。

## 其他常用参数

```bash
ssh -v host        # 调试，-vvv 更详细
ssh -C host        # 压缩，慢网络有用
ssh -X host        # X11 转发，-Y 是信任模式
ssh -4 host        # 只用 IPv4
ssh -o BatchMode=yes host   # 禁止交互提问，脚本里用
```

`~/.ssh/authorized_keys` 行首可以加限制，比如 `no-port-forwarding`、`command="..."`、`from="10.0.0.0/8"`。

## 交互时的转义

连接建立后，行首输入 `~` 开头的转义序列（`~` 只有在行首才生效）：

| 序列 | 作用 |
| --- | --- |
| `~.` | 断开连接 |
| `~^Z` | 挂起 ssh，回到本地 shell |
| `~&` | 挂起到后台 |
| `~#` | 列出当前所有转发 |
| `~?` | 帮助 |

## 传文件

```bash
scp file user@host:/path/
scp user@host:/path/file .
rsync -avz dir/ user@host:/path/   # 大目录用 rsync
```

scp 现在底层走 SFTP，新的 ssh 配置（如 ProxyJump）对它同样生效。

## 常见故障

| 现象 | 原因和处理 |
| --- | --- |
| `Permission denied (publickey)` | 公钥没进 `authorized_keys`，或 sshd 关了公钥登录；`ssh -v` 看提供了哪把 |
| `Too many authentication failures` | agent 里的钥匙太多，加 `IdentitiesOnly yes` |
| `REMOTE HOST IDENTIFICATION HAS CHANGED` | 服务器换过密钥。确认安全后 `ssh-keygen -R host` |
| `Connection refused` | 端口不对或 sshd 没起 |
| `Connection timed out` / `Connection reset` | 被墙或防火墙拦，换端口或走代理 |
| 闲置几分钟就断 | 配 `ServerAliveInterval` |
| `Bad owner or permissions on ~/.ssh/config` | `chmod 600` |

测试 GitHub 连通性：

```bash
ssh -T git@github.com
```

成功会返回 `Hi xxx! You've successfully authenticated`，提示不代表失败，GitHub 本来就不给 shell。

## 服务端

配置在 `/etc/ssh/sshd_config`，改完要 `systemctl restart sshd`：

| 配置项 | 建议 |
| --- | --- |
| `PermitRootLogin` | `no` 或 `prohibit-password` |
| `PasswordAuthentication` | 上了公钥就设 `no` |
| `PubkeyAuthentication` | `yes` |
| `Port` | 改掉 22 能少点扫描，但别当成安全措施 |

改之前先确认自己能连上，`sshd_config` 写错会导致重启后谁都进不去。
