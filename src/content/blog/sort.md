---
title: 排序的基本知识
description: 记录一些排序关键点
pubDate: 2026-10-03
---

[Sort](Sort.cpp)

## 快速排序(QuickSort)

```
 int Partition(std::vector<int> &nums, int left, int right);
 
 void QuickSort(std::vector<int> &nums, int left, int right)
 {
     int p = Partition(nums, left, right);
     if (p == -1)
         return;
     QuickSort(nums, left, p - 1);
     QuickSort(nums, p + 1, right);
     return;
 }

int Partition(std::vector<int> &nums, int left, int right)
{
    if (left >= right)
    {
        return -1;
    }
    int pivot = nums[right];
    int i = left;
    for (int j = left; j < right; j++)
    {
        if (nums[j] < pivot)
        {
            std::swap(nums[i], nums[j]);
            ++i;
        }
    }
    std::swap(nums[i], nums[right]);
    return i;
}
```



## 归并排序（MergeSort）

时间复杂度O(nlogn)，自顶向下递归空间复杂度O(logn)，可以通过while 循环自底向上将空间复杂度变为O(1)。

## 堆排序(Heap Sort)

### 建堆

```c++
void SiftDown(std::vector<int> &nums, int size, int i)
{
    int largest = i;
    int left = i * 2 + 1;
    int right = i * 2 + 2;
    if (left < size && nums[left] >= nums[largest])
    {
        largest = left;
    }
    if (right < size && nums[right] >= nums[largest])
    {
        largest = right;
    }
    if (largest != i)
    {
        std::swap(nums[i], nums[largest]);
        SiftDown(nums, size, largest);
    }
}

void Heapify(std::vector<int> &nums)
{
    int n = nums.size();
    for (int i = n / 2 - 1; i >= 0; i--)
    {
        SiftDown(nums, n, i);
    }
}
```

### 堆排

```
```



