---
title: 回溯算法
description: LeetCode中的经典回溯算法题
pubDate: 2026-10-05
---

通常用来解决全排列问题

leetcode 46.全排列：
> 给定一个不含重复数字的数组 `nums` ，返回其 _所有可能的全排列_ 。你可以 **按任意顺序** 返回答案。
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
leetcode 437.路径总和

下面的代码是自己写的粗糙实现，有更好的算法，这里backtrack可以用来减少很多空间复杂度，否则只能用很多次deque的拷贝构造，这里的容器用支持尾插和尾删的就行。
```c++
public:
    int pathSum(TreeNode* root, int targetSum)
    {
        _targetSum = targetSum;
        int ans = 0;
        std::deque<int> q{};
        auto backtrack = [targetSum,this](this auto&& self, TreeNode* root, std::deque<int>& q, int& count)->void
            {
                if (root == nullptr)
                {
                    return;
                }
                // 写一个检查逻辑
                int target = _targetSum - root->val;
                count += Check(q, target);
                // 传递容器
                q.push_back(root->val);
                self(root->left, q, count);
                self(root->right, q, count);
                q.pop_back();
                return;
            };
        backtrack(root, q, ans);

        return ans;
    }
};
```
这个是优化过的实现，也用到了回溯算法，非常巧妙。
```c++
int pathSum(TreeNode* root, int targetSum) {
        std::unordered_map<long long, int> cnt;
        cnt[0] = 1;                          // 空前缀，对应从根开始的路径
        int ans = 0;
        auto dfs = [&](this auto&& self, TreeNode* node, long long prefix) -> void {
            if (!node) return;
            prefix += node->val;
            auto it = cnt.find(prefix - targetSum);
            if (it != cnt.end()) ans += it->second;
            ++cnt[prefix];
            self(node->left, prefix);
            self(node->right, prefix);
            if (--cnt[prefix] == 0) cnt.erase(prefix);
            };
        dfs(root, 0);
        return ans;
    }
```