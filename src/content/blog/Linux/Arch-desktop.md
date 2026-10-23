---
title: Arch 桌面组成
description: Arch 桌面不是一整块软件，按显示服务器、窗口管理器、桌面环境、显示管理器四层拆开看各自选什么
pubDate: 2026-10-21
draft: true
---

Linux 的"桌面"不是一整块软件，是几层拼起来的，装 Arch 的时候这些层要自己选。

最底下是显示服务器，负责把画面画到屏幕、把键盘鼠标事件分给程序。现在有两套：X11（Xorg，1985 年的老架构，兼容一切，缩放和多显示器一直别扭）和 Wayland（新协议，程序直接交给合成器，天然支持每屏缩放、更跟手，老程序靠 XWayland 兼容层跑）。KDE 和 GNOME 默认 Wayland，XFCE(**XForms Common Environment**) 目前仍以 X11 为主。

往上一层是窗口管理器兼合成器，管窗口怎么摆、怎么画阴影和动画。KDE 用 KWin，GNOME 用 Mutter，XFCE 用 Xfwm。平铺式窗口管理器（i3、sway、Hyprland）就只做这一层，不提供面板和设置界面。

再往上是桌面环境，把窗口管理、面板、开始菜单、设置中心、文件管理器、终端、截图这些打包在一起。这才是你真正看到的"桌面"。主流几个：

KDE Plasma 功能最全、最像 Windows，设置项细到离谱，内存占用中等，Wayland 下已经很稳，用 Qt 写。

GNOME 设计最克制，触控板手势和动画最舒服，但默认没有任务栏和桌面图标，习惯 Windows 的人要装扩展才顺手，用 GTK 写。

XFCE 轻、稳、几十年不大改，外观偏旧，适合老机器或喜欢简单的人。

Cinnamon 是 Linux Mint 的桌面，Windows 用户迁移最无痛，介于 KDE 和 XFCE 之间。

MATE 和 LXQt 是更轻的复古选择，一般给低配机器用。

平铺式（i3、sway、Hyprland）不是桌面环境，是键盘驱动的工作流，窗口自动铺满屏幕不重叠，需要自己写配置，学习曲线陡但效率高。

另外还有显示管理器，就是开机那个登录界面：SDDM（KDE 配套）、GDM（GNOME 配套）、LightDM（通用）。不装也行，登录后手动 `startx` 或 `exec sway`。

Arch 上的装法是 metapackage：`plasma-meta`、`gnome`、`xfce4`，再配一个显示管理器。主题、图标、字体、输入法都是额外的东西。

你这台是 Intel 核显 + RTX 4060 的双显卡，KDE 和 GNOME 的 Wayland 会话都能用，NVIDIA 只在 `prime-run` 拉起来的时候参与，桌面本身跑在核显上，所以不用担心独显驱动拖累 Wayland。

```
应用          Firefox、Obsidian、Konsole
桌面环境      Plasma、GNOME                    ← 面板 + 设置 + 一整套应用
合成器        KWin、Mutter、Hyprland、Niri、Sway  ← 画窗口、管输入、管屏幕
显示协议      Wayland / X11
内核          Linux
发行版        Arch、CachyOS、Ubuntu             ← 打包分发上面所有东西
```