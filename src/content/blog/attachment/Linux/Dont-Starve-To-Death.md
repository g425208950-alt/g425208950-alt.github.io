---
pubDate: 0001-01-01
title: 饥荒联机指令
draft: true
description: 记录一下指令
---
```
ssh ubuntu@43.142.53.227 'sudo cat /home/steam/dst-backup-2026-10-16.tar.gz' > ~/dst-backup-2026-10-16.tar.gz
```
## 连接
`c_connect("43.142.53.227", 10999,42520)`

## 把本地文件传到服务器

```
scp leveldataoverride.lua ubuntu@43.142.53.227:~/
```

## 删世界
````
rm -rf ~/.klei/DoNotStarveTogether/Cluster_1/Master/save/session
````
