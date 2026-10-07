---
title: dequeue数据结构
description: 突然发现dequeue底层不是vector，queue底层也不是vector
pubDate: 2026-10-07
---
dequeue有`push_back()` / `pop_back()`、`push_front()` / `pop_front()`的增删接口，为了保证都是O(1)，肯定不能是vector了，但是dequeue还需要保证随机访问的时间复杂度是O(1)，
我想象中应该是哈希表 映射 链表的一些节点，不过哈希表本来就不是严格O(1)，而且链表随机访问更不是O(1)，所以我这个思路就不通了。
实际实现是一个指针数组作为中控表来映射块，每一个块的大小是固定的，这样才方便计算，例如一个块大小是512字节，我想要找到第513个元素，就是第二个块的第一个元素。整体结构比较类似vector映射vector。