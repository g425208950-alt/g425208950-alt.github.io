---
title: map接口记录
description: 没想到这个我也会忘
pubDate: 2026-10-07
---
## unordered_map

### find
`find` 在容器里按 key 找元素，找到了返回指向它的迭代器，没找到返回 `end()`。

## unordered_set
插入用 `insert(v)`，返回 `pair<iterator, bool>`，bool 表示是否真的插进去了（已存在就是 false）。`emplace(v)` 同理