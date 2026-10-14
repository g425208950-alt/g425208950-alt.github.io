---
title: TOML 速查
description: TOML 的全称与基本写法
pubDate: 2026-09-29
draft: true
---

## 全称
全称 Tom's Obvious Minimal Language，语法接近ini

## 基本写法
```toml
title = "示例"          # 键值对，字符串要引号
port = 8080             # 整数
debug = true            # 布尔
tags = ["a", "b"]       # 数组

[server]                # 表（table），相当于一段命名空间
host = "0.0.0.0"
port = 8080             # 键名可以和全局重名，因为在不同表下

[database]
url = "postgres://..."  # 嵌套用 [a.b] 或点号写 a.b = 1
```
常见用途：Rust 的 Cargo.toml、Python 的 pyproject.toml、Hugo 和 Netlify 的配置。
