---
title: curl
description: curl 的下载、调试、发请求和上传用法
pubDate: 2026-10-27
draft: true
---

curl 用一条命令发 HTTP 请求、传文件，支持 HTTPS、FTP、SFTP 等一堆协议。默认把响应正文打到 stdout，所以下载文件一定要配 `-o`，不然终端会被二进制内容刷屏。

## 最常用的几条

| 命令 | 作用 |
| --- | --- |
| `curl https://example.com` | 打印网页正文 |
| `curl -o out.html https://example.com` | 存到指定文件 |
| `curl -O https://example.com/a.zip` | 用远端文件名保存 |
| `curl -I https://example.com` | 只看响应头（HEAD） |
| `curl -v https://example.com` | 打印请求、响应全过程 |
| `curl -sS https://example.com` | 静默，但保留报错 |
| `curl -L https://example.com` | 跟随 301/302 跳转 |
| `curl -f https://example.com` | HTTP ≥ 400 时返回非 0，不输出错误页 |

## 下载

```bash
curl -O https://example.com/file.tar.gz          # 保持远端文件名
curl -o renamed.tar.gz https://example.com/f.gz  # 自己命名
curl -O -J -L https://example.com/download       # 用 Content-Disposition 的文件名
curl -C - -O https://example.com/big.iso         # 断点续传
curl --limit-rate 1M -O https://example.com/x     # 限速 1 MB/s
```

`-O` 的文件名取自 URL 最后一段；URL 带查询串时会拿到奇怪的名字，这时用 `-o`。

`-L` 和 `-O` 一起用要小心：跳转后文件名仍按最初的 URL 算，不是最终地址。

## 调试

```bash
curl -i https://example.com        # 响应头 + 正文
curl -I https://example.com        # 只要响应头
curl -v https://example.com        # 完整握手、请求头、响应头
curl -sS -o /dev/null -w '%{http_code}\n' https://example.com   # 只看状态码
```

`-i` 和 `-I` 不同：`-i` 是 GET 并附带头，`-I` 发的是 HEAD 请求，有些服务器会拒绝 HEAD。

`-w` 可以取很多指标：

```bash
curl -sS -o /dev/null -w 'code=%{http_code} time=%{time_total}s size=%{size_download}\n' URL
```

常用变量：`%{http_code}`、`%{time_total}`、`%{time_connect}`、`%{size_download}`、`%{content_type}`、`%{remote_ip}`、`%{url_effective}`、`%{redirect_url}`。新版还支持 `%{json}` 一次输出全部。

`-v` 会暴露 `-H` 里带的 Cookie 和 Authorization，贴日志前记得删。

## 请求头和请求方法

```bash
curl -H 'User-Agent: Mozilla/5.0' -H 'Accept: application/json' URL
curl -H 'Content-Type: application/json' -d '{"name":"a"}' https://api.example.com/x
curl -X DELETE https://api.example.com/item/1
curl -A 'my-client' -e 'https://ref.example.com' URL   # -A User-Agent，-e Referer
```

`-X` 只改请求方法，不改变发不发 body。`-X GET` 配 `-d` 会把数据塞进 body，多数服务端不认，想放查询串用 `-G`：

```bash
curl -G -d 'q=hello' -d 'page=2' https://api.example.com/search
```

中文、空格要编码就用 `--data-urlencode`：

```bash
curl -G --data-urlencode 'q=你好 world' https://api.example.com/search
```

## 发送数据

```bash
curl -d 'a=1&b=2' URL                  # 表单编码 POST
curl -d @data.json -H 'Content-Type: application/json' URL
curl --data-binary @file.bin URL       # 原样发送，不做换行处理
curl -F 'file=@/tmp/a.png' URL         # multipart 上传
curl -F 'name=value' -F 'avatar=@/tmp/a.jpg' URL
curl -T file.bin https://example.com/upload   # PUT 上传
```

`-d` 和 `-F` 的区别：`-d` 是 `application/x-www-form-urlencoded`，`-F` 是 `multipart/form-data`，传文件基本都得用 `-F`。

`-T` 走 PUT，目标 URL 一般要自己写全文件名。

## 认证与 Cookie

```bash
curl -u user:password URL              # Basic 认证
curl -u user URL                       # 只给用户名，交互输入密码
curl -b 'session=abc; theme=dark' URL  # 直接带 Cookie
curl -c cookies.txt -b cookies.txt URL # 读入并写回 Cookie 文件
curl -n URL                            # 从 ~/.netrc 取账号密码
```

`-c` 写文件、`-b` 读文件，登录取 Cookie 的典型组合是 `curl -c c.txt -d 'user=x&pass=y' 登录页`，之后每次带 `-b c.txt`。

## 超时、重试与失败判定

```bash
curl --connect-timeout 5 -m 30 URL     # 连接超时 5s，整体最多 30s
curl --retry 3 --retry-delay 2 URL
curl --retry 3 --retry-connrefused URL # 连接被拒也重试
curl -f --show-error URL || echo failed
```

脚本里判断成败，`-f` 是必须的：不带它时 404 页面照样算成功，退出码是 0。

## 证书与代理

```bash
curl -k URL                            # 跳过证书校验，仅测试用
curl --cacert ./ca.pem URL             # 指定 CA
curl -x http://127.0.0.1:7890 URL      # 走 HTTP 代理
curl -x socks5h://127.0.0.1:1080 URL   # 走 socks5
curl --resolve example.com:443:1.2.3.4 https://example.com   # 绕过 DNS
```

`socks5h` 里的 `h` 表示让代理解析域名，走代理访问外网时通常要用这个。

也可以直接设环境变量 `http_proxy`、`https_proxy`、`all_proxy`、`no_proxy`。

## 输出控制

```bash
curl -s -o /dev/null -w '%{http_code}' URL   # 丢弃正文，只要状态码
curl -s URL | jq .                            # 配 jq 看 JSON
curl -s URL | head -c 200                     # 先看前 200 字节
curl -D headers.txt -o body.html URL          # 头和正文分开存
curl -s --no-progress-meter -O URL            # 不显示进度条
```

批量下载时可以配合 URL 花括号展开：

```bash
curl -O https://example.com/img/{1,2,3}.png
curl -O https://example.com/img/[01-10].png
```

不想让 curl 展开，加 `-g`。

## 配置与退出码

常用参数可以写进 `~/.curlrc`，一行一个，也可以 `-K file` 指定：

```
silent
show-error
location
```

退出码比输出更可靠：

| 码 | 含义 |
| --- | --- |
| 0 | 成功 |
| 3 | URL 格式错误 |
| 6 | 域名解析失败 |
| 7 | 连接失败 |
| 22 | HTTP 错误（配合 `-f`） |
| 28 | 超时 |
| 35 | TLS 握手失败 |
| 52 | 服务端没返回任何数据 |
| 56 | 接收数据失败 |

## 坑

- 不带 `-o` 就把二进制打到终端，不是命令坏了。
- 不带 `-f`，404/500 会被当成功。
- `-L` 不带，跳转链接只返回 302 的空 body。
- `-d` 会自动把方法改成 POST；想强制别的用 `-X`，但别忘了 body 还在。
- 命令里的 `&` 不引号会被 shell 当后台运行，`-d 'a=1&b=2'` 必须加引号。
- `-b` 和 `-c` 不是同一件事，一个读一个写。
- `-k` 只适合自签证书调试，不要写进脚本。

## 和 wget 的区别

| | curl | wget |
| --- | --- | --- |
| 定位 | 通用传输工具，适合 API 调试 | 专注递归下载网站 |
| 输出 | 默认 stdout | 默认写文件 |
| 断点续传 | `-C -` | `-c` |
| 镜像整站 | 不支持 | `-m`、`-r` |
| 跟随跳转 | 要 `-L` | 默认跟随 |

简单记：调接口、发请求用 curl；抓文件、镜像目录用 wget。
