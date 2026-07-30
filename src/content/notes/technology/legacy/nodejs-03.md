---
title: "Node.js 学习笔记（三）：Path 与 OS 模块"
description: "旧站 Node.js 系列第三篇，整理路径处理、文件信息和操作系统模块的常用接口。"
type: note
domain: technology
topics:
  - "Node.js"
tags:
  - "Node"
  - "前端"
  - "JavaScript"
  - "Path"
  - "历史笔记"
status: archived
created: 2023-01-07
updated: 2023-01-07
difficulty: beginner
series: "Node.js 旧站学习笔记"
order: 3
draft: false
featured: false
legacyUrl: "/2023/01/07/Node2020笔记（3）/"
sourceType: migration
---
> 迁移说明：本文来自旧 Hexo 站点，保留当时的学习记录与代码写法，可能不代表当前最佳实践。

## path模块
- path.resolve([...paths])把一个路径或路径片段得多序列解析为一个绝对路径
```
path.resolve('foo','/baz','bar');
//C:\baz\bar
```
- path.join([...paths])方法使用平台特定的分隔符吧所有全部给定的path拼接到一起，并规范化生成的路径。
```
let path = require("path")
let fs = require("fs")

console.log(path)

let strPath = "http://www.newsimg.cn/xjp20171103/images/xjp_banner.jpg";
//获取路径信息的扩展名
let info =path.extname(strPath)
console.log(info)

let arr = ['/sxt','qianduan',"zhongji"]
let info1 = path.resolve(...arr)
console.log(info1)

//获取当前执行目录的完整路径
console.log(__dirname)
let info2 = path.join(__dirname,'sxt','qianduan','zhongji')
console.log(info2)

//
let str = "http://www.sxt.com/xinwen/guonei.html";

//解析出请求目录
let arrParse = str.split('/')
console.log(arrParse)
arr = arrParse.slice(arrParse.length-2,arrParse.length)
console.log(arr)

let filePath = path.join(__dirname,...arr)
console.log(filePath)
fs.readFile(filePath,{encoding:'utf-8'},function(err,data){
    if(err){
        console.log(err)
    }else{
        console.log(data)
    }
})
```

```
let path = require('path')

//获取当前执行文件的目录
console.log(__dirname)

//获取当前的执行文件
console.log(__filename)

console.log(path.extname(__filename))
//解析路径，可以将路径信息直接解析出来,解析出根路径，目录，扩展名，文件名称，文件名，扩展名
console.log(path.parse(__filename))
```
### os模块
· os.totalmem() 获取内存大小
