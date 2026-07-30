---
title: "TypeScript 初学（一）：基础数据类型"
description: "旧站 TypeScript 系列第一篇，记录布尔值、数字、字符串、数组、元组、void 与 never 等类型。"
type: note
domain: technology
topics:
  - "TypeScript"
tags:
  - "TypeScript"
  - "前端"
  - "类型系统"
  - "历史笔记"
status: archived
created: 2023-01-07
updated: 2023-01-07
difficulty: beginner
series: "TypeScript 旧站学习笔记"
order: 1
draft: false
featured: false
legacyUrl: "/2023/01/07/Typescript（一）/"
sourceType: migration
---
> 迁移说明：本文来自旧 Hexo 站点，保留当时的学习记录与代码写法，可能不代表当前最佳实践。

####  typescript中为了使编写的代码更规范，更有利于维护，增加了类型检验,写ts代码必须指定类型

###  typescript数据类型
-  布尔类型（boolean）
-    数字类型（number）
-    字符串类型（string）
-    数组类型（Array）
-    元组类型（tuple）
-    枚举类型（enum）
-    任意类型（any）
-    null和undefined
-    void类型
-    never类型
- 
#### 布尔类型

```
var flag: boolean = true;
// flag=123   错误写法
flag = false

console.log(flag)
```

//数字类型

```
var num: number = 123;
console.log(num);
```


#### 字符串类型

```
var str: string = 'this is ts';

str = "lalala";
console.log(str);
```

#### 数组类型

```
//数组 ts中定义数组有两种方式

//1.第一种
// var arr=['1','2'];  //es5定义数组
var arr: number[] = [11, 22, 443];
console.log(arr);

//第二种
var arr1: Array<number> = [11, 33, 523]
console.log(arr1);

//第三种
var arr4:any[]=['123213',22,true];
```



#### 元组类型（tuple） 属于数组的一种

```
let arr3: [number, string] = [123, '4232'];

console.log(arr3);
```


//枚举类型

```
enum Flag {
    success,
    error
}

let f: Flag = Flag.error
console.log(f);

enum Color {
    blue, red = 3, 'orange'
}

var c: Color = Color.blue;
console.log(c);  //0  如果标识符没有赋值  它的值就是下标

enum Err {
    'undefined' = -1, 'null' = -2,
    'success' = 1
}

var e: Err = Err.success
console.log(e)
```


#### 任意类型

```
var num1: any = 123;
num1 = 'str';
num1 = true;
console.log(num1)
```



#### 任意类型的用途

```
var oBox: any = document.getElementById('box');
oBox.style.color = 'red';
```


#### null 和undefined  其他（never类型）数据类型的子类型
```
var num3: undefined;// console.log(num3);  //正确

 var num3:number |undefined;  //定义没有赋值就是undefined
 num3=123
 console.log(num3)

 var num2:null;
 num2=null;
```



#### 一个元素可能是number类型 可能是null 可能是undefined


```
var num2: number | null | undefined;
 num2 = 1234;
console.log(num)
```


#### void 类型：typescript中的void表示没有任何类型，一般用于定义方法的时候没有返回值。


```
// es5的写法
 function run() {
     console.log("run")
 }
 run();

//表示方法没有返回任何类型
 function run():void {
     console.log("run")
 }
 run();

//正确写法
function run(): number {
    console.log("run")
    return 123
}

run();
```


#### never类型：
##### 是其他类型（包括null和undefined）的子类型，代表从不会出现的值，这意味着声明never只能被never类型所赋值

```
var a: undefined;
a = undefined  //正确

var b: null;
// b=undefined 报错
b = null; //正确



var abc:never;
abc=(()=>{
    throw  new Error('错误')
})()
```
