---
title: "基础算法（一）：排序、查找与字符串"
description: "旧站算法笔记，记录排序、二分查找、双指针、滑动窗口与字符串相关练习。"
type: note
domain: technology
topics:
  - "数据结构与算法"
tags:
  - "算法"
  - "排序"
  - "查找"
  - "历史笔记"
status: archived
created: 2023-01-14
updated: 2023-01-14
difficulty: beginner
series: "基础算法旧站笔记"
order: 1
draft: false
featured: false
legacyUrl: "/2023/01/14/算法基础/"
sourceType: migration
---
> 迁移说明：本文来自旧 Hexo 站点，保留当时的学习记录与代码写法，可能不代表当前最佳实践。

### 一、排序和查找

#### 排序

* 快排
* 归并排序

#### 二分查找

* 整数
* 浮点数



> ### 快速排序———分治思想



1. 确定分界点：

> 图像缺失：旧文章引用的是作者电脑本地文件，源文件未随仓库保存。
暴力做法

> 图像缺失：旧文章引用的是作者电脑本地文件，源文件未随仓库保存。
> 图像缺失：旧文章引用的是作者电脑本地文件，源文件未随仓库保存。
代码：

```c++
#include <iostream>

using namespace std;

const int N =1000010;


int q[N];

void quick_sort(int q[], int l, int r)
{
    if (l >= r) return;

    int x=q[l + r >> 1],i = l - 1, j = r + 1;

    while (i < j){
        do i ++ ; while (q[i] < x);
        do j -- ; while (q[j] > x);
        if (i < j) swap(q[i], q[j]);
    }
    quick_sort(q, l, j);
    quick_sort(q, j + 1, r);
}

int main()
{
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i ++ ) scanf("%d", &q[i]);

    quick_sort(q, 0 ,n - 1);

    for (int i = 0; i < n; i ++ ) printf("%d ",q[i]);

    return 0;
}

```


> ### 归并排序

> 图像缺失：旧文章引用的是作者电脑本地文件，源文件未随仓库保存。
> 图像缺失：旧文章引用的是作者电脑本地文件，源文件未随仓库保存。
时间复杂度讨论：


归并排序最后一步 合二为一 的时间复杂度是O（n）


快排的平均时间复杂度是nlogn


最坏n^2 不过也达不到


归并排序的时间复杂度是nlogn


归并：递归一共logn层


每一层都是O（n）


快排：期望划分是2/n 然后也会有logn层 同样就是nlogn了

代码

```c++
void merge_sort(int q[], int l, int r)
{
    if (l >= r) return;

    int mid = l + r >> 1;
    merge_sort(q, l, mid);
    merge_sort(q, mid + 1, r);
    
    int k = 0, i = l, j = mid + 1;
    while (i <= mid && j <= r)
        if (q[i] <= q[j]) tmp[k ++ ] = q[i ++ ];
        else tmp[k ++ ] = q[j ++ ];
    
    while (i <= mid) tmp[k ++ ] = q[i ++ ];
    while (j <= r) tmp[k ++ ] = q[j ++ ];
    
    for (i = l, j = 0; i <= r; i ++, j ++ ) q[i] = tmp[j];
}

```
> ### 整数二分查找

整数查找会有边界问题，容易陷入死循环

 

有单调性一定可以二分，二分不一定需要单调性 

二分的本质是边界点 

本质：给定某个区间，在区间上定义了某种性质，使得整个区间一分为二，一半区间满足性质（绿色），另一半不满足性质（红色），那么二分可以寻找这种性质的边界，既可以寻找绿色边界，又可以寻找红色边界。

> 图像缺失：旧文章引用的是作者电脑本地文件，源文件未随仓库保存。
> 图像缺失：旧文章引用的是作者电脑本地文件，源文件未随仓库保存。
```c++
int bsearch_1(int l, int r)
{
    while (l < r)
    {
        int mid = l + r >> 1; //除2 操作
        if (check(mid)) r = mid; //check函数即为边界的选择
        else l = mid + 1;
    }
    return l; //l r都可以，跳出while r = l
}

```




> 图像缺失：旧文章引用的是作者电脑本地文件，源文件未随仓库保存。
```c++
int bsearch_1(int l, int r)
{
    while (l < r)
    {
        int mid = l + r >> 1; //除2 操作
        if (check(mid)) r = mid; //check函数即为边界的选择
        else l = mid + 1;
    }
    return l; //l r都可以，跳出while r = l
}

```
