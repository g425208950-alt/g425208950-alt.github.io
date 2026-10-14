---
title: C++ 容器
description: 记录 C++ 容器的构造与常用接口
pubDate: 2026-09-29
draft: true
---

## vector
### 构造函数
想要
```python
parent = list(range(5))
```
这个效果需要写
```c++
std::vector<int> parent{1,2,3,4,5};
```
或者
```c++
#include <numeric>
std::vector<int> v(6);
std::iota(v.begin(), v.end(), 0);  // 填 0,1,2,3,4,5
```
如果想要重复的元素，比如`6`个`0`；
就写
```c++
std::vector<int> v(6,0);
```
