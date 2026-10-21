---
title: 学习powershell 基本用法
description: 只是为了好玩
pubDate: 2026-10-02
draft: true
aliases:
  - pwsh
---

```powershell
Get-Disk | Select-Object Number,FriendlyName,PartitionStyle,@{n='SizeGB';e={[math]::Round($_.Size/1GB,1)}} | Format-Table -AutoSize
Get-Partition | Select-Object DiskNumber,PartitionNumber,DriveLetter,Type,@{n='SizeGB';e={[math]::Round($_.Size/1GB,1)}} | Format-Table -AutoSize
Get-Volume | Select-Object DriveLetter,FileSystemLabel,FileSystem,@{n='SizeGB';e={[math]::Round($_.Size/1GB,1)}},@{n='FreeGB';e={[math]::Round($_.SizeRemaining/1GB,1)}} | Format-Table -AutoSize
"firmware_type=$env:firmware_type"
try { "SecureBoot=" + (Confirm-SecureBootUEFI) } catch { "SecureBoot=非UEFI或无法读取" }
Get-BitLockerVolume | Select-Object MountPoint,VolumeStatus,ProtectionStatus,EncryptionPercentage | Format-Table -AutoSize
powercfg /a
Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model,@{n='RAMGB';e={[math]::Round($_.TotalPhysicalMemory/1GB,1)}} | Format-List
Get-CimInstance Win32_BIOS | Select-Object Manufacturer,Name,SMBIOSBIOSVersion,ReleaseDate | Format-List
Get-CimInstance Win32_VideoController | Select-Object Name | Format-Table -AutoSize
Get-NetAdapter | Select-Object Name,InterfaceDescription,Status | Format-Table -AutoSize
```

## 测试TCP连接
`Test-NetConnection github.com -Port 443`


10808是V2rayN的SOCKS 端口
10809是V2rayN的HTTP端口
```
curl.exe -x socks5h://127.0.0.1:10808 -I https://github.com
```
```端口只是地址的一部分，不承载协议。`127.0.0.1:10808` 只说明“往哪个端点发”，发出去的字节长什么样、对方怎么理解，得靠协议。你一旦 connect 上去开始发包，就必须有双方都认的格式，否则对面收到一串字节不知道该怎么解释。

SOCKS5 的格式是定死的。客户端连上后先发 `05 01 00`：版本 5、支持的认证方法数量 1、方法“无认证”；服务器回 `05 00` 表示同意；接着客户端发 CONNECT 请求，带上目标地址类型（域名还是 IPv4/IPv6）、地址和端口；服务器再回一个成功应答，之后才开始转发。这些字节的含义就是协议。没有它，代理客户端只能把请求当垃圾丢掉。

所以“本地也有协议”是因为本地这一层是**应用层可感知**的：git 和 curl 自己懂 SOCKS5/HTTP 代理，它们连 10808 时会主动说这套话。你的程序如果不懂，就连不上，这也是为什么有的软件必须单独配代理。

对比另一条路：TUN 模式（虚拟网卡加路由劫持）。那种模式下应用以为自己直连 google.com，内核把 IP 包送进虚拟网卡，代理软件自己实现 TCP/IP 栈再转发出去。这时本地确实没有 SOCKS 这种应用层约定，但你换来的是装驱动、改路由、抓整机流量，复杂度不在一个量级。浏览器和 git 走系统代理/SOCKS 是更轻的做法。

最后澄清一句，“没有用到协议”的连接是不存在的，哪怕直连 443 也要跑 TCP 和 IP，只是应用层恰好没有额外约定。所以问题不是“有没有协议”，而是“双方有没有同一套约定”。```

```
按下面走，PowerShell 里执行。

装 pandoc，Windows 用 winget：

winget install --id JohnMacFarlane.Pandoc -e
pandoc --version
写源文件，比如 report.md。公式用 $...$ 行内、$$...$$ 独立，图片用 ![](img/a.png)，标题用 #，列表用 -。

转换：
pandoc report.md -o report.docx
公式会转成 Word 原生公式对象，不是图片。带目录加 --toc，编号加 --number-sections。

想要自己的样式，先导出一份模板：
pandoc --print-default-data-file reference.docx -o ref.docx
在 Word 里改 ref.docx 的标题、正文、代码等样式，存好，之后：

pandoc report.md -o report.docx --reference-doc=ref.docx
需要 PDF 就先装 TeX 引擎，中文用 xelatex：

winget install --id MiKTeX.MiKTeX -e
pandoc report.md -o report.pdf --pdf-engine=xelatex -V CJKmainfont="Microsoft YaHei"
最后在 Word 里打开 docx 微调页边距、图注位置，这部分手改最快。
关键一条：以后让模型产出时只要它写 report.md，不要让它直接生成 docx。你这次的麻烦全在“让程序去操作 Word”上，换成文本源文件后，模型改内容就是改几行 markdown，不会再有段落索引、分节符那类问题。
```

## 删快速启动
```powershell
powercfg /h off
```