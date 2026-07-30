---
title: "TypeScript 初学（二）：函数"
description: "旧站 TypeScript 系列第二篇，记录函数参数、默认值、剩余参数、重载与箭头函数。"
type: note
domain: technology
topics:
  - "TypeScript"
tags:
  - "TypeScript"
  - "前端"
  - "函数"
  - "历史笔记"
status: archived
created: 2023-01-07
updated: 2023-01-07
difficulty: beginner
series: "TypeScript 旧站学习笔记"
order: 2
draft: false
featured: false
legacyUrl: "/2023/01/07/Typescript（二）/"
sourceType: migration
---
> 迁移说明：本文来自旧 Hexo 站点，保留当时的学习记录与代码写法，可能不代表当前最佳实践。

### 函数

#### 3.1 函数的定义


```
//es5定义函数的方法

//函数声明法
function run(){
    return 'run';
}

//匿名函数
var run2 = function () {
    return 'run2';
}

//ts中定义函数的方法

//函数声明法
function fun1(): string {
    return 'run';
}

//匿名函数
var fun2 = function (): number {
    return 123;
}
fun2();   //调用方法

//ts中定义方法传参
function getInfo(name: string, age: number): string {
    return `${name} --- ${age}`
}

alert(getInfo('zhangsan',12));


var getInfo=function (name:string,age:number):string {
    return `${name}--${age}`;
}
alert(getInfo('zhangsan',13));

//没有返回值的方法
function  fun3():void {
    console.log("run")
}
fun3();
```


####  3.2 方法可选参数


```
//es5里面方法的实参和形参可以不一样，但是ts中必须一样，如果不一样就需要配置可选参数

function getInfo(name:string,age?:number):string {
    if(age){

    return `${name} --- ${age}`
}else {
        return `${name} ---年龄保密`
    }

}

alert(getInfo('zhangsan',13));
alert(getInfo('zhangsan'));

// 注意：可选参数必须配置到参数的最后面
```

#### 3.3默认参数


```
// es5里面没法设置默认参数，es6和ts都可以设置默认参数

function getInfo(name:string,age:number=20):string {
    if(age){

        return `${name} --- ${age}`
    }else {
        return `${name} ---年龄保密`
    }
}
    alert(getInfo("张三",30));
```


####  3.4 剩余参数


```
// 三点运算符 接受形参传过来的值
function  sum(...result:number[]) :number{
   var sum=0;
   for (var i=0;i<result.length;i++){
       sum+=result[i];
   }
    return sum
}

console.log(sum(1, 2, 3, 4,54));

function  sum(a:number,...result:number[]) :number{
   var sum=a;
   for (var i=0;i<result.length;i++){
       sum+=result[i];
   }
    return sum
}
```

#### 3.5 函数重载


```
//typescript中的重载，通过为同一个函数提供多个函数类型定义来实现多种功能的目的
    //ts为了兼容es5以及es6重载的写法和java中有区别
function getInfo(name:string):string;

function getInfo(age:number):number;

function getInfo(str:any):any{
    if(typeof str==='string'){
        return "我叫"+str
    }else {
        return  "我的年龄是"+str;
    }
}
alert(getInfo('张三'));

alert(getInfo(20));

function getInfo(name:string):string;

function getInfo(name:string,age:number):string;

function getInfo(name:any,age?:any):any {
    if(age){
        return "我叫"+name+",我的年龄是"+age;
    }else {
        return `我叫${name}`
    }
}
alert(getInfo('张三',20));
```



####  3.6 箭头函数
##### this指向问题  箭头函数里this指向上下文

```
setTimeout(()=>{
    console.log(123)
},1000)
```
