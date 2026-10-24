---
title: Pacman
description: pacman 从同步、安装、查询到卸载和降级的用法
pubDate: 2026-10-24
draft: true
---

pacman 是 Arch 的包管理器：从仓库下载编译好的包（`.pkg.tar.zst`），解开后放到系统里，同时维护一份本地数据库，记录每个包装了哪些文件、依赖谁。

## 命令怎么读

`pacman -Syu` 是一个主操作加几个修饰字母，拆开看：

| 字母    | 含义                                    |
| ----- | ------------------------------------- |
| `-S`  | sync：和仓库同步，装包                        |
| `-Q`  | query：查本地已经装了什么                       |
| `-R`  | remove：卸载                             |
| `-U`  | upgrade：装本地的 `.pkg.tar.zst` 文件        |
| `-F`  | files：按文件反查包，要先 `-Fy` 建库              |
| `-y`  | 刷新仓库数据库（只刷新索引，不升级）                    |
| `-u`  | 升级所有已安装的包                             |
| `-s`  | 递归，连带依赖或不再需要的东西                       |
| `-i`  | 显示信息；`-R` 时是同时删配置文件                  |
| `-l`  | 列出文件                                  |
| `-o`  | 反查某个文件属于哪个包                           |
| `-q`  | 精简输出，只留包名                             |
| `-e`  | 只算显式安装的（不是被别的包拖进来的）                   |
| `-m`  | 只算外部包（AUR 装的，仓库里没有）                   |
| `-t`  | 只算不再被依赖的孤儿包                           |
| `-c`  | 清缓存                                   |
| `-n`  | 卸载时不备份配置文件                            |

## 同步与升级

```bash
sudo pacman -Syu            # 刷新索引 + 全量升级，日常就用这个
sudo pacman -Syyu           # 强制重下索引；只有换了镜像才需要
sudo pacman -Sy             # 只刷新索引，不升级（后面单独装包时别这么用）
sudo pacman -Qu             # 看有哪些包能升
```

`-Sy 包名` 是危险的「部分升级」：新包的索引和旧包混在一起，容易缺库。要么 `-Syu` 全升，要么 `-S 包名` 直接用旧索引装。

## 安装与搜索

```bash
sudo pacman -S 包名             # 安装
sudo pacman -S 包名1 包名2      # 一次装多个
sudo pacman -Ss 关键词          # 在仓库里搜（支持正则）
sudo pacman -Si 包名            # 看仓库里这个包的信息（版本、依赖、大小）
sudo pacman -Sl 仓库            # 列出某个仓库的全部包
sudo pacman -Sw 包名            # 只下载不安装
sudo pacman -U 包文件           # 装本地包，或降级
```

装包时 pacman 会列出要装的包和总大小，问 `Proceed with installation?` 才动手。

## 卸载

```bash
sudo pacman -R 包名             # 只删这个包，依赖留着
sudo pacman -Rs 包名            # 连同不再被需要的依赖一起删
sudo pacman -Rns 包名           # 再删掉它的配置文件（最干净）
sudo pacman -Rdd 包名           # 跳过依赖检查硬删，会留下坏依赖，慎用
```

日常卸软件用 `-Rns`；自己改过的配置文件想留着就只 `-R`。

## 查询本地

```bash
pacman -Q               # 所有已安装的包
pacman -Qe              # 显式安装的（你自己要的）
pacman -Qm              # 外部包（AUR 来的）
pacman -Qdt             # 孤儿：不再被任何包依赖
pacman -Qi 包名          # 当前装的版本、依赖、安装时间
pacman -Ql 包名          # 这个包装了哪些文件
pacman -Qo /path/file   # 这个文件属于哪个包
pacman -Qkk 包名         # 校验文件有没有被改坏
```

`pacman -Qdt` 出来的孤儿包可以清掉：

```bash
sudo pacman -Rns $(pacman -Qdtq)
```

## 缓存与降级

下载过的包缓存在 `/var/cache/pacman/pkg/`：

```bash
sudo pacman -Sc         # 删掉已卸载包的旧包，保留已装包的当前版本
sudo pacman -Scc        # 清空整个缓存，之后没法离线降级
```

升级后某个软件坏了，就去缓存里找旧版本装回去：

```bash
ls /var/cache/pacman/pkg/包名-*
sudo pacman -U /var/cache/pacman/pkg/包名-旧版本-x86_64.pkg.tar.zst
```

用 `paccache -r`（在 `pacman-contrib` 里）能按保留份数清理，比 `-Sc` 好控制。

## 镜像与密钥

`/etc/pacman.d/mirrorlist` 是下载源列表，越靠前越优先。换源更快可以用 reflector：

```bash
sudo reflector --country China --latest 20 --sort rate --save /etc/pacman.d/mirrorlist
```

遇到 `invalid or corrupted package (PGP signature)` 是密钥过期，先更新钥匙环再升级：

```bash
sudo pacman -Sy archlinux-keyring
sudo pacman -Syu
```

## 常见故障

| 现象                                    | 处理                                  |
| ------------------------------------- | ----------------------------------- |
| `unable to lock database`             | 确认没有别的 pacman 在跑，再删 `/var/lib/pacman/db.lck` |
| `conflicting files`                   | 用 `--overwrite` 指定冲突路径，或先查 `pacman -Qo` |
| `target not found`                    | 先 `-Syu` 刷新索引；包可能只在 AUR        |
| 签名错误                                  | 见上面的钥匙环                          |
| 空间不够                                  | `pacman -Sc` 清缓存                   |

## 配置文件

`/etc/pacman.conf` 里常改的几项：

- `ParallelDownloads = 5`：并行下载
- `Color`：彩色输出
- `[multilib]`：取消注释，才能装 32 位库
- `IgnorePkg`：升级时跳过的包

仓库分 `core`、`extra`、`multilib` 三层，都在这个文件里启用。

## AUR

AUR 不是官方仓库，pacman 管不了，要用 `yay` 或 `paru`：

```bash
yay -S 包名
yay -Syu            # 连 AUR 一起升级
```

它们调用的还是 pacman，所以上面的查询、卸载参数一样能用。
