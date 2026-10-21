---
title: 在 Arch 上装 dsh 和 KDE 桌面
description: 先用 headless 把 dsh 跑起来，再装 KDE、浏览器和中文输入法，最后用上完整的 dsh web
pubDate: 2026-10-21
draft: true
---

## 目标

前半部分（第 1–6 步）纯命令行就能完成：装好 dsh、配好 DeepSeek API key，用 `dsh headless` 直接提问，不需要浏览器。后半部分（第 7–10 步）装 KDE、浏览器和中文输入法，把 `dsh web` 用起来。

原则：一步一验证，输出对不上就停。第 7 步之前不需要桌面，别急着装。

## 第 1 步：装 Node

dsh 是 npm 包，先有 Node 才能装：

```bash
sudo pacman -S --needed nodejs npm
node -v
```

`node -v` 输出 v22 或更高即可。`nodejs` 提供 `node`，`npm` 是独立的包，两个都要。

## 第 2 步：把 npm 全局目录移到家目录

Arch 的 npm 默认把全局包装进 `/usr`，需要 sudo。先改到家目录，后面装什么都不要提权：

```bash
mkdir -p ~/.npm-global
npm config set prefix "$HOME/.npm-global"
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

`npm config set prefix` 写进 `~/.npmrc`；第二句让当前 shell 认识新目录。验证：

```bash
npm config get prefix
```

应该输出 `/home/你的用户名/.npm-global`。

## 第 3 步：装 dsh

```bash
npm install -g @deepseek-ai/dsh
dsh --version
```

下载量不小，取决于网速，等它跑完。`dsh --version` 有输出就说明装上了；报 `dsh: command not found` 说明 PATH 没生效，重开一个终端或者再 `source ~/.bashrc` 一次。

装上之后看一下用法：

```bash
dsh --help
```

随附的 profile 是 `web`、`headless`、`sdk`、`sdk-minimal`、`acp`，没有 `tui`——`--help` 示例里出现 `tui` 是过时的，别照着敲。

`headless` 就是"给一个任务、跑完打印结果、退出"，在装桌面（第 8 步）和浏览器（第 10 步）之前，它是唯一能用的形式。

## 第 4 步：配置 API key

去 https://platform.deepseek.com 注册并充值，在 API keys 页面创建一个 key，`sk-` 开头，只显示一次，先复制下来。

```bash
mkdir -p ~/.dsh
nano ~/.dsh/.env
```

文件里只写一行，等号两边不要空格、值不要加引号：

```text
DEEPSEEK_API_KEY=sk-你的key
```

Ctrl+O 回车保存，Ctrl+X 退出。然后收紧权限：

```bash
chmod 600 ~/.dsh/.env
```

为什么用文件而不是 `export`：`export` 会留在 `~/.bash_history` 里，而 `.env` 在 `~/.dsh` 下，权限 600 之后只有你能读。

同一个 key 可以在这台和 Windows 那台同时用，不需要新建，额度是共享的。

## 第 5 步：验证

```bash
dsh headless "用一句话解释 pacman -Syu 做了什么"
```

第一次会从模板初始化 `headless` profile，可能要装一批依赖，等它跑完。正常的话会打印回答然后回到提示符；没有交互界面是预期行为。

报错对照：

- `DEEPSEEK_API_KEY` 相关，或者提示没有凭据：`.env` 路径不对、文件名写成 `env`、或者值里带了引号，检查 `ls -l ~/.dsh/.env`
- `401` 或 `invalid api key`：key 复制不完整，重新去平台复制
- `402` 或余额不足：账户没充值，去平台充值
- 连接超时：先 `curl -I https://api.deepseek.com` 确认网络能到
- `command not found`：PATH 问题，回到第 2 步

## 第 6 步：日常怎么用

一条命令问一件事：

```bash
dsh headless "把这台机器的 pacman 日志里最后 3 条升级列出来" | tee /tmp/dsh-answer.log
```

`tee` 把输出同时写到屏幕和文件，长回答不会刷掉，回头还能翻。适合"这条报错什么意思""这个配置文件该怎么改"这类一次性的问题。

每次 `headless` 都是独立的一次性任务，跑完就退，不接着上一轮的对话。要连续对话得用 `dsh web`：

```bash
dsh web
```

它会在 `127.0.0.1:3080` 起一个网页界面，浏览器打开就是和 Windows 上一样的 GUI。这需要桌面环境，所以放到第 10 步再执行。

## 第 7 步：装 NVIDIA 驱动

这台机器是 Intel 核显 + RTX 4060 的双显卡，屏幕接在核显上，独显只在需要时参与渲染。驱动装错最常见的表现是 Wayland 下黑屏或闪烁，所以先装驱动，再装桌面。

```bash
sudo pacman -S --needed nvidia-open nvidia-utils nvidia-prime
```

`nvidia-open` 是开源内核模块，Ada 架构（4060）官方支持；`nvidia-utils` 带用户态库和 `nvidia-smi`；`nvidia-prime` 提供 `prime-run`。桌面本身跑在核显上，玩游戏或跑需要独显的程序时用 `prime-run 程序名` 启动，它才会把渲染交给 4060。

Wayland 需要 DRM 模式设置，确认内核参数里有这一项：

```bash
sudo nano /etc/default/grub
```

找到 `GRUB_CMDLINE_LINUX_DEFAULT`，在引号里加 `nvidia_drm.modeset=1`（已经有就跳过），例如：

```text
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet nvidia_drm.modeset=1"
```

保存后重新生成配置：

```bash
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

这一步和装 GRUB 时一样，改完必须重新生成，否则参数不生效。

## 第 8 步：装 KDE Plasma

```bash
sudo pacman -S --needed plasma-meta konsole dolphin sddm
```

`plasma-meta` 是 KDE 的元包，拉齐桌面、面板、设置中心、截图、网络和音量组件；文件管理器 `dolphin` 和终端 `konsole` 不在元包里，单独写进命令；`sddm` 是登录界面。加起来两三 G，45 GiB 的根分区够用，装完用 `df -h /` 看一眼余量。

声音和字体一起装：

```bash
sudo pacman -S --needed pipewire pipewire-pulse wireplumber noto-fonts noto-fonts-cjk noto-fonts-emoji ttf-dejavu
```

pipewire 是新版音频服务，plasma 的音量组件靠它；`noto-fonts-cjk` 带中日韩字形，没有它中文会显示成方块。

启用登录管理器：

```bash
sudo systemctl enable sddm
```

然后重启：

```bash
sudo reboot
```

开机后会看到 SDDM 登录界面。用户名是你建的那个普通用户，密码是 `passwd` 时设的。登录界面有一处会话选择（不同主题位置不同，找带显示器图标的按钮），选 `Plasma (Wayland)`；如果进桌面后花屏、闪烁或者黑屏，重启后改选 `Plasma (X11)`。

进桌面后验证：

```bash
echo $XDG_SESSION_TYPE
nvidia-smi
```

第一条输出 `wayland` 或 `x11`，说明当前会话类型；第二条能打印显卡型号和显存占用，说明驱动正常。

## 第 9 步：中文输入法

KDE 本身不带中文输入法，要装 fcitx5：

```bash
sudo pacman -S --needed fcitx5 fcitx5-chinese-addons fcitx5-configtool
```

`fcitx5-chinese-addons` 带拼音和五笔，`fcitx5-configtool` 是图形配置工具。

Wayland 原生程序通过输入法协议直接对接 fcitx5，不需要环境变量；XWayland 运行的旧程序要靠环境变量找到它：

```bash
mkdir -p ~/.config/environment.d
nano ~/.config/environment.d/im.conf
```

写入：

```text
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
```

重新登录后生效。然后运行 `fcitx5-configtool`（或打开"系统设置 → 输入法"，装完这个包会多出该模块），添加"拼音"，设一个切换键（默认 Ctrl+Space）。

Wayland 下还要在"系统设置 → 键盘 → 虚拟键盘"里选 Fcitx 5，否则部分程序里输入法不生效。最后在"系统设置 → 开机与关机 → 自动启动"里加一条 fcitx5，不然每次登录都要手动 `fcitx5 -d`。托盘里出现 fcitx5 图标就说明它在跑。

## 第 10 步：用浏览器打开 dsh web

```bash
sudo pacman -S --needed firefox
```

装完在应用菜单里打开 Firefox，先在 Konsole 里把服务跑起来：

```bash
mkdir -p ~/work && cd ~/work
dsh web
```

它会打印监听地址 `http://127.0.0.1:3080`，在浏览器里打开这个地址，就是和 Windows 上一样的界面。

注意 `dsh web` 是前台进程，占住那个终端；关掉终端或 Ctrl+C 服务就停了。要它一直跑，可以 `nohup dsh web >/tmp/dsh-web.log 2>&1 &`，或者开一个新的 Konsole 标签专门放它。

## 常见问题

**装到一半卡住**：另开一个终端（Ctrl+Alt+F2）跑 `ping registry.npmjs.org`，不通就说明 npm 网络有问题。国内网络下载超时可以临时换镜像重试：`npm install -g @deepseek-ai/dsh --registry=https://registry.npmmirror.com`。

**npm 报 EACCES**：prefix 没设成功，`npm config get prefix` 看是不是还在 `/usr`。

**第一次初始化 profile 时报找不到 pnpm**：`sudo pacman -S --needed pnpm`，然后重跑刚才那条命令。

**`.env` 改了不生效**：启动环境里的同名变量优先级最高，`echo $DEEPSEEK_API_KEY` 看一下当前 shell 有没有残留变量。

**升级 dsh**：`npm install -g @deepseek-ai/dsh@latest`，然后 `dsh --version` 确认。

**SDDM 黑屏，或者登录后又弹回登录界面**：按 Ctrl+Alt+F3 切到 TTY 登录，`journalctl -u sddm -b` 看报错。多半是 NVIDIA 的 `nvidia_drm.modeset=1` 没生效，确认 `cat /proc/cmdline` 里有这一项，没有就回第 7 步重新 `grub-mkconfig`。

**进 Wayland 会话后画面闪烁或撕裂**：登录界面改选 `Plasma (X11)` 会话，日常使用不受影响。

**没有声音**：`systemctl --user status pipewire` 看服务状态，`wpctl status` 看设备是否被识别，音量图标上如果显示"未连接"通常是 pipewire-pulse 没装。
