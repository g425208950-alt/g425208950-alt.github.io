---
title: Arch 桌面组成
description: Arch 桌面不是一整块软件，按显示服务器、窗口管理器、桌面环境、显示管理器四层拆开看各自选什么
pubDate: 2026-10-21
draft: true
---

Linux 的"桌面"是几层拼起来的，装 Arch 的时候要自己选。

最底下是显示服务器，负责把画面画到屏幕、把键盘鼠标事件分给程序。现在有两套：X11（Xorg，1985 年的老架构，兼容一切，缩放和多显示器一直别扭）和 Wayland（新协议，程序直接交给合成器，天然支持每屏缩放、更跟手，老程序靠 XWayland 兼容层跑）。KDE 和 GNOME 默认 Wayland，XFCE(**XForms Common Environment**) 目前仍以 X11 为主。

往上一层是窗口管理器兼合成器，管窗口怎么摆、怎么画阴影和动画。KDE 用 KWin，GNOME 用 Mutter，XFCE 用 Xfwm。平铺式窗口管理器（i3、sway、Hyprland）就只做这一层，不提供面板和设置界面。

```
桌面环境      Plasma、GNOME                    ← 面板 + 设置 + 一整套应用
合成器        KWin、Mutter、Hyprland、Niri、Sway  ← 画窗口、管输入、管屏幕
显示协议      Wayland / X11
内核          Linux
发行版        Arch、CachyOS、Ubuntu             ← 打包分发上面所有东西
```