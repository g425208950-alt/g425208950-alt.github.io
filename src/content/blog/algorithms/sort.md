---
title: 排序的基本知识
description: 记录一些排序关键点
pubDate: 2026-10-03
---
[Sort](Sort.cpp)
注：本文代码需要 `<vector>`、`<algorithm>`（`std::swap`、`std::min`）；用到 `std::rand()` 的地方还需 `<cstdlib>` 和 `<ctime>`，并在 `main` 开头调用一次 `std::srand(std::time(nullptr))`，否则每次运行随机序列相同。

`std::pair` 需要 `<utility>`。

> ps:去搜一些排序的动画视频会非常有助于理解排序
## 希尔排序(Shell Sort)
基于插入排序的思想，所以先看一下插入排序。
### 插入排序
```c++
void InsertionSort(std::vector<int> &nums)
{
    int n = nums.size();
    for (int i = 1; i < n; i++)
    {
        int key = nums[i];
        int j = i - 1;
        while (j >= 0 && nums[j] > key)
        {
            nums[j + 1] = nums[j];
            j--;
        }
        nums[j + 1] = key;
    }
}
```

希尔排序的时间复杂度是O$(n ^{1.3})$ ，取决于间隔序列，折半序列最坏 O(n²)，实际通常快于插入排序。
```c++
void ShellSort(std::vector<int> &nums)
{
    int n = nums.size();
    for (int gap = n / 2; gap > 0; gap /= 2)
    {
        for (int i = gap; i < n; i++)
        {
            int key = nums[i];
            int j = i - gap;
            while (j >= 0 && nums[j] > key)
            {
                nums[j + gap] = nums[j];
                j -= gap;
            }
            nums[j + gap] = key;
        }
    }
}
```
## 快速排序(Quick Sort)

### 快排基本写法

```c++
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

### 加上随机选取下标

这样可以避免特定构造的数组让时间复杂度退化成O($n^{2}$)，大幅度降低时间复杂度退化成$O(n^2)$的概率。

```c++
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
    int idx = left + std::rand() % (right - left + 1);
    std::swap(nums[idx], nums[right]);
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

### 三路划分
这样可以在相同元素多的时候大幅度优化时间复杂度
```c++
std::pair<int, int> Partition3Way(std::vector<int> &nums, int lo, int hi)
{
    int pivot = nums[hi];
    int lt = lo;
    int gt = hi - 1;
    int i = lt;
    while (i <= gt)
    {
        int n = nums[i];
        if (n == pivot)
            i++;
        else if (n < pivot)
            std::swap(nums[lt++], nums[i++]);
        else
            std::swap(nums[i], nums[gt--]);
    }
    std::swap(nums[gt + 1], nums[hi]);
    return {lt, gt + 1};
}

void QuickSort3Way(std::vector<int> &nums, int left, int right)
{
    if (left >= right)
    {
        return;
    }
    std::pair<int, int> p = Partition3Way(nums, left, right);
    QuickSort3Way(nums, left, p.first - 1);
    QuickSort3Way(nums, p.second + 1, right);
    return;
}
```

### 只递归较短一侧的版本

用循环处理较长的一侧，只把较短的一侧交给递归，这样栈深度降到 O(log n)（原本空间复杂度有可能是O(n)，极不平衡的情况下）。
```c++
void QuickSortOneSide(std::vector<int> &nums, int left, int right)
{
    while (left < right)
    {
        int idx = left + std::rand() % (right - left + 1);
        std::swap(nums[idx], nums[right]);
        int pivot = nums[right];
        int i = left;
        for (int j = left; j < right; j++)
        {
            if (nums[j] < pivot)
                std::swap(nums[i++], nums[j]);
        }
        std::swap(nums[i], nums[right]);
        int p = i;

        if (p - left < right - p)
        {
            QuickSortOneSide(nums, left, p - 1);
            left = p + 1;
        }
        else
        {
            QuickSortOneSide(nums, p + 1, right);
            right = p - 1;
        }
    }
}
```
## 归并排序（Merge Sort）

时间复杂度$O(n \log n)$，自顶向下递归空间复杂度$O(\log n)$，但是被tmp数组覆盖，所以为O(n)空间复杂度，自底向上版本同样是O(n)空间复杂度。
### 递归版本（自顶向下）
```c++
void Merge(std::vector<int> &nums, int left, int mid, int right, std::vector<int> &tmp)
{
    int i = left, j = mid + 1, k = left;
    while (i <= mid && j <= right)
    {
        if (nums[i] <= nums[j])
            tmp[k++] = nums[i++];
        else
            tmp[k++] = nums[j++];
    }
    while (i <= mid)
        tmp[k++] = nums[i++];
    while (j <= right)
        tmp[k++] = nums[j++];
    for (int t = left; t <= right; t++)
        nums[t] = tmp[t];
}
void MergeSort(std::vector<int> &nums, int left, int right, std::vector<int> &tmp)
{
    if (left >= right)
        return;
    int mid = left + (right - left) / 2;
    MergeSort(nums, left, mid, tmp);
    MergeSort(nums, mid + 1, right, tmp);
    Merge(nums, left, mid, right, tmp);
}
```

### 自底向上
```c++
/*void Merge(std::vector<int> &nums, int left, int mid, int right, std::vector<int> &tmp)
{
    int i = left, j = mid + 1, k = left;
    while (i <= mid && j <= right)
    {
        if (nums[i] <= nums[j])
            tmp[k++] = nums[i++];
        else
            tmp[k++] = nums[j++];
    }
    while (i <= mid)
        tmp[k++] = nums[i++];
    while (j <= right)
        tmp[k++] = nums[j++];
    for (int t = left; t <= right; t++)
        nums[t] = tmp[t];
}
*/
void MergeSortBottomUp(std::vector<int> &nums)
{
    int n = nums.size();
    std::vector<int> tmp(n);
    for (int width = 1; width < n; width *= 2)
    {
        for (int left = 0; left < n; left += 2 * width)
        {
            int mid = std::min(left + width - 1, n - 1);
            int right = std::min(left + 2 * width - 1, n - 1);
            if (mid < right)
                Merge(nums, left, mid, right, tmp);
        }
    }
}
```
## 堆排序(Heap Sort)

### 建堆

`Heapify` 从最后一个非叶子节点开始筛(SiftDown)，建议看视频动画演示。Siftdown时比较用 `>` 而不是 `>=`：相等时不交换，少做无谓的交换和递归。
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

```c++
void HeapSort(std::vector<int> &nums)
{
    Heapify(nums);
    int n = nums.size();
    for (int i = n - 1; i > 0; i--)
    {
        std::swap(nums[0], nums[i]);
        SiftDown(nums, i, 0);
    }
}
```



