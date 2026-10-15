---
title: graph
description: 图论算法题
pubDate: 2026-10-13
draft: true
aliases:
---

## 力扣207 课程表

### 描述
你这个学期必须选修 `numCourses` 门课程，记为 `0` 到 `numCourses - 1` 。

在选修某些课程之前需要一些先修课程。 先修课程按数组 `prerequisites` 给出，其中 `prerequisites[i] = [ai, bi]` ，表示如果要学习课程 `ai` 则 **必须** 先学习课程  `bi` 。

- 例如，先修课程对 `[0, 1]` 表示：想要学习课程 `0` ，你需要先完成课程 `1` 。

请你判断是否可能完成所有课程的学习？如果可以，返回 `true` ；否则，返回 `false` 。

**示例 1：**

```
输入：numCourses = 2, prerequisites = [[1,0]]
输出：true
解释：总共有 2 门课程。学习课程 1 之前，你需要完成课程 0 。这是可能的。
```

**示例 2：**

```
输入：numCourses = 2, prerequisites = [[1,0],[0,1]]
输出：false
解释：总共有 2 门课程。学习课程 1 之前，你需要先完成​课程 0 ；并且学习课程 0 之前，你还应先完成课程 1 。这是不可能的。
```

请你判断是否可能完成所有课程的学习？如果可以，返回 `true` ；否则，返回 `false` 。

### 思路
能不能用并查集建立每个元素之前的依赖关系？先考虑false的情况，如果产生了环，即找不到root就是false情况；根据false情况反推，是不是没有环就表示一定是true呢？似乎是，可以开始写代码。我发现DSU只能用来做无向图的题，比如岛屿问题，有向图不能用DSU来表示，DSU可以用来归类，但不能表示关系。那我创建一个有向图，如果矩阵之间值为1，则表示没有前置要求，如果为0，则表示有前置要求，完成一门被设为prerequisite的课之后就把指向这门课的矩阵值设置为1，这个矩阵关于自己的值应该设为-1，不过不访问的话就是1也没问题。

这题应该是一个dfs，如果找到一种方法就是true，如果找遍了也没找到就是false，从0开始，发现

## Trie（前缀树）
### 描述
**[Trie](https://baike.baidu.com/item/%E5%AD%97%E5%85%B8%E6%A0%91/9825209?fr=aladdin)**（发音类似 "try"）或者说 **前缀树** 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补全和拼写检查。

请你实现 Trie 类：

- `Trie()` 初始化前缀树对象。
- `void insert(String word)` 向前缀树中插入字符串 `word` 。
- `boolean search(String word)` 如果字符串 `word` 在前缀树中，返回 `true`（即，在检索之前已经插入）；否则，返回 `false` 。
- `boolean startsWith(String prefix)` 如果之前已经插入的字符串 `word` 的前缀之一为 `prefix` ，返回 `true` ；否则，返回 `false` 。

**示例：**

**输入**
```
["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
```
**输出**
```
[null, null, true, false, true, null, true]
```

**解释**
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");   // 返回 True
trie.search("app");     // 返回 False
trie.startsWith("app"); // 返回 True
trie.insert("app");
trie.search("app");     // 返回 True
### 实现
```c++
struct Node {
    Node* next[26] = {};   // 空指针表示这条边不存在
    bool end = false;      // 从根走到此处是否是一个完整单词
};

class Trie {
    Node* root = new Node();

    Node* find(const string& s) {          // 走到底就返回该节点，中途断开返回 nullptr
        Node* p = root;
        for (char c : s) {
            p = p->next[c - 'a'];
            if (!p) return nullptr;
        }
        return p;
    }

public:
    void insert(const string& w) {
        Node* p = root;
        for (char c : w) {
            int i = c - 'a';
            if (!p->next[i]) p->next[i] = new Node();
            p = p->next[i];
        }
        p->end = true;
    }

    bool search(const string& w) {         // 整个词存在，末尾标记必须为真
        Node* p = find(w);
        return p && p->end;
    }

    bool startsWith(const string& p) {     // 只要求前缀存在，不要求是词
        return find(p) != nullptr;
    }
};
```
![[graph 2026-10-15 10.21.16.excalidraw]]