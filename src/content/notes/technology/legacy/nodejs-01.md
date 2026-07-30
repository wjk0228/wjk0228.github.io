---
title: "Node.js 学习笔记（一）：基础、模块与文件系统"
description: "旧站 Node.js 系列第一篇，记录运行时特点、模块系统、文件系统与流的基础用法。"
type: note
domain: technology
topics:
  - "Node.js"
tags:
  - "Node"
  - "前端"
  - "JavaScript"
  - "历史笔记"
status: archived
created: 2023-01-07
updated: 2023-01-07
difficulty: beginner
series: "Node.js 旧站学习笔记"
order: 1
draft: false
featured: false
legacyUrl: "/2023/01/07/Node2020笔记（1）/"
sourceType: migration
---
> 迁移说明：本文来自旧 Hexo 站点，保留当时的学习记录与代码写法，可能不代表当前最佳实践。

### 1.Node的简介
Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，nodejs允许javascript代码运行在服务端
- 单线程
- 非阻塞I/O
- 事件驱动
#### 单线程
单线程：不再有线程的创建、销毁的时间开销。
单线程也能造成宏观上的“并发”
#### 非阻塞I/O
I/O阻塞了代码的执行，极大地降低了程序的执行效率。而非阻塞模式下，一个线程永远在执行计算操作，这个线程的CPU核心利用率永远是100%。

### 2.模块化系统
导入导出
Node.js中的模块分类：
- 核心模块（已封装好的内置模块）
- 自己定义模块
- 第三方模块

1. Node中每个模块都有一个module对象，module对象中的有一个exports属性为一个接口对象，我们需要把模块之间公共的方法或属性挂载在这个接口对象中，方便其他的模块使用这些公共的方法或属性。
2. Node中每个模块的最后，都会return: module.exports。
3. Node中每个模块都会把module.exports指向的对象赋值给一个变量exports，也就是说：exports = module.exports。
4. module.exports = XXX，表示当前模块导出一个单一成员，结果就是XXX。
5. 如果需要导出多个成员时必须使用exports.add = XXX;exports.foo=XXX;或者使用module.exports.add = XXX; module.export.foo = XXX;。


### 3.fs模块
```
var fs= require('fs');
//导入文件模块  node读写文件也有同步和异步的接口 

//同步
var content=fs.readFileSync('hello.txt',{flag:'r',encoding:'utf-8'})
//异步
fs.readFile('hello.txt',{flag:'r',encoding:'utf-8'},function(data,err){
    if(err){
        console.log(err)
    }
})
fs.readSync()
```

### fs模块综合封装
```
let fs = require('fs')
function fsRead(path){
    return new Promise(function(resolve,reject){
        fs.readFile(path,{flag:'r',encoding:"utf-8"},function(err,data){
            if(err){
                //console.log(err)
                //失败执行的内容
                reject(err)

            }else{
                //console.log(data)
                //成功执行的内容
                resolve(data)
            }
            //console.log(456)
        })
    })
}


function fsWrite(path,content){
    return new Promise(function(resolve,reject){
        fs.writeFile(path,content,{flag:"a",encoding:"utf-8"},function(err){
            if(err){
                //console.log("写入内容出错")
                reject(err)
            }else{
                resolve(err)
                //console.log("写入内容成功")
            }
        })
    })
}

function fsDir(path){
    return new Promise(function(resolve,reject){
        fs.mkdir(path,function(err){
            if(err){
                reject(err)
            }else{
                resolve("成功创建目录")
            }
        })
    })
}

module.exports = {fsRead,fsWrite,fsDir}
```
### Node.js Stream(流)
Stream 是一个抽象接口，Node 中有很多对象实现了这个接口。例如，对http 服务器发起请求的request 对象就是一个 Stream，还有stdout（标准输出）。

Node.js，Stream 有四种流类型：
- Readable - 可读操作。
- Writable - 可写操作。
- Duplex - 可读可写操作.
- Transform - 操作被写入数据，然后读出结果。

所有的 Stream 对象都是 EventEmitter 的实例。常用的事件有：
- data - 当有数据可读时触发。
- end - 没有更多的数据可读时触发。
- error - 在接收和写入过程中发生错误时触发。
- finish - 所有数据已被写入到底层系统时触发。
- 。

从流中读取数据
创建 input.txt 文件，内容如下：
```
www.sxt.com
```
创建 main.js 文件, 代码如下：
```
var fs = require("fs");
var data = '';

// 创建可读流
var readerStream = fs.createReadStream('input.txt');

// 设置编码为 utf8。
readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
readerStream.on('data', function(chunk) {
   data += chunk;
});

readerStream.on('end',function(){
   console.log(data);
});

readerStream.on('error', function(err){
   console.log(err.stack);
});

console.log("程序执行完毕");
```
以上代码执行结果如下：
```
程序执行完毕地址：www.sxt.com
```
### 写入流
创建 main.js 文件, 代码如下：
```
var fs = require("fs");
var data = 'www.sxt.com';

// 创建一个可以写入的流，写入到文件 output.txt 中
var writerStream = fs.createWriteStream('output.txt');

// 使用 utf8 编码写入数据
writerStream.write(data,'UTF8');

// 标记文件末尾
writerStream.end();

// 处理流事件 --> data, end, and error
writerStream.on('finish', function() {
    console.log("写入完成。");
});

writerStream.on('error', function(err){
   console.log(err.stack);
});

console.log("程序执行完毕");
```
以上程序会将 data 变量的数据写入到 output.txt 文件中。代码执行结果如下：
```
$ node main.js 
程序执行完毕
写入完成。
```
查看 output.txt 文件的内容：
```
$ cat output.txt 
www.sxt.com
```
### 管道流
管道提供了一个输出流到输入流的机制。通常我们用于从一个流中获取数据并将数据传递到另外一个流中。

以下实例我们通过读取一个文件内容并将内容写入到另外一个文件中。

设置 input.txt 文件内容如下：
```
教程官网地址：www.sxt.com
管道流操作实例
```
创建 main.js 文件, 代码如下：
```
var fs = require("fs");

// 创建一个可读流
var readerStream = fs.createReadStream('input.txt');

// 创建一个可写流
var writerStream = fs.createWriteStream('output.txt');

// 管道读写操作
// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
readerStream.pipe(writerStream);

console.log("程序执行完毕");
```
代码执行结果如下：
```
$ node main.js 
程序执行完毕
```
查看 output.txt 文件的内容：
```
$ cat output.txt 
教程官网地址：www.sxt.com
管道流操作实例
```
### 链式流
链式是通过连接输出流到另外一个流并创建多个流操作链的机制。链式流一般用于管道操作。

接下来我们就是用管道和链式来压缩和解压文件。

创建 compress.js 文件, 代码如下：
```
var fs = require("fs");
var zlib = require('zlib');

// 压缩 input.txt 文件为 input.txt.gz
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('input.txt.gz'));
  
console.log("文件压缩完成。");
```
代码执行结果如下：
```
$ node compress.js 
文件压缩完成。
```
执行完以上操作后，我们可以看到当前目录下生成了 input.txt 的压缩文件 input.txt.gz。

接下来，让我们来解压该文件，创建 decompress.js 文件，代码如下：
```
var fs = require("fs");
var zlib = require('zlib');

// 解压 input.txt.gz 文件为 input.txt
fs.createReadStream('input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('input.txt'));
  
console.log("文件解压完成。");
```
代码执行结果如下：
```
$ node decompress.js 
文件解压完成。
```
