| 文件                                                         | 管什么           |
| ---------------------------------------------------------- | ------------- |
| `~/.config/kdeglobals`                                     | 全局外观、配色       |
| `~/.config/kwinrc`                                         | 窗口、合成器、特效     |
| `~/.config/plasmashellrc`                                  | 面板的位置/高度/隐藏   |
| `~/.config/plasma-org.kde.plasma.desktop-appletsrc`        | 面板和桌面上有什么部件   |
| `~/.config/kcminputrc`                                     | 键盘、鼠标、NumLock |
| `~/.config/konsolerc` + `~/.local/share/konsole/*.profile` | 终端            |
| `~/.config/environment.d/*.conf`                           | 登录时的环境变量      |
| `~/.bashrc`                                                | shell         |
| `~/.config/starship.toml`                                  | 提示符           |
**GUI 改一次 → diff 一次 → 记一条。**

```
cp ~/.config/kwinrc /tmp/kwinrc.before
# 在系统设置里改一个开关
diff /tmp/kwinrc.before ~/.config/kwinrc
```