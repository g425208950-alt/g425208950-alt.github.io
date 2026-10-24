---
pubDate: 2026-10-03
title: Arch Linux学习
description: 好想学会。。。
aliases:
  - arch
draft: true
---
## 概要

我的D盘空间不是很大，但是最近硬盘都很贵，所以我只能在D盘末尾分了150G，为了装Arch Linux我也是专门买了一个U盘，在U盘里下载一个arch的镜像，然后在开机时按F12或F2把U盘放到启动项的顶部，启动之后会把U盘当做一个临时操作系统来给实际电脑上的D盘（当然也可以是其他盘）分区，用`mkfs`给Linux创建文件系统，挂载到`/mnt`，然后`pacstrap`给Arch装

## 启动流程

装 Arch 之前，固件启动的第一个程序是 Windows 的 Boot Manager：

```text
固件 → NVRAM 里 Boot0000 = Windows Boot Manager
     → ESP: /EFI/Microsoft/Boot/bootmgfw.efi
     → 读同目录下的 BCD（启动配置数据库，记录内核在哪）
     → 加载 winload.efi
     → winload 加载 ntoskrnl.exe 和驱动
     → Windows 内核接管
```

`bootmgfw.efi` 是 Windows 的 Boot Manager，和 GRUB 是同一层的角色；BCD 相当于 GRUB 的 `grub.cfg`。

装完 Arch 之后，链子中间插进 GRUB，但 Windows 那半截一个字没动：

```text
固件 → BootOrder 第一条（GRUB）
     → ESP: /EFI/GRUB/grubx64.efi
     → 读 p6 上的 /boot/grub/grub.cfg，出菜单
       ├─ 选 Arch    → 加载 vmlinuz-linux + initramfs → 内核 → systemd
       └─ 选 Windows → chainloader 执行 bootmgfw.efi
                        → 后面的 BCD → winload → ntoskrnl 完全照旧
```

区别只有两处：固件启动的第一个程序从 `bootmgfw.efi` 换成了 `grubx64.efi`；Windows 的入口从"固件直接调用"变成"GRUB 替固件调用"。`chainloader` 做的就是"把另一个 `.efi` 当程序执行"，和固件当初执行 GRUB 是同一套机制，所以 BCD、winload 那一串照常工作。

这也解释了两件事：开机按 F12 选 Windows Boot Manager 一定能进 Windows，因为那条路完全绕过 GRUB；重装 Arch 或改 fstab 不影响 Windows 启动，因为它依赖的东西在 ESP 的 `\EFI\Microsoft` 里，而安装过程只往 ESP 写了 `\EFI\GRUB` 这个目录。

两个附带变化。GRUB 菜单默认停五秒（`/etc/default/grub` 里的 `GRUB_TIMEOUT`），单独启动 Windows 时没有这一段。另外 Windows 大版本更新有时会重写 `bootmgfw.efi` 并把 NVRAM 的启动顺序改回自己，表现是开机直接进 Windows、看不到 GRUB 菜单——不是 Arch 坏了，按 F12 选 GRUB，或者在 Arch 里 `efibootmgr -o` 把顺序调回来。

## 命令

Arch 的安装镜像没有微软签名，Secure Boot 开着时固件会直接拒绝执行，屏幕报 Secure Boot violation。开机的时候连按F2进入 Setup，F12进入Boot Menu，按哪个都行。
先在 BIOS 里把 `Security → Secure Boot` 改成 Disabled，F10 保存。不然系统

```bash
cat /sys/firmware/efi/fw_platform_size
```
看一下是不是UEFI模式启动的U盘

### 看磁盘内容

```bash
lsblk -f
fdisk -l /dev/nvme0n1
```

lsblk是*list block devices* ，只读指令

fdisk是分区表编辑器，`-l`选项是只读模式

### 分区

这个是正式开始分区，指令如下：

```bash
fdisk /dev/nvme0n1
```

`p` 打印当前分区表，先和上一步核对。  
`n` 新建分区，分区号输入 6。  
First sector 直接回车，用默认值。默认值就是 p4 之后的第一个可用扇区；如果不是，说明中间还有别的东西，停下。  
Last sector 输入 `+45G`。注意这是"从起始扇区往后 45 GiB"，不是"到磁盘第 45G 的位置"。fdisk 的 `G` 是 1024 进制，正好 45 GiB。  
`n` 再建第二个，分区号 7。  
起始扇区回车，结束扇区回车，吃掉剩余空间（约 106.64 GiB）。  
`p` 再核对：p6 45G、p7 约 106G，都在 p4 之后、p5 之前。  
`w` 写入磁盘。

- 按 `w` 之前，所有改动只在内存里的分区表。按 `q` 退出等于全部放弃，磁盘上什么都没变。
- 误按了 `d`（删除）时，在它问"删哪个分区"之前按 `q` 退出，重新进 fdisk，别继续。
- 整个流程没有 `d`，不会删任何已有分区。
- GPT 上新建分区的默认类型就是 "Linux filesystem"，不用再按 `t` 改。
- `w` 会同时重写主分区表和磁盘末尾的备份表，写成功会提示 "The partition table has been altered"，内核同时重读分区表。

### 格式化

```bash
mkfs.ext4 -L root /dev/nvme0n1p6
mkfs.ext4 -L home /dev/nvme0n1p7
```

`-L` 设置卷标（写在超级块里）。后面可以用 `LABEL=root` 挂载，但 fstab 用的是 UUID，卷标只方便人看。

mkfs 是 `make filesystem`,`mkfs.ext4` 是它的一个具体实现。实际上 `mkfs.ext4` 是个指向 `mke2fs` 的包装（脚本或链接），所以真正的执行者是 `mke2fs -t ext4`；输出第一行也是 `mke2fs 1.47.x` 而不是 mkfs。

### 挂载

```bash
mount /dev/nvme0n1p6 /mnt
mkdir -p /mnt/home /mnt/efi
mount /dev/nvme0n1p7 /mnt/home
mount /dev/nvme0n1p1 /mnt/efi
```

顺序不能反：先挂 `/mnt`，再在它下面建挂载点、挂子分区，反过来会把内容盖住。

```bash
findmnt /mnt
```

检查挂载

顺手备份分区表：

```bash
fdisk -l /dev/nvme0n1 > /mnt/gpt-info.txt
sgdisk --backup=/mnt/gpt-backup.bin /dev/nvme0n1
```

第一行是给人看的文本；第二行是二进制备份，含每个分区的 GUID 和属性，出问题能整表还原。文件存在新根分区里，装完系统就在 `/gpt-backup.bin`。

### 换镜像源

```bash
nano /etc/pacman.d/mirrorlist
```

在最顶部加一行，放在所有现有 Server 之前：

```text
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
```

`$repo` 和 `$arch` 是 pacman 的占位符，下载时替换成 `core/os/x86_64` 之类。pacman 按列表顺序从上往下试，快的放最前面，原列表留着当后备。

nano 保存：Ctrl+O，回车确认文件名，Ctrl+X 退出。

pacstrap 用的是安装介质里的这份 mirrorlist。如果 chroot 进新系统后又看到默认列表，把这一行再加一次（pacman-mirrorlist 包自带的是默认内容）。

### 装基础系统

```bash
pacstrap -K /mnt base base-devel linux linux-firmware intel-ucode \
  vim sudo networkmanager grub efibootmgr os-prober dosfstools \
  mtools ntfs-3g man-db man-pages bash-completion
```

`-K` 让 pacstrap 在目标系统里初始化一份干净的 pacman keyring，避免把安装介质的密钥状态带进去。

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

### 生成 fstab

```bash
genfstab -U /mnt >> /mnt/etc/fstab
cat /mnt/etc/fstab
```

`-U` 表示用 UUID 而不是设备路径。fstab 是开机自动挂载的配置表；`/dev/nvme0n1p6` 这种名字在加新硬盘或 BIOS 顺序变化后可能变，UUID 跟着文件系统走，不会变。

`>>` 是追加。新系统的 `/etc/fstab` 自带几行注释，用 `>` 会覆盖掉。

预期三行：`/`、`/home`、`/efi`，都以 `UUID=` 开头，`/efi` 那行类型是 vfat，并带 `umask` 之类的选项。
## 进新系统

```bash
arch-chroot /mnt
```

arch-chroot 不是普通 chroot。它先把 `/proc`、`/sys`、`/dev`、`/run` 挂进目标系统，把安装介质的 `/etc/resolv.conf` 拷过去，然后才切根目录。少这几步，进去之后 pacman 和网络都会有问题。

提示符变成 `[root@archiso /]#`。从这里开始，路径都是新系统的，`/` 就是 p6。

### 时区、语言、主机名

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

### 网络服务

```bash
systemctl enable NetworkManager
systemctl enable systemd-timesyncd
```

`enable` 只建一条开机自启的符号链接，不立刻启动服务（chroot 里也没有 systemd 在跑）。装好的系统不是安装介质，网络不会自动配好，所以这两个必须显式打开。

systemd-timesyncd 负责 NTP 对时，没有它新系统的时间可能一直不准。

没加 `--now`：在 chroot 里 now 没意义，重启后才会真正启动。

### 用户与 sudo

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

### 重新生成 initramfs

```bash
mkinitcpio -P
```
`mkinitcpio`是`make init cpio`，cpio本身是copy in/out的缩写，一种老式归档格式（和tar类似）产出是initramfs(initial RAM filesystem)

`-P` 表示按 `/etc/mkinitcpio.d/` 里的 preset (即-P) 全部重新生成，linux 内核对应两套：`initramfs-linux.img` 和 `initramfs-linux-fallback.img`。

>所以名字拆开是：脚本叫 mkinitcpio，产出叫 initramfs（initial RAM filesystem）——一个 cpio 归档，通常再用 zstd 或 gzip 压一下，写成 `/boot/initramfs-linux.img`。内核启动时把它解压到内存里的 tmpfs，执行里面的 `/init`，由它挂上真正的根分区，然后切过去。

initramfs 是启动早期加载到内存的小根文件系统，负责在真正的根分区挂上之前，先加载 ext4 模块、把根分区挂起来。内核不带硬盘驱动，这里缺了系统就起不来。

预期最后一行 `==> Image generation successful`。报错就停。



### 装 GRUB

这是整个安装里唯一会写 ESP 的一步。

```bash
nano /etc/default/grub
```

加一行，已有就改成 false：

```text
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

```text
Found Windows Boot Manager on /dev/nvme0n1p1@/EFI/Microsoft/Boot/bootmgfw.efi
Found linux image: /boot/vmlinuz-linux
```

```bash
efibootmgr -v
```

看 NVRAM 里的启动项，应该同时有 Windows Boot Manager 和 GRUB 两条。`-v` 显示每条指向的 `.efi` 路径。

### 退出与首次启动

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

### 首次登录后

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

## 知识点

### NVRAM

NVRAM Non-Volatile RAM是主板上的一块特殊存储，由UEFI固件独占管理。NVRAM存的是固件变量，启动项，启动顺序（Bootorder），Secure Boot开关和密钥，超时设置之类的东西。传统的BIOS把这套设置放在CMOS（Complementary Metal-Oxide-Semiconductor）里，和上述NVRAM策略都能实现断电不丢，但是固件更新或者请CMOS时可能被重置。

### UEFI

UEFI是主板上的一段固件程序，负责“从开机到交出控制权”这一段。通电后初始化CPU、内存、PCle和存储，然后按NVRAM的启动顺序找启动项，从对应分区的ESP里加载一个.efi文件，把控制权交出去。

### GRUB

GRUB。`grub-install`可以把GRUB自己的EFI程序写进ESP，并在NVRAM登记一条指向它的启动项。

### Secure Boot

Secure Boot 是 UEFI 固件的一个可选开关：开机加载某个 `.efi` 之前，先检查它的数字签名，签名不在固件信任名单里就拒绝执行，屏幕报 "Secure Boot violation"，然后什么都起不来。

信任名单存在 NVRAM 里，是一组密钥：`PK`（平台密钥，最高级）、`KEK`（密钥交换密钥）、`db`（允许执行的签名）、`dbx`（明确禁止的签名，被吊销的引导器在这里）。出厂时 OEM 一般把微软的密钥预置进 `db`，所以微软签过名的 `bootmgfw.efi` 能过，而 Arch 安装镜像里的 `BOOTX64.EFI`、以及你自己 `grub-install` 出来的 `grubx64.efi` 都没有微软签名，开着 Secure Boot 就一个都过不去。这就是装之前必须把它关掉的原因。

它防的是物理接触攻击：有人趁你不在，拿 U 盘启动改一下引导器，塞个 rootkit 进去，之后开多少次机都查不出来。Secure Boot 让"未签名的引导器不能运行"，这条链就断了。它的保护范围到引导器和内核为止，内核之后再加载什么它管不了（Linux 下要延伸得靠 lockdown 和 UKI）。

三种处理方式：关掉（最简单，代价是失去这层保护）；用 `sbctl` 自己生成密钥、把 Arch 的引导器和内核签上、再把公钥写进固件 `db`，同时保留微软密钥（`sbctl enroll-keys --microsoft`），这样两个系统都能过；或者干脆不装 GRUB，用 systemd-boot 配 `sbctl` 走 UKI 那条路。最后一种和你现在的布局不兼容，前两种可以选。

副作用要记住：固件更新或清 CMOS 有可能把密钥重置，那时 Secure Boot 会回到默认状态，自签名的引导器可能就过不去了，得重来一遍。

### 具体流程

打个比方：开机是场接力赛。固件跑第一棒，GRUB 第二棒，内核第三棒。每一棒只负责把下一棒叫起来，然后退场。

第一棒是固件（UEFI）。CPU 一通电，执行的第一个程序就是主板上的固件，别的什么都还没跑。它初始化硬件，然后看 NVRAM 里的 BootOrder，找到第一条能用的，比如 `Boot0001`。这条记录里存的就是"去哪个分区的哪个路径找哪个 `.efi`"。固件认得 FAT 文件系统，于是从 ESP 里读出 `grubx64.efi`、装进内存、开始执行。到这一刻为止，GRUB 只是固件启动的一个普通程序，固件还在旁边待着，随时给它提供读文件、读键盘、分配内存这些服务。

第二棒是 GRUB。它先找到自己的配置 `/boot/grub/grub.cfg`——它内置了"根分区是 p6"这条信息——用自己的 ext4 驱动把文件读出来，画菜单，倒计时三秒。

第三棒是内核，也就是你没听懂的那部分。GRUB 不会做什么"把系统启动起来"的抽象操作，它具体只干三件事：把 `/boot/vmlinuz-linux` 读进内存；把 `/boot/initramfs-linux.img` 也读进内存，并告诉内核它放在哪；把启动参数（比如 `root=UUID=...`）放到内核能看到的地方。


## Pacman
`-S` 同步（从仓库装/升级包）、`-y` 刷新本地数据库、`-u` 升级所有已安装的包。合起来就是"刷新仓库索引，然后把系统升级到最新"。

## GRUB
修改GRUB 例如倒计时的步骤：
改 `/etc/default/grub` 里的 `GRUB_TIMEOUT`，然后重跑 `grub-mkconfig -o /boot/grub/grub.cfg`，不重跑不生效。

想"停在菜单等我自己选、不倒计时"：

```
GRUB_TIMEOUT=-1
```

想"干脆不显示菜单、直接启动默认项"：

```
GRUB_TIMEOUT=0
GRUB_TIMEOUT_STYLE=hidden
```

这两种是相反的需求，别弄混。`-1` 会一直停在菜单，适合双系统；`0` 是给单系统用的，开机图快，要进菜单就得赶在启动前按 Esc（不一定来得及）。

`GRUB_TIMEOUT_STYLE` 三个取值：`menu` 显示菜单并倒计时、`countdown` 只在最后几秒显示、`hidden` 不显示菜单只等超时（超时前按键才出现）。`GRUB_TIMEOUT=0` 配 `hidden` 是最省事的"跳过菜单"。

改完一定要重新生成，然后重启验证；如果重启后菜单表现没变，说明 `grub.cfg` 没更新，检查 `grub-mkconfig` 那步有没有报错。