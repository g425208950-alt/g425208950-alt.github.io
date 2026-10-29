---
title: makepkg
description: makepkg 的来历、PKGBUILD 结构与从构建到安装的完整流程
pubDate: 2026-10-27
draft: true
---

## 它是谁的

`makepkg` 属于 **pacman 包**，不是单独的项目。装 pacman 时一起就位，路径是 `/usr/bin/makepkg`，本身是一个 bash 脚本。

```bash
pacman -Qo /usr/bin/makepkg
# /usr/bin/makepkg is owned by pacman 7.x
```

它做的事和 pacman 相反：pacman 装现成的二进制包，makepkg **按 PKGBUILD 把源码编成二进制包**，产出一个 `.pkg.tar.zst`。所以它是「编包」，pacman 才是「装包」。

## 工作流程

一个 PKGBUILD 读进来，makepkg 依次做：

1. 解析变量（`pkgname`、`pkgver`、`depends`…）
2. 按 `source=()` 下载源码到 `src/`
3. 校验 `sha256sums` 和 PGP 签名
4. 解压到 `src/`
5. 跑 `prepare()`（打补丁）
6. 跑 `build()`（编译）
7. 跑 `check()`（测试，可选）
8. 在 fakeroot 里跑 `package()`，把文件装进 `pkg/`（即 `$pkgdir`）
9. 打包成 `名字-版本-架构.pkg.tar.zst`

`-i` 只是最后多一步，把产物交给 pacman 安装。

## PKGBUILD 长什么样

```bash
pkgname=hello
pkgver=1.0
pkgrel=1
pkgdesc="demo package"
arch=('x86_64')
url="https://example.com"
license=('MIT')
depends=('glibc')
makedepends=('git')
source=("$pkgname-$pkgver.tar.gz::$url/$pkgname-$pkgver.tar.gz")
sha256sums=('SKIP')

build() {
  cd "$srcdir/$pkgname-$pkgver"
  ./configure --prefix=/usr
  make
}

package() {
  cd "$srcdir/$pkgname-$pkgver"
  make DESTDIR="$pkgdir/" install
}
```

- `$srcdir`：解压后的源码目录
- `$pkgdir`：打包时的假根目录，写进这里的东西才会被打进包
- `depends` 是运行依赖，`makedepends` 只在编译时需要

## 基本用法

从 AUR 手动装一个包，就三步：

```bash
git clone https://aur.archlinux.org/包名.git
cd 包名
makepkg -si
```

`-s` 装缺的依赖，`-i` 编完直接装。产物在当前目录，也可以自己装：

```bash
makepkg -s
sudo pacman -U ./包名-版本-x86_64.pkg.tar.zst
```

`makepkg` **不能以 root 运行**，编译阶段必须是普通用户；`-i` 需要提权时它会自己调 sudo。

## 常用选项

| 选项         | 作用                        |
| ---------- | ------------------------- |
| `-s`       | 用 pacman 装缺失的依赖（`--syncdeps`） |
| `-i`       | 编完直接安装                    |
| `-si`      | 上面两个一起，最常用                |
| `-f`       | 强制重编，产物已存在也覆盖             |
| `-c`       | 编完清掉 `src/` 和 `pkg/` 里的中间文件 |
| `-C`       | 编译前先删掉旧的 `src/`，干净重建       |
| `-r`       | 编完卸掉为这次构建临时装的依赖           |
| `-o`       | 只下载解压，不编译                 |
| `-d`       | 跳过依赖检查，会编出坏包，慎用           |
| `-p <文件>`  | 用指定的 PKGBUILD             |
| `--noconfirm` | 所有提示都选默认，适合脚本         |
| `--needed` | 配 `-s`，已最新的依赖不重装          |
| `-g`       | 生成 `sha256sums` 内容        |

## 常见报错

| 报错                                      | 原因和处理                                   |
| --------------------------------------- | --------------------------------------- |
| `Integrity checks ... are invalid`      | 上游源码变了，`sha256sums` 过期；用 `updpkgsums` 重算 |
| `One or more PGP signatures could not be verified` | 缺公钥，导入密钥，或临时 `--skippgpcheck`        |
| `Cannot find the fakeroot binary`       | 没装 `base-devel`                          |
| `gcc: command not found`                | 同上                                       |
| `error: target not found`（`-s` 时）        | 依赖在 AUR，需要用 AUR 助手先装上                     |
| `You do not have write permission to ...` | 目录权限问题，别在系统目录里编                          |
| 编译到一半失败                                 | 看 `build()` 里缺了什么，装对应 `makedepends`      |

## 安全提醒

PKGBUILD 是 bash 脚本，`build()` 里的命令以**你本人**的身份执行，没有任何沙箱。AUR 是用户提交的，恶意代码就藏在这一步。装之前至少扫一眼 `source`、`sha256sums` 和 `build()`，`paru`、`yay` 会先把 diff 摆出来让你确认，别一路回车。

## 配置

全局配置在 `/etc/makepkg.conf`，个人覆盖写 `~/.makepkg.conf`：

```bash
MAKEFLAGS="-j$(nproc)"      # 用满所有核
OPTIONS=(strip !debug)      # 去符号表，包更小
PKGEXT='.pkg.tar.zst'       # 包格式
```

改 `MAKEFLAGS` 前确认内存够，`-j$(nproc)` 在小内存机器上会把编译搞崩。

## 和 AUR 助手的关系

`paru -S 包名` 内部就是 clone + `makepkg` + `pacman -U`，只是替你做了依赖解析和 diff 确认。已经用助手时不需要再手动跑 makepkg；反过来，助手坏了也能靠 makepkg 手动救。

其它常和它配套的：

| 命令                     | 作用                        |
| ---------------------- | ------------------------- |
| `updpkgsums`           | 按当前源码重算并写回校验和             |
| `namcap`               | 检查 PKGBUILD 和包里的常见问题      |
| `makepkg --printsrcinfo` | 输出 `.SRCINFO`，AUR 要求的东西  |
| `extra-x86_64-build`   | 在干净的 chroot 里构建，避免本机污染    |
