---
title: ssh-keygen
description: SSH 密钥生成、RSA 与 ed25519 的区别、指纹和 agent 用法
pubDate: 2026-10-28
draft: true
---

`ssh-keygen` 是 OpenSSH 自带的密钥工具：生成密钥对、查看指纹、管理 `known_hosts`、改密码、签名。它管的是**密钥**，SSH 连接本身是 `ssh` 的事。

## 生成一对密钥

```bash
ssh-keygen -t ed25519 -C "me@laptop"
```

会生成两个文件：

| 文件                      | 内容       | 权限             |
| ----------------------- | -------- | -------------- |
| `~/.ssh/id_ed25519`     | 私钥，绝不能外传 | 600（rw-------） |
| `~/.ssh/id_ed25519.pub` | 公钥，可以随便给 | 644（rw-r--r--） |

生成时问的 passphrase 是给私钥加密的口令，可以留空，但留空等于拿到文件就能登录。

常用参数：

| 参数   | 作用                                      |
| ---- | --------------------------------------- |
| `-t` | 类型：`ed25519`、`rsa`、`ecdsa`、`ed25519-sk` |
| `-b` | 位数，RSA 用，如 `4096`                       |
| `-C` | 注释，一般写邮箱或用途                             |
| `-f` | 输出路径                                    |
| `-N` | passphrase，`-N ""` 表示空                  |
| `-a` | KDF 轮数，加密私钥时用，如 `-a 100`                |

## 选哪种

| 类型 | 安全性 | 兼容性 | 建议 |
| --- | --- | --- | --- |
| `ed25519` | 128 位安全强度，抗侧信道 | 需要 OpenSSH ≥ 6.5，老设备可能不认 | 新环境默认选它 |
| `rsa` 3072/4096 | 靠大数分解，2048 已偏弱 | 几乎所有服务器都认 | 只在对方不支持 ed25519 时用 |
| `ecdsa` | 依赖 NIST 曲线，安全但实现复杂 | 较广 | 一般不必主动选 |
| `ed25519-sk` | 同上，密钥在硬件里 | 需要 FIDO2/U2F 设备 | 有 YubiKey 时用 |

`ssh-keygen -t rsa` 在新版里默认 3072 位，老版本是 2048。要 RSA 就明确写 `-b 4096`。

## RSA 和 ed25519 差在哪

**RSA**：取两个大素数 p、q，算出 n = p·q、欧拉函数 φ(n) = (p−1)(q−1)，公钥是 (n, e)（e 通常 65537），私钥 d 满足 e·d ≡ 1 (mod φ(n))。安全性建立在「n 分解不出 p、q」上。密钥和签名都长（4096 位模数就是 512 字节，签名也是这个量级）、签名慢、公钥接近 800 字节。

**ed25519**：基于 Edwards 曲线 25519 的 EdDSA 签名，密钥固定 32 字节，签名 64 字节。安全性建立在曲线上的离散对数问题。特点是签名确定（同样的消息和私钥每次签名结果一样，不依赖随机数）、速度快、实现里没有分支和查表，难做侧信道攻击。它不是 NIST 标准曲线，也不满足 FIPS 要求，这是少数老环境拒绝它的原因。

一句话：新装的环境用 ed25519；要兼容古董设备或过 FIPS 审查，用 RSA 4096。

## 看指纹

```bash
ssh-keygen -lf ~/.ssh/id_ed25519.pub
# 256 SHA256:xxxxxxxx me@laptop (ED25519)
ssh-keygen -lf ~/.ssh/id_ed25519.pub -E md5    # 老格式指纹
```

指纹是公钥的哈希，用来核对服务器给的公钥是不是真的。`256` 是密钥长度位数，SHA256 是默认哈希（OpenSSH 6.8 起），再后面是注释。

首次连接时 ssh 会显示服务器指纹并让你确认，确认后写进 `~/.ssh/known_hosts`。

## 管理 known_hosts

```bash
ssh-keygen -F github.com        # 查这个主机记了什么
ssh-keygen -R github.com        # 删掉该主机的记录
ssh-keygen -H                   # 把文件里的主机名全部哈希化
```

服务器重装后报 `REMOTE HOST IDENTIFICATION HAS CHANGED`，先确认不是中间人，再用 `-R` 清掉旧记录。

## 其他常用操作

```bash
ssh-keygen -y -f ~/.ssh/id_ed25519 > ~/.ssh/id_ed25519.pub   # 从私钥导出公钥
ssh-keygen -p -f ~/.ssh/id_ed25519                           # 改 passphrase
ssh-keygen -c -C "new comment" -f ~/.ssh/id_ed25519           # 改注释
ssh-keygen -e -f ~/.ssh/id_rsa.pub                           # 转 RFC4716 格式
ssh-keygen -i -f key.rfc4716                                 # 转回 OpenSSH 格式
ssh-keygen -r example.com                                    # 生成 SSHFP 记录
```

## 把公钥交给服务器

```bash
ssh-copy-id user@host
```

等价于把本地公钥追加到对方的 `~/.ssh/authorized_keys`。没装 `ssh-copy-id` 就手动来：

```bash
cat ~/.ssh/id_ed25519.pub | ssh user@host 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'
```

`authorized_keys` 每行一个公钥，行首还能加重限：

```
from="10.0.0.0/8" no-port-forwarding ssh-ed25519 AAAA... me
```

## ssh-agent

passphrase 每次输很烦，agent 把解密的私钥留在内存里：

```bash
eval "$(ssh-agent -s)"          # 启动 agent，设置 SSH_AUTH_SOCK
ssh-add ~/.ssh/id_ed25519       # 加入
ssh-add -l                      # 列出已加载的密钥
ssh-add -t 3600 ~/.ssh/id_ed25519   # 一小时后过期
ssh-add -D                      # 全部移除
```

`ssh-add -c` 会让每次使用都弹确认，安全性更高。agent 转发（`ForwardAgent yes`）能让你跳到第二台机器，但配置不当时别人也能借你的密钥，按需开启。

## 服务端

服务器自己的主机密钥也在 `/etc/ssh/`：

```bash
ssh-keygen -A       # 生成所有缺失的主机密钥
```

它们以 `ssh_host_ed25519_key`、`ssh_host_rsa_key` 命名，客户端首次连接时看到的就是这些公钥的指纹。

## 权限与常见问题

| 问题 | 原因和处理 |
| --- | --- |
| `WARNING: UNPROTECTED PRIVATE KEY FILE` | 私钥权限太宽，`chmod 600` |
| 登录仍要密码 | 公钥没进 `authorized_keys`，或对方 `sshd_config` 禁了公钥登录 |
| `Permission denied (publickey)` | 用 `ssh -v` 看实际提供了哪把钥匙 |
| 老服务器拒绝 ed25519 | 换 `-t rsa -b 4096` |
| 每次都要输 passphrase | 用 ssh-agent，或 `~/.ssh/config` 里配 `AddKeysToAgent yes` |
| 指纹和网上教程对不上 | 教程用了 MD5，新版默认 SHA256，用 `-E md5` 才能对上 |

`~/.ssh` 目录要 700，私钥 600，`authorized_keys` 600。SSH 服务端默认开了 `StrictModes`，权限过宽会直接拒绝使用这把钥匙。

## 私钥格式

新版私钥是 OpenSSH 自己的格式：

```
-----BEGIN OPENSSH PRIVATE KEY-----
base64...
-----END OPENSSH PRIVATE KEY-----
```

公钥则是一行文本，结构固定：

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... comment
```

`AAAAC3NzaC1lZDI1NTE5` 解码出来就是 `ssh-ed25519` 这个算法名，后面才是 32 字节的公钥材料。

老教程里的 `BEGIN RSA PRIVATE KEY` 是 PEM 格式，新版本默认不再生成，需要时用 `-m PEM`。
