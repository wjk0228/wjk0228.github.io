---
title: "Node.js 学习笔记（二）：事件循环与事件驱动"
description: "旧站 Node.js 系列第二篇，记录事件循环、EventEmitter 与事件驱动程序的基础概念。"
type: note
domain: technology
topics:
  - "Node.js"
tags:
  - "Node"
  - "前端"
  - "JavaScript"
  - "事件循环"
  - "历史笔记"
status: archived
created: 2023-01-07
updated: 2023-01-07
difficulty: beginner
series: "Node.js 旧站学习笔记"
order: 2
draft: false
featured: false
legacyUrl: "/2023/01/07/Node2020笔记（2）/"
sourceType: migration
---
> 迁移说明：本文来自旧 Hexo 站点，保留当时的学习记录与代码写法，可能不代表当前最佳实践。

## Node事件循环
Node.js 是单进程单线程应用程序，但是因为
V8引擎提供的异步执行回调接口，通过这些接口可以处理大量的并发，所以性能非常高。

Node.js 几乎每一个 API 都是支持回调函数的。

Node.js 基本上所有的事件机制都是用设计模式中观察者模式实现。

Node.js 单线程类似进入一个while(true)的事件循环，直到没有事件观察者退出，每个异步事件都生成一个事件观察者，如果有事件发生就调用该回调函数.
```
开启进程
开启线程
初始化数据，window/document/location...
while(true){
    
    初始化事件列表
    根据事件修改数据
    根据数据去渲染页面
    
    
    if(count=0){
        运行js代码
        btn.onclick = function(){
            document.body.style.background = "skyblue"
            console.log(123)
        }
        console.log(456)
        count++
    }
    
    
}
```
### 事件驱动程序
Node.js 使用事件驱动模型，当web server接收到请求，就把它关闭然后进行处理，然后去服务下一个web请求。

当这个请求完成，它被放回处理队列，当到达队列开头，这个结果被返回给用户。

这个模型非常高效可扩展性非常强，因为 webserver 一直接受请求而不等待任何读写操作。（这也称之为非阻塞式IO或者事件驱动IO）

在事件驱动模型中，会生成一个主循环来监听事件，当检测到事件时触发回调函数。

Node.js 有多个内置的事件，我们可以通过引入 events 模块，并通过实例化 EventEmitter 类来绑定和监听事件，如下实例：
```
// 引入 events 模块
var events = require('events');
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();
以下程序绑定事件处理程序：

// 绑定事件及事件的处理程序
eventEmitter.on('eventName', eventHandler);
我们可以通过程序触发事件：

// 触发事件
eventEmitter.emit('eventName');
```
#### 实例
创建 main.js 文件，代码如下所示：

##### 实例
```
// 引入 events 模块
var events = require('events');
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();
 
// 创建事件处理程序
var connectHandler = function connected() {
   console.log('连接成功。');
  
   // 触发 data_received 事件 
   eventEmitter.emit('data_received');
}
 
// 绑定 connection 事件处理程序
eventEmitter.on('connection', connectHandler);
 
// 使用匿名函数绑定 data_received 事件
eventEmitter.on('data_received', function(){
   console.log('数据接收成功。');
});
 
// 触发 connection 事件 
eventEmitter.emit('connection');
 
console.log("程序执行完毕。");
```
接下来让我们执行以上代码：
```
$ node main.js
连接成功。
数据接收成功。
程序执行完毕。
```
