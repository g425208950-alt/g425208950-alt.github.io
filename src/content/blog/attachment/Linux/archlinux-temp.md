---
title: "1"
pubDate: 0011-01-01
description: "1"
draft: true
---

## 装之前的几个决定

### 复用 ESP，不新建

UEFI 固件不认分区内容，只认 NVRAM 里的一条启动项，每条启动项指向某个分区上的一个 `.efi` 文件。所以多个系统共用一块 ESP 是标准做法，各占一个子目录：Windows 用 `\EFI\Microsoft`，GRUB 用 `\EFI\GRUB`。新建第二块 ESP 反而会在固件里多出一套启动项，更难管理。

260 MiB 够用，因为内核和 initramfs 都放在根分区的 `/boot`，ESP 里只有 GRUB 的几个 `.efi` 和模块。

### /boot 不单独分区

GRUB 自带的 ext4 驱动能直接读 `/boot/vmlinuz-linux` 和 initramfs，没必要为 `/boot` 再切一块。少一个分区就少一处挂载失败的可能。

### 用 GRUB，不用 systemd-boot

systemd-boot 不调用 os-prober，Windows 的菜单项得手写；GRUB 的 `grub-mkconfig` 会自动探测并写进菜单。

### /home 独立

p7 单独挂 `/home`。以后重装系统只要把 p7 挂回去，用户文件一个不用搬。

### 不建 swap 分区

64 GiB 内存日常用不到 swap。真需要时用一个 swap 文件，随时加、随时删，不用重新分区。

## 关 Secure Boot，确认是 UEFI 启动

Arch 的安装镜像没有微软签名，Secure Boot 开着时固件会直接拒绝执行，屏幕报 Secure Boot violation。先在 BIOS 里把 `Security → Secure Boot` 改成 Disabled，F10 保存。

从 U 盘启动后，第一件事是确认固件模式：

```bash
cat /sys/firmware/efi/fw_platform_size
```

这个文件只在 UEFI 模式下存在，内容是 64 表示 x86_64 UEFI。输出 64 才继续。

如果报 No such file or directory，说明走的是 Legacy/BIOS 启动，后面 `grub-install --target=x86_64-efi` 会失败，等于白装。回 F12 菜单，选那个不带 "BIOS" 字样的 U 盘条目。

## 联网和对时

```bash
ping -c 3 archlinux.org
```

`-c 3` 表示只发 3 个包。这条同时验证 DNS 解析和外网连通。

Wi-Fi 用 iwctl（AX211 的 iwlwifi 驱动在 linux-firmware 里，安装介质已经带了）：

```bash
iwctl
station wlan0 scan
station wlan0 get-networks
station wlan0 connect "你的WiFi名"
exit
```

iwctl 是个交互式 shell，这些命令在它里面敲。`scan` 只触发扫描，不显示结果；`get-networks` 列出扫到的 SSID；`connect` 时第一次会让你输密码，输入不回显。

网卡名不一定是 wlan0。报 "No station found" 就先 `ip link` 看无线接口叫什么。

```bash
timedatectl
```

看 `System clock synchronized` 是不是 yes。时间偏差太大会让下载的包签名校验失败，报 "invalid or corrupted package (PGP signature)"，看起来像镜像坏了，其实是时钟错了。

## 看清磁盘

```bash
lsblk -f
fdisk -l /dev/nvme0n1
```

`lsblk -f` 按树形列出设备，多显示三样：FSTYPE、UUID、MOUNTPOINTS。`fdisk -l` 显示分区表细节：每个分区的起止扇区和分区类型。

核对 p1 是 260M EFI、p3 是 300G、p4 是 500G、p5 是 1.95G，并且 p4 和 p5 之间有一段约 151 GiB 的空闲。fdisk 不会把空闲区单独列出来，要看 p4 的 End 和 p5 的 Start 之间的差。

对不上就停在这里。

## 分区：fdisk 的每一步

```bash
fdisk /dev/nvme0n1
```

进去后是交互界面，每次按一个键：

`p` 打印当前分区表，先和上一步核对。
`n` 新建分区，分区号输入 6。
First sector 直接回车，用默认值。默认值就是 p4 之后的第一个可用扇区；如果不是，说明中间还有别的东西，停下。
Last sector 输入 `+45G`。注意这是"从起始扇区往后 45 GiB"，不是"到磁盘第 45G 的位置"。fdisk 的 `G` 是 1024 进制，正好 45 GiB。
`n` 再建第二个，分区号 7。
起始扇区回车，结束扇区回车，吃掉剩余空间（约 106.64 GiB）。
`p` 再核对：p6 45G、p7 约 106G，都在 p4 之后、p5 之前。
`w` 写入磁盘。

几个要点：

- 按 `w` 之前，所有改动只在内存里的分区表。按 `q` 退出等于全部放弃，磁盘上什么都没变。
- 误按了 `d`（删除）时，在它问"删哪个分区"之前按 `q` 退出，重新进 fdisk，别继续。
- 整个流程没有 `d`，不会删任何已有分区。
- GPT 上新建分区的默认类型就是 "Linux filesystem"，不用再按 `t` 改。
- `w` 会同时重写主分区表和磁盘末尾的备份表，写成功会提示 "The partition table has been altered"，内核同时重读分区表。

写入后：

```bash
lsblk -f
```

应该看到 nvme0n1p6 和 nvme0n1p7，FSTYPE 一栏是空的。没出现就 `partprobe /dev/nvme0n1` 让内核重读。

## 格式化

```bash
mkfs.ext4 -L root /dev/nvme0n1p6
mkfs.ext4 -L home /dev/nvme0n1p7
```

`-L` 设置卷标（写在超级块里）。后面可以用 `LABEL=root` 挂载，但 fstab 用的是 UUID，卷标只方便人看。

ext4 默认给 root 保留 5% 的空间（45 GiB 里约 2.25 GiB），普通用户写不进去，防止某个进程把系统盘写满、连日志都写不下。嫌多可以加 `-m 1` 改成 1%。

绝对不要对 p1 执行任何 mkfs。那会重建 EFI 分区的文件系统，Windows 的引导文件全在里面。

提示 "contains a ext4 filesystem" 时先确认设备名有没有打错，别直接加 `-F` 强来。

## 挂载

```bash
mount /dev/nvme0n1p6 /mnt
mkdir -p /mnt/home /mnt/efi
mount /dev/nvme0n1p7 /mnt/home
mount /dev/nvme0n1p1 /mnt/efi
```

顺序不能反：先挂 `/mnt`，再在它下面建挂载点、挂子分区，反过来会把内容盖住。

```bash
findmnt /mnt
```

按树形打印挂载关系。预期三行：`/mnt` 是 p6 的 ext4，`/mnt/home` 是 p7 的 ext4，`/mnt/efi` 是 p1 的 vfat。

挂 ESP 有三个用处：`grub-install` 要往里面写文件、os-prober 要读 Windows 的引导文件、genfstab 要生成 `/efi` 那一行。

顺手备份分区表：

```bash
fdisk -l /dev/nvme0n1 > /mnt/gpt-info.txt
sgdisk --backup=/mnt/gpt-backup.bin /dev/nvme0n1
```

第一行是给人看的文本；第二行是二进制备份，含每个分区的 GUID 和属性，出问题能整表还原。文件存在新根分区里，装完系统就在 `/gpt-backup.bin`。

## 换镜像源

```bash
nano /etc/pacman.d/mirrorlist
```

在最顶部加一行，放在所有现有 Server 之前：

```
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
```

`$repo` 和 `$arch` 是 pacman 的占位符，下载时替换成 `core/os/x86_64` 之类。pacman 按列表顺序从上往下试，快的放最前面，原列表留着当后备。

nano 保存：Ctrl+O，回车确认文件名，Ctrl+X 退出。

pacstrap 用的是安装介质里的这份 mirrorlist。~~如果 chroot 进新系统后又看到默认列表，把这一行再加一次（pacman-mirrorlist 包自带的是默认内容）。~~

pacstrap 默认会把安装介质的 mirrorlist 拷进新系统，chroot 后通常不用重加；只有加了 `-M` 才需要

## 装基础系统

```bash
pacstrap -K /mnt base base-devel linux linux-firmware intel-ucode \
  vim sudo networkmanager grub efibootmgr os-prober dosfstools \
  mtools ntfs-3g man-db man-pages bash-completion
```

第一个参数是目标根目录，后面都是包名。pacstrap 做三件事：把包解压到 `/mnt`、在 `/mnt` 里跑包的安装脚本、最后生成 initramfs。

`-K` 让 pacstrap 在目标系统里初始化一份干净的 pacman keyring，避免把安装介质的密钥状态带进去。

各个包的作用：

- `base` 最小可用系统，不含内核（内核在 `linux` 里）
- `base-devel` 编译工具链（gcc、make、pkg-config），以后 makepkg 和 AUR 要用
- `linux` 内核本体
- `linux-firmware` 硬件固件，AX211 的 `iwlwifi-*.ucode` 在里面
- `intel-ucode` Intel CPU 微码，由 GRUB 以 initrd 方式加载
- `vim` 编辑器
- `sudo` 给普通用户提权
- `networkmanager` 网络管理，装完的系统靠它联网
- `grub` 引导器
- `efibootmgr` 查看和修改 NVRAM 启动项
- `os-prober` 让 grub-mkconfig 发现 Windows
- `dosfstools`、`mtools` 处理 vfat（ESP 就是 vfat）
- `ntfs-3g` 挂载 D 盘的 NTFS
- `man-db`、`man-pages` 手册页
- `bash-completion` 命令补全

耗时五到二十分钟，最后跑一遍 mkinitcpio 后回到提示符。中途断了直接重跑同一条命令，pacstrap 可以续。

卡住不动就另开终端 `ping mirrors.tuna.tsinghua.edu.cn`，看源通不通。

## 生成 fstab

```bash
genfstab -U /mnt >> /mnt/etc/fstab
cat /mnt/etc/fstab
```

`-U` 表示用 UUID 而不是设备路径。fstab 是开机自动挂载的配置表；`/dev/nvme0n1p6` 这种名字在加新硬盘或 BIOS 顺序变化后可能变，UUID 跟着文件系统走，不会变。

`>>` 是追加。新系统的 `/etc/fstab` 自带几行注释，用 `>` 会覆盖掉。

预期三行：`/`、`/home`、`/efi`，都以 `UUID=` 开头，`/efi` 那行类型是 vfat，并带 `umask` 之类的选项。

没有 `/efi` 那行说明挂载漏了，退出 chroot 重挂再重跑。

## 进新系统

```bash
arch-chroot /mnt
```

arch-chroot 不是普通 chroot。它先把 `/proc`、`/sys`、`/dev`、`/run` 挂进目标系统，把安装介质的 `/etc/resolv.conf` 拷过去，然后才切根目录。少这几步，进去之后 pacman 和网络都会有问题。

提示符变成 `[root@archiso /]#`。从这里开始，路径都是新系统的，`/` 就是 p6。

## 时区、语言、主机名

```bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
hwclock --systohc
```

`ln -sf` 把 `/etc/localtime` 指到时区数据文件，`-f` 表示已存在就覆盖。系统里所有依赖本地时间的东西都读这个链接。

`hwclock --systohc` 把系统时间写回硬件时钟，默认按 UTC 写。这和 Windows 的默认做法冲突：Windows 把硬件时钟当本地时间读，所以两个系统来回切会差 8 小时，后面用一条注册表命令解决。

```bash
nano /etc/locale.gen
```

找到 `en_US.UTF-8 UTF-8` 和 `zh_CN.UTF-8 UTF-8`，去掉行首的 `#`，保存退出。

```bash
locale-gen
echo "LANG=en_US.UTF-8" > /etc/locale.conf
echo "KEYMAP=us" > /etc/vconsole.conf
echo "arch" > /etc/hostname
```

`locale.gen` 是"要生成哪些 locale"的清单，`locale-gen` 照着它编译；`locale.conf` 决定当前用哪个；`vconsole.conf` 决定虚拟终端的键盘布局。

系统语言先设英文。纯命令行的 TTY 没有中文字体，设成 zh_CN.UTF-8 会显示成方块；zh_CN 的 locale 先生成出来，装了图形界面再改 `LANG`。

`>` 是覆盖写，直接建立文件，不用先 touch。

## 网络服务

```bash
systemctl enable NetworkManager
systemctl enable systemd-timesyncd
```

`enable` 只建一条开机自启的符号链接，不立刻启动服务（chroot 里也没有 systemd 在跑）。装好的系统不是安装介质，网络不会自动配好，所以这两个必须显式打开。

systemd-timesyncd 负责 NTP 对时，没有它新系统的时间可能一直不准。

没加 `--now`：在 chroot 里 now 没意义，重启后才会真正启动。

## 用户与 sudo

```bash
passwd
```

给 root 设密码，输两遍，屏幕不显示任何字符。别跳过，否则重启后 root 登不进去。

```bash
useradd -m -G wheel -s /bin/bash 你的用户名
passwd 你的用户名
```

`-m` 建家目录 `/home/用户名`，`-G wheel` 加进 wheel 组，`-s` 指定登录 shell。

```bash
visudo
```

找到 `# %wheel ALL=(ALL:ALL) ALL`，删掉行首的 `#`，保存退出。这行给 wheel 组授权，组里的用户才能用 sudo。

用 visudo 而不是直接编辑 `/etc/sudoers`：它保存前会检查语法并加锁，语法错了 sudo 会彻底不能用。

## 重新生成 initramfs

```bash
mkinitcpio -P
```

`-P` 表示按 `/etc/mkinitcpio.d/` 里的 preset 全部重新生成，linux 内核对应两套：`initramfs-linux.img` 和 `initramfs-linux-fallback.img`。

initramfs 是启动早期加载到内存的小根文件系统，负责在真正的根分区挂上之前，先加载 ext4 模块、把根分区挂起来。内核不带硬盘驱动，这里缺了系统就起不来。

以后改 `/etc/mkinitcpio.conf`（比如加 HOOKS）必须重跑一次，否则改动不生效。

预期最后一行 `==> Image generation successful`。报错就停。

## 装 GRUB

这是整个安装里唯一会写 ESP 的一步。

```bash
nano /etc/default/grub
```

加一行，已有就改成 false：

```
GRUB_DISABLE_OS_PROBER=false
```

GRUB 从 2.06 起默认禁用 os-prober，不改这行，`grub-mkconfig` 不会探测 Windows，菜单里就只有 Arch。

```bash
grub-install --target=x86_64-efi --efi-directory=/efi --bootloader-id=GRUB
```

`--target=x86_64-efi` 装 64 位 UEFI 的模块；`--efi-directory=/efi` 告诉它 ESP 挂在哪；`--bootloader-id=GRUB` 决定 ESP 里的目录名（`/efi/EFI/GRUB`）和 NVRAM 里启动项的显示名。

不要加 `--removable`。它会把文件写到 `\EFI\BOOT\BOOTX64.EFI`，那是固件的兜底路径，和 Windows 的备用引导重名。

预期输出 `Installation finished. No error reported.`

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

扫 `/boot` 里的内核、调用 os-prober 找其他系统、读 `/etc/default/grub`，拼出菜单写进 `/boot/grub/grub.cfg`。`-o` 指定输出文件；`/boot` 没单独分区，所以这个文件在根分区里。

预期出现两行：

```
Found Windows Boot Manager on /dev/nvme0n1p1@/EFI/Microsoft/Boot/bootmgfw.efi
Found linux image: /boot/vmlinuz-linux
```

```bash
efibootmgr -v
```

看 NVRAM 里的启动项，应该同时有 Windows Boot Manager 和 GRUB 两条。`-v` 显示每条指向的 `.efi` 路径。

### 没探测到 Windows 时

先单独跑一次看输出：

```bash
os-prober
```

再确认 Windows 的引导文件在不在：

```bash
ls /efi/EFI/Microsoft/Boot/bootmgfw.efi
```

文件在但 os-prober 没输出，就手写一个菜单项。先取 ESP 的 UUID：

```bash
blkid -s UUID -o value /dev/nvme0n1p1
```

得到形如 `9C1A-2B3C` 的值，然后：

```bash
nano /etc/grub.d/40_custom
```

在末尾追加（UUID 换成查到的）：

```
menuentry "Windows Boot Manager" {
    insmod part_gpt
    insmod fat
    insmod chain
    search --no-floppy --fs-uuid --set=root 9C1A-2B3C
    chainloader /EFI/Microsoft/Boot/bootmgfw.efi
}
```

`insmod` 加载读 GPT 分区表、读 FAT 文件系统、链式加载所需的模块；`search` 按 UUID 找到 ESP 并设为 GRUB 的根（不要写死 `hd0,gpt1`，分区号会变，UUID 不会）；`chainloader` 把控制权交给 Windows 的 `bootmgfw.efi`。

保存后重跑 `grub-mkconfig -o /boot/grub/grub.cfg`。

实在不行也不影响使用：开机按 F12 直接选 Windows Boot Manager 一样能进，只是不经过 GRUB 菜单。

## 退出与首次启动

```bash
exit
umount -R /mnt
reboot
```

`exit` 退出 chroot。`umount -R` 递归卸载，先卸 `/mnt/home` 和 `/mnt/efi` 再卸 `/mnt`；顺序反了会报 target is busy。

reboot 后拔掉 U 盘。

如果开机直接进了 Windows，说明固件把 Windows 排在前面。两种办法：F12 每次手选 GRUB，或者在 Arch 里把 GRUB 调到第一位：

```bash
efibootmgr
sudo efibootmgr -o 0000,0001
```

`-o` 后面按想要的顺序写 Boot 编号，先 `efibootmgr` 看清 0000 和 0001 分别是谁。

## 首次登录后

用建好的普通用户登录。

```bash
sudo pacman -Syu
```

第一次同步软件包数据库并升级，之后日常也用它。

要补 swap 文件：

```bash
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap defaults 0 0' | sudo tee -a /etc/fstab
```

`fallocate` 在 ext4 上直接分配连续块，比 `dd` 快；btrfs 不能用它，得用 `btrfs filesystem mkswapfile`。

`chmod 600` 是必须的，权限太宽 `swapon` 会拒绝（insecure permissions）。

最后一行用 `tee -a` 而不是 `sudo echo >>`：sudo 只对 echo 生效，重定向由当前 shell 执行，会因权限不足失败。

验证用 `free -h` 或 `swapon --show`；以后不想要就 `swapoff /swapfile`，再删掉文件和 fstab 里那行。

回到 Windows 解决时间差，管理员 PowerShell：

```powershell
reg add "HKLM\SYSTEM\CurrentControlSet\Control\TimeZoneInformation" /v RealTimeIsUniversal /t REG_DWORD /d 1 /f
```

`/v` 是值名，`/t REG_DWORD` 是类型，`/d 1` 是数据，`/f` 表示已存在就覆盖。这条让 Windows 也把硬件时钟当 UTC 读，两个系统就一致了。改完重启生效；开着快速启动的话，先彻底关机一次再开。

## 出事之后的退路

进不去系统：开机按 F12，选 Windows Boot Manager。C 盘数据和 Windows 引导文件全程没碰过，这个入口一定在。

GRUB 装失败：先从 Windows 进，再插 U 盘重来，从看盘那一步开始，直接跳到装 GRUB。

分区表出问题：如果当时存了 `gpt-backup.bin`，在安装介质里执行：

```bash
sgdisk --load-backup=/mnt/gpt-backup.bin /dev/nvme0n1
```

Windows 引导彻底丢了：用 Windows 安装介质启动，进命令行执行：

```
bcdboot C:\Windows /s S: /f UEFI
```

`S:` 是那块 260M EFI 分区在 Windows PE 里的盘符。

Secure Boot：现在关着。以后游戏反作弊要求打开，可以用 sbctl 给 Arch 自签名，保留微软密钥，两个系统都能过。那是装完稳定运行之后的事。

## 参考

- [Installation guide](https://wiki.archlinux.org/title/Installation_guide)
- [Dual boot with Windows](https://wiki.archlinux.org/title/Dual_boot_with_Windows)
- [GRUB](https://wiki.archlinux.org/title/GRUB)
- [清华镜像源使用帮助](https://mirrors.tuna.tsinghua.edu.cn/help/archlinux/)