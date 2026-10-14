---
title: 并查集介绍
description: 初见并查集
pubDate: 2026-10-02
draft: true
aliases:
  - 并查集
---
## 全称
Disjoint Set Union
## 代码
### python
```python
parent = list(range(n)) // 建一个长度为n的列表，赋给parent
rank = [0] * n

def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])  # 路径压缩
    return parent[x]

def union(a, b):
    ra, rb = find(a), find(b)
    if ra == rb:
        return
    if rank[ra] < rank[rb]:
        ra, rb = rb, ra
    parent[rb] = ra
    if rank[ra] == rank[rb]:
        rank[ra] += 1
```
### C++（手写）
```c++
class DSU {
public:
    DSU(int capacity) :
        parent_(capacity),
        rank_(capacity, 0)
    {
        std::iota(parent_.begin(), parent_.end(), 0);
    }

    int find(int i)
    {
        // 这里可以改成迭代写法
        if (parent_[i] != i)
        {
            parent_[i] = find(parent_[i]);
        }
        return parent_[i];

        // 这个也是空间复杂度O(n)，想要空间复杂度是O(1)需要迭代两次。
        // int ind = i;
        // std::stack<int> st{};
        // while(parent_[ind] != ind)
        // {
        //     st.push(ind);
        //     ind = parent_[ind];
        // }
        // int root = ind;
        // while(!st.empty())
        // {
        //     parent_[st.top()] = root;
        //     st.pop();
        // }
        // return root;
    }

    void unite(int a, int b)
    {
        // 合并 a 和 b 所在的树
        int ra = find(a);
        int rb = find(b);
        if (ra == rb)
        {
            return;
        }
        if (rank_[ra] < rank_[rb])
        {
            std::swap(ra, rb);
        }
        else if (rank_[ra] == rank_[rb])
        {
            ++rank_[ra];
        }
        parent_[rb] = ra;
        return;
    }
private:
    std::vector<int> parent_;
    std::vector<int> rank_;
};

```
DSU 的 ***整体结构*** 是一棵***树***，rank表示的是树的高度。
![[DSU 2026-10-13 11.22.02.excalidraw]]