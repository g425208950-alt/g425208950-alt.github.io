---
title: 新装 Arch 的收尾配置
description: 从全量更新、pacman 调优到共享 D 盘和开发环境，逐条解释每条命令在做什么
pubDate: 2026-10-21
draft: true
---

## 写在前面

这份清单接在"装完重启能登录"之后。前提是 `NetworkManager` 已经 `enable`、能联网、普通用户能 `sudo`。

原则和安装时一样：一步一验证，输出对不上就停，别接着往下敲。所有命令都在普通用户下执行，标了 `sudo` 的才提权。`makepkg` 不能加 `sudo`，它一发现是 root 就直接退出。

## 第 1 步：更新系统

```bash
uname -r
systemctl --failed
```

第一条看当前内核版本，记一下，后面升级完对比。第二条看有没有启动失败的单元，正常输出 `0 loaded units listed`。

```bash
sudo pacman -Syu
```

`-S` 同步仓库、`-y` 刷新数据库、`-u` 升级所有已安装的包。这是 Arch 唯一正确的更新方式，不要用 `-Sy` 只刷新不升级，那会造成部分升级。

第一次更新会下载几百 MB，内核、固件、GRUB 都可能在里面。如果看到 `warning: /etc/xxx installed as /etc/xxx.pacnew`，说明你改过的配置和包里的新版本冲突了，旧文件保留原样、新版本另存为 `.pacnew`，之后用 `pacdiff` 合并，别直接删。

如果升级了内核，重启一次：

```bash
sudo reboot
```

重启后再跑 `systemctl --failed`，空列表才算过。

## 第 2 步：pacman 和镜像源

编辑 pacman 的全局配置：

```bash
sudo nano /etc/pacman.conf
```

在 `[options]` 段落里确认或加上这三行：

```text
Color
ParallelDownloads = 5
ILoveCandy
```

`Color` 让输出带颜色；`ParallelDownloads` 允许同时下载 5 个包，默认是关闭的，开了之后下载速度明显改善；`ILoveCandy` 把进度条换成吃豆人，纯装饰，不影响功能。

镜像源有两种选择，二选一。

手动指定最快的那个，保持安装时加的那行在最前面：

```bash
sudo nano /etc/pacman.d/mirrorlist
```

或者让 reflector 自动测速排序：

```bash
sudo pacman -S --needed reflector
sudo reflector --country China --protocol https --latest 10 --sort rate --save /etc/pacman.d/mirrorlist
```

`--country China` 只测国内镜像，`--latest 10` 取最近同步过的 10 个，`--sort rate` 按测速排序，`--save` 直接覆盖 mirrorlist。代价是每次都得手动跑一遍，所以更常见的做法是配一个 systemd timer 定期刷新。

改完镜像源要重新同步一次：

```bash
sudo pacman -Syu
```

顺便装一个处理配置冲突的工具：

```bash
sudo pacman -S --needed pacman-contrib
```

以后升级时如果出现 `xxx.pacnew`，用 `sudo pacdiff` 逐条比对，别直接删。

## 第 3 步：日常命令行工具

```bash
sudo pacman -S --needed git rsync unzip zip htop tree fzf ripgrep fd bat less
```

`--needed` 表示已经装了就跳过，不会重装。逐个说：

- `git` 版本控制，后面装 AUR 也要用
- `rsync` 增量复制，备份和同步都用它
- `unzip`、`zip` 处理 zip 包
- `htop` 交互式进程查看，比 `top` 好用
- `tree` 树形列目录
- `fzf` 模糊查找，可以接在管道后面过滤
- `ripgrep` 提供 `rg`，比 `grep` 快的文本搜索
- `fd` 按文件名查找，比 `find` 语法简单
- `bat` 带高亮和行号的 `cat`
- `less` 分页查看，`man` 和 `journalctl` 默认都用它翻页

验证一下：

```bash
man pacman
```

能翻页说明 `man-db` 和 `man-pages` 正常，`q` 退出。手册是命令行环境下最可靠的文档，遇到不认识的命令先 `man 命令名`。

## 第 4 步：Wi-Fi 和防火墙

有线的机器可以跳过连接部分，但建议还是把 Wi-Fi 配好，作为备用。

```bash
nmcli radio wifi
nmcli device wifi list
nmcli device wifi connect "你的WiFi名" password "密码"
```

`nmcli radio wifi` 看无线开关状态；`device wifi list` 扫描并列出可见网络，`*` 表示当前连着；`device wifi connect` 连上并保存，之后开机自动连。

确认连上了：

```bash
nmcli connection show
ip -brief addr
```

`nmcli connection show` 列出保存的连接，`ip -brief addr` 看有没有拿到 IP。

防火墙是可选的。Arch 默认什么都不拦，桌面机器上也常有人不装，但如果你想加一层，用 ufw 最省事：

```bash
sudo pacman -S --needed ufw
sudo systemctl enable --now ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw enable
sudo ufw status verbose
```

`deny incoming` 拒绝所有外部主动连接，`allow outgoing` 保持出站正常。`enable` 时会提示会打断现有 SSH 连接，本地操作不影响。以后如果要开 SSH，记得 `sudo ufw allow 22/tcp`。

## 第 5 步：共享 D 盘

先确认 D 盘的文件系统类型和 UUID：

```bash
sudo blkid /dev/nvme0n1p4
```

输出里 `TYPE="ntfs"` 就是 NTFS。如果看到 `BitLocker`，先回 Windows 解密，否则 Linux 读不了。

然后在 Windows 里关掉快速启动（控制面板 → 电源选项 → 选择电源按钮的功能 → 更改当前不可用的设置 → 取消"启用快速启动"），并彻底关机一次。不关的话，NTFS 会处于"未干净关闭"状态，Linux 挂载会被拒绝或强制只读。

先手动挂一次试试：

```bash
sudo mkdir -p /mnt/d
sudo mount -t ntfs3 -o uid=1000,gid=1000,umask=022 /dev/nvme0n1p4 /mnt/d
ls /mnt/d
```

`ntfs3` 是内核自带的 NTFS 驱动，不需要额外软件；`uid=1000,gid=1000` 把你的用户设成所有者，`umask=022` 让组和其他用户只读。`id -u` 可以确认自己的 uid 是不是 1000。

能列出 D 盘内容就是通的。先卸掉，再写进 fstab 让它开机自动挂：

```bash
sudo umount /mnt/d
sudo blkid -s UUID -o value /dev/nvme0n1p4
```

把输出的 UUID 抄下来，编辑：

```bash
sudo nano /etc/fstab
```

在末尾加一行，UUID 换成上一步查到的：

```text
UUID=你的UUID /mnt/d ntfs3 uid=1000,gid=1000,umask=022,nofail 0 0
```

六个字段是：设备、挂载点、类型、挂载选项、dump（固定 0）、fsck 顺序（0 表示不检查）。`nofail` 很重要，D 盘不存在时也继续启动，不会卡进 emergency mode。

改完让 systemd 重新读一遍，然后试挂：

```bash
sudo systemctl daemon-reload
sudo mount -a
findmnt /mnt/d
```

`mount -a` 把 fstab 里所有条目挂一遍，语法错了这里就会报错，比重启才发现好。`findmnt` 确认挂上了。

如果 `ntfs3` 不认这块盘，改用 `ntfs-3g`：把 fstab 里的 `ntfs3` 换成 `ntfs-3g`，其余不变。

## 第 6 步：开发环境和 AUR

```bash
sudo pacman -S --needed nodejs npm python
```

`nodejs` 带 `node`，`npm` 是独立包。`python` 只带解释器和标准库，pip 是单独的 `python-pip` 包；而且 Arch 把系统 Python 标记成 externally-managed（PEP 668），直接 `pip install` 到系统会被拒绝，这是故意的。项目一律用虚拟环境，venv 里自带 pip：

```bash
mkdir -p ~/work && cd ~/work
python -m venv .venv
source .venv/bin/activate
pip install requests
```

`deactivate` 退出虚拟环境。要全局装命令行工具（比如 `yt-dlp`），用 `python-pipx`：`sudo pacman -S --needed python-pipx`，然后 `pipx install yt-dlp`。

npm 的全局安装默认写到 `/usr`，需要 sudo。改成家目录更干净：

```bash
mkdir -p ~/.npm-global
npm config set prefix "$HOME/.npm-global"
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

`npm config set prefix` 把全局安装目录指到 `~/.npm-global`，第二句把它加进 PATH。之后 `npm install -g 包名` 不需要 sudo。

AUR 需要一个 helper，以 `paru` 为例：

```bash
sudo pacman -S --needed base-devel git
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si
```

`makepkg -s` 自动装缺的依赖，`-i` 装完直接交给 pacman 安装。这一步不能用 sudo，makepkg 会检查并拒绝以 root 运行。编译要几分钟。

装完验证：

```bash
paru --version
```

以后 `paru -S 包名` 会先查官方仓库，没有再查 AUR。

想装 Steam 的话，还要开 multilib：

```bash
sudo nano /etc/pacman.conf
```

取消 `[multilib]` 段落和它下面那行 `Include = /etc/pacman.d/mirrorlist` 的注释，保存后 `sudo pacman -Syu`。不开 multilib 是装不了 Steam 和 32 位库的。

## 收尾检查

四项都过，系统就算配置完成：

```bash
systemctl --failed
timedatectl
df -h /
findmnt /mnt/d
```

`systemctl --failed` 空列表；`timedatectl` 里 `System clock synchronized: yes`、时区是 `Asia/Shanghai`；`df -h /` 根分区空间正常；`findmnt /mnt/d` 能看到 D 盘。

## 常见问题

**升级后某个程序起不来**：先看 `journalctl -xe` 末尾的报错，再看是不是内核升级后没重启——`uname -r` 显示的是正在跑的内核，`pacman -Q linux` 显示的是磁盘上的新版本，两者版本号对不上就重启。

**pacman 报 `unable to lock database`**：另一个 pacman 还在跑，或者上次异常退出留了 `/var/lib/pacman/db.lck`。确认没有进程在跑之后 `sudo rm /var/lib/pacman/db.lck`，别在别的情况下删。

**D 盘挂载报 dirty 或 permission denied**：回 Windows 关快速启动、`chkdsk /f D:`，再重启一次。

**TTY 里中文显示成方块**：正常，纯命令行环境没有中文字体。要显示中文得装字体并配 framebuffer，等装了图形界面再说。

**两个系统时间差 8 小时**：Windows 那条 `RealTimeIsUniversal` 注册表如果没做，回 Windows 补一次；做完在 Arch 里 `sudo hwclock --systohc` 再对齐一次。

**`.pacnew` 文件一直堆着**：用 `sudo pacdiff`，它会逐个问你要不要合并，别直接删——删了等于放弃新版本的配置。
