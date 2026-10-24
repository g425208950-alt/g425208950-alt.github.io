---
pubDate: 0001-01-01
description: tar指令
title: tar
draft: true
---
`tar czf ~/dst-backup-$(date +%F).tar.gz ~/.klei/DoNotStarveTogether/Cluster_1`
`tar`是打包工具，`czf` 是三个选项合写：`c` 创建新归档，`z` 用 gzip 压缩，`f` 后面接文件名
`-t `list