---
title: RFC是什么？
description: 我一直以为RFC只是一种评论形式（？
pubDate: 2026-10-03
---

## 原意

request for comments

## 背景

RFC是IETF（Internet Engineering Task Force，互联网工程任务组）发布的一系列技术文档，是***互联网的标准规范***，每篇有唯一编号，一经发布***永不修改***，如需修改，直接废弃，标记为Obsolete，并发布新标准。

## 规则

| 等级                        | 权威性 | 说明                                                      |
| :-------------------------- | :----- | :-------------------------------------------------------- |
| **Internet Standard (STD)** | ⭐最高  | 经过多轮实践检验，正式标准（如 IP、TCP、HTTP 的最终形态） |
| **Proposed Standard (PS)**  | 高     | 已是标准轨道，业内普遍实现                                |
| **Draft Standard**          | 中高   | 接近成熟（现在这个阶段已较少单独使用）                    |
| **Experimental**            | 低     | 实验性质                                                  |
| **Informational**           | 很低   | 仅供参考，**没有强制力**                                  |

## 作用



## 场景

RFC 3986把字符分为几类：

1. 未保留字符（unreserved） 永远不转义
2. 保留字符（Reserved）有特殊用途，看上下文
3. 必须转义的其他字符
