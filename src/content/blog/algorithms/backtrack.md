---
title: 回溯算法
description: LeetCode中的经典回溯算法题
pubDate: 2026-10-05
---

通常用来解决全排列问题
```c++
class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> ans;
        int n = nums.size();
        if(n == 0) return {};
        auto backtrack = [n](this auto&& self,vector<vector<int>>& res,vector<int>& temp,int first)->void
        {
            if(first + 1 == n)
            {
                res.emplace_back(temp);
                return;
            }
            for(int i = first ; i <= n - 1; i++)
            {
                swap(temp[first],temp[i]);
                self(res,temp,first + 1);
                swap(temp[i],temp[first]);
            }
        };
        vector<int> temp(nums); 
        backtrack(ans, temp, 0);
        return ans;
    }
};
```