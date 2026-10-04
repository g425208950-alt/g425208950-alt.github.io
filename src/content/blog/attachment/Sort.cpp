#include <vector>
#include <utility>
#include <iostream>
/*
 * @lc app=leetcode.cn id=215 lang=cpp
 *
 * [215] 数组中的第K个最大元素
 */

// @lc code=start
class Solution
{
public:
    // int partition(std::vector<int>& nums, int left, int right)
    // {

    // }

    // void QuickSort(std::vector<int>& nums)
    // {

    // }

    // int findKthLargest(std::vector<int> &nums, int k)
    // {

    // }
};

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

void HeapSort(std::vector<int> &nums)
{
    Heapify(nums);
    
}

// @lc code=end
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
// int Partition(std::vector<int> &nums, int left, int right)
// {
//     if (left >= right)
//     {
//         return -1;
//     }
//     int pivot = nums[right];
//     int i = left;
//     for (int j = left; j < right; j++)
//     {
//         if (nums[j] < pivot)
//         {
//             std::swap(nums[i], nums[j]);
//             ++i;
//         }
//     }
//     std::swap(nums[i], nums[right]);
//     return i;
// }
// // 写一个快排demo
// void QuickSort(std::vector<int> &nums, int left, int right)
// {
//     int p = Partition(nums, left, right);
//     if (p == -1)
//         return;
//     QuickSort(nums, left, p - 1);
//     QuickSort(nums, p + 1, right);
//     return;
// }

void Merge(std::vector<int> &nums, int left, int right)
{
    int avg = left + (right - left) / 2;
    // nums[left, avg - 1] nums[avg, right];
    std::vector<int> temp;
    temp.reserve(right - left + 1);
    int num1 = left;
    int num2 = avg + 1;
    while (num1 <= avg && num2 <= right)
    {
        if (nums[num1] <= nums[num2])
        {
            temp.push_back(nums[num1++]);
        }
        else
        {
            temp.push_back(nums[num2++]);
        }
    }
    while (num1 <= avg)
    {
        temp.push_back(nums[num1++]);
    }
    while (num2 <= right)
    {
        temp.push_back(nums[num2++]);
    }
    std::copy(temp.begin(), temp.end(), nums.begin() + left);
}

// void MergeSort(std::vector<int>& nums, int left, int right)
// {
//     if (right - left >= 1)
//     {
//         int avg = left + (right - left) / 2;
//         MergeSort(nums, left, avg);
//         MergeSort(nums, avg + 1, right);
//     }
//     else if (right <= left)
//     {
//         return;
//     }
//     Merge(nums, left, right);
//     return;
// }

// 写一个非递归MergeSort()
void MergeSort()
{
    
}

void TestMerge()
{
    std::vector<int> v = {1, 3, 5, 2, 4, 6};
    Merge(v, 0, 5);
    std::cout << "Merge 结果:";
    for (int i : v)
    {
        std::cout << i << " ";
    }
    std::cout << std::endl;
}

void TestMergeSort()
{
    std::vector<int> v = {9, 1, 5, 7, 4, 8, 6, 2, 3};
    std::cout << "Origin Vector:";
    for (int i : v)
    {
        std::cout << i << " ";
    }
    std::cout << std::endl;

    MergeSort(v, 0, 8);
    std::cout << "MergeSort:";
    for (int i : v)
    {
        std::cout << i << " ";
    }
    std::cout << std::endl;
}

int main()
{
    // std::vector<int> v{9, 1, 5, 7, 4, 8, 6, 2, 3};
    // QuickSort3Way(v, 0, 8);
    // std::cout << "QuickSort之后的数组:" << std::endl;
    // for (int i : v)
    // {
    //     std::cout << i << " ";
    // }
    // std::cout << std::endl;
    //TestMerge();
    TestMergeSort();

    return 0;
}
