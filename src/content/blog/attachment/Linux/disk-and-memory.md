---
title: 查看磁盘与内存
description: lsblk、df、du、free、vmstat 等查看存储和内存的常用命令
pubDate: 2026-10-24
draft: true
---

这些命令分工不同，先分清再看：

| 想知道              | 用                            |
| ---------------- | ---------------------------- |
| 有几块盘、怎么分区、挂到哪    | `lsblk`、`findmnt`、`fdisk -l` |
| 文件系统还剩多少空间       | `df`                         |
| 哪个目录占地方          | `du`、`ncdu`                  |
| 文件名对应的 UUID / 标签 | `blkid`                      |
| 内存用了多少、还剩多少      | `free`                       |
| 内存压力的实时变化        | `vmstat`、`top`               |

## lsblk

列出块设备，输出是一棵树：磁盘 → 分区 → LVM / 加密 → 文件系统。

```bash
lsblk
```

默认列：

| 列            | 含义                          |
| ------------ | --------------------------- |
| `NAME`       | 设备名，`sda1`、`nvme0n1p1`       |
| `MAJ:MIN`    | 主次设备号                       |
| `RM`         | 是否可移动（1 是 U 盘）               |
| `SIZE`       | 容量                          |
| `RO`         | 是否只读                        |
| `TYPE`       | `disk` / `part` / `lvm` / `crypt` |
| `MOUNTPOINTS` | 挂载点，没挂载就是空                 |

常用写法：

```bash
lsblk -f                              # 带 FSTYPE、UUID、LABEL、挂载点
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS,UUID
lsblk -d -o NAME,SIZE,MODEL,ROTA      # 只看整块盘；ROTA=0 是 SSD，1 是机械盘
lsblk -b -o NAME,SIZE                 # 字节数，方便脚本算
lsblk -p                              # 显示 /dev/ 完整路径
lsblk /dev/nvme0n1                    # 只看某块盘
lsblk -J                              # JSON，给脚本用
```

`-f` 不会显示 swap 以外的未挂载信息，但会显示文件系统类型和 UUID，配 `/etc/fstab` 用正好。

## df

按文件系统统计已用空间，直接从内核拿，速度快。

```bash
df -h
```

| 列          | 含义                        |
| ---------- | ------------------------- |
| `Filesystem` | 设备或 `tmpfs`、`overlay`     |
| `Size`     | 总大小                       |
| `Used`     | 已用                        |
| `Avail`    | 普通用户可用（root 保留 5% 不算）     |
| `Use%`     | 使用率                       |
| `Mounted on` | 挂载点                     |

```bash
df -hT              # 加一列文件系统类型
df -h /home         # 只看某个挂载点
df -i               # inode 使用率，文件名太多会先耗尽
df --total          # 最后加一行合计
df -x tmpfs -x devtmpfs   # 排除临时文件系统
```

看哪个分区快满了：

```bash
df -h | awk '$5+0 >= 80'
```

## du

按目录统计磁盘占用，要自己遍历，慢但准。

```bash
du -sh /var/log                 # 某个目录总共多大
du -sh *                        # 当前目录下每项多大
du -h --max-depth=1 /var | sort -h    # 一层层往下钻
du -ah /var/log | sort -h | tail -20  # 最大的 20 个文件
du -x -h --max-depth=1 /        # 不跨文件系统
```

交互式浏览用 `ncdu`（要另装），能直接按方向键进目录、按 `d` 删。

`df` 显示满、`du` 加起来却对不上，通常是进程还占着已删除的文件：

```bash
sudo lsof +L1 | head
```

## findmnt

查挂载关系和挂载参数，比读 `/proc/mounts` 直观。

```bash
findmnt                  # 树状列出所有挂载
findmnt -T /home         # 这个路径落在哪个挂载点上
findmnt --df             # df 那种表
findmnt -o TARGET,SOURCE,FSTYPE,OPTIONS
findmnt -n -o SOURCE /   # 只要设备名
```

## blkid 与 fstab

`blkid` 读分区上的文件系统元数据，给出 UUID 和 LABEL：

```bash
sudo blkid
sudo blkid /dev/nvme0n1p2
ls -l /dev/disk/by-uuid/
```

`/etc/fstab` 里推荐用 UUID 而不是 `/dev/sda1`，设备名会变，UUID 不会：

```
UUID=xxxx-xxxx  /  ext4  defaults  0 1
```

改完 fstab 先用 `sudo mount -a` 验证，别直接重启。

## 分区表与磁盘健康

```bash
sudo fdisk -l           # 分区表
sudo parted -l          # 同上，信息更全
sudo smartctl -a /dev/nvme0n1   # SMART 健康，装 smartmontools
sudo fstrim -av         # SSD 手动 TRIM
btrfs filesystem usage / # Btrfs 专用，和 df 数字对不上时看这个
```

## free

```bash
free -h
```

| 列           | 含义                                |
| ----------- | --------------------------------- |
| `total`     | 物理内存总量                            |
| `used`      | 已用 = total − free − buff/cache     |
| `free`      | 完全没被碰过的                        |
| `shared`    | tmpfs 等共享内存                       |
| `buff/cache` | 缓存和缓冲，内存紧张时内核会回收                 |
| `available` | 估算的可用量 = free + 可回收缓存，**看这一列**    |

Linux 会把空闲内存拿去做缓存，所以 `free` 很小是正常现象，判断内存够不够看 `available`。

```bash
free -m            # MB
free -w            # 把 buffers 和 cache 拆成两列
free -t            # 加一行合计
free -s 1 -c 5     # 每秒一次，共 5 次
```

对应内核的 `/proc/meminfo`，脚本里取 `MemAvailable`：

```bash
awk '/MemTotal|MemAvailable/ {print}' /proc/meminfo
```

## swap

```bash
free -h              # 看 Swap 行
swapon --show        # 哪些 swap 在用
cat /proc/swaps
zramctl              # 用了 zram 的话看压缩内存
```

`vmstat` 里的 `si` / `so` 是换入换出速率，持续不为 0 说明内存真的不够了。

## 谁在吃内存

```bash
ps aux --sort=-%mem | head
ps -eo pid,comm,%mem,rss --sort=-rss | head
top            # 按 M 按内存排序
htop / btop    # 更好看的版本
smem -r        # 按实际内存排序（要装 smem）
```

`%MEM` 是占物理内存的百分比，`RSS` 是实际驻留的 KB，两者都受共享库影响，别当成精确值。

## vmstat 与整体负载

```bash
vmstat 1 5
```

| 列               | 含义                    |
| --------------- | --------------------- |
| `r`             | 等待 CPU 的进程数           |
| `b`             | 阻塞的进程数                |
| `swpd`          | 已用的 swap               |
| `free`          | 空闲内存                  |
| `buff` / `cache` | 缓冲 / 缓存              |
| `si` / `so`     | 每秒换入 / 换出             |
| `bi` / `bo`     | 每秒块设备读写               |

```bash
uptime          # 负载 1/5/15 分钟，除以核数看
lscpu           # CPU 核数、缓存
nproc           # 逻辑核数
```

## 排查顺序

- 磁盘满：先 `df -h` 找分区，再 `du -h --max-depth=1` 往下钻，最后 `lsof +L1` 看被删还占着的文件。
- 磁盘没满但写不进去：`df -i` 看 inode。
- 内存不足：`free -h` 看 `available` 和 swap，再 `ps --sort=-%mem` 找进程。
- 卡顿但内存和磁盘都正常：`vmstat 1` 看 `r` 和 `si/so`，再 `uptime` 看负载。
