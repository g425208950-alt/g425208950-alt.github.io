---
title: 学习python
description: 在C++的基础上学习Python📖
pubDate: 2026-10-02
draft: true
aliases:
  - py
---
## pyqt
PyQt 是 Python 的 GUI 库，把 Qt（C++ 的跨平台界面框架）绑到 Python 上用，写桌面窗口程序。同类的还有 PySide（Qt 官方出的绑定）、Tkinter（Python 自带）、wxPython。
## uv
uv 是 Python 的包和环境管理器，Rust 写的，对标 pip + virtualenv + pip-tools 那一套，主打快。装包、建虚拟环境、锁依赖都能干，命令像 `uv pip install`、`uv venv`、`uv run`。


## Pylance

Pylance名字由来：

类型检查是开源的***Pyright*** 

我安装的是`ms-python.vscode-pylance`（中间的`,`分割了左右两块内容，前面代表是microsoft的python开发团队，后面代表了开发项目）

pylance的功能包含：

- （待补）

## Smart Send

## 语法

### range(n)
是一个惰性序列，同类的还有生成器，map/filter的返回值，文件对象