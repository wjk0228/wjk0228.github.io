---
title: "Node.js 学习笔记（四）：URL 与网页数据抓取"
description: "旧站 Node.js 系列第四篇，记录 URL 模块、HTTP 请求、Cheerio 解析与文件下载示例。"
type: note
domain: technology
topics:
  - "Node.js"
tags:
  - "Node"
  - "前端"
  - "JavaScript"
  - "网络请求"
  - "历史笔记"
status: archived
created: 2023-01-07
updated: 2023-01-07
difficulty: beginner
series: "Node.js 旧站学习笔记"
order: 4
draft: false
featured: false
legacyUrl: "/2023/01/07/Node2020笔记（4）/"
sourceType: migration
---
> 迁移说明：本文来自旧 Hexo 站点，保留当时的学习记录与代码写法，可能不代表当前最佳实践。

## url模块
### 1.url.parse()
url.parse() 方法可以解析一个url地址，通过传入第二个参数（true）把包含有查询字符串的query转换成对象
```
let url=require('url');
let obj=url.parse('http://www.baidu.com?name=cc&age=24')
```
### 2.url.resolve()

url.resolve()方法解析相对于基URL的目标URL。第一个参数：基URL，第二个参数：目标URL  (合成)
```
let url=require('url');
let obj=url.resolve('http://www.baidu.com/home','/about')
```
### url模块的应用--爬取数据
```
//let axios = require('axios');
let request = require('request')
let fs = require('fs')
let {fsWrite,fsRead,fsDir} = require('./fs')
//console.log(axios)
let httpUrl = "https://www.1905.com/vod/list/n_1_t_1/o3p1.html"




//获取分类里的电影链接
//根据电影链接获取电影的详细信息

function req(url){
    return new Promise(function(resolve,reject){
        request.get(url,function(err,response, body){
            if(err){
                reject(err)
            }else{
                resolve({response,body})
            }
        })
    })
}


//获取起始页面的所有分类地址
async function getClassUrl(){
    let {response,body} = await req(httpUrl)
    //console.log(body)
    let reg = /<span class="search-index-L">类型(.*?)<div class="grid-12x">/igs
    //解析html内容
    let result = reg.exec(body)[1]
    
   //<a href="" >微电影</a>
   
    let reg1 = /<a href="javascript\:void\(0\);" onclick="location\.href='(.*?)';return false;" >(.*?)<\/a>/igs
    let arrClass = []
    var res;
    while( res = reg1.exec(result) ){
        if(res[2]!="全部"){
            let obj = {
                className:res[2],
                url:res[1]
            }
            arrClass.push(obj)
            
            await fsDir('./movies/'+res[2])
            getMovies(res[1],res[2])
        }
    }
    console.log(arrClass)


    

}

//通过分类，获取页面中的电影链接
async function getMovies(url,moviesType){
    let {response,body} = await req(url)
    let reg = /<a class="pic-pack-outer" target="_blank" href="(.*?)".*?><img/igs;
    var res;
    var arrList = []

    while(res = reg.exec(body)){
        //改进，可以改为迭代器，提升性能
        
        arrList.push(res[1])
        parsePage(res[1],moviesType)
    }
    //console.log("分类：",moviesType)
    console.log(arrList)
}


//

async function parsePage(url,moviesType){
    let {response,body} = await req(url)

    let reg = /<h1 class="playerBox-info-name playerBox-info-cnName">(.*?)<\/h1>.*?id="playerBoxIntroCon">(.*?)<a.*?导演.*?target="\_blank" title="(.*?)" data-hrefexp/igs;
    let res = reg.exec(body)
    console.log(res[1])
    let movie = {
        name:res[1],
        brief:res[2],
        daoyan:res[3],
        movieUrl:url,
        moviesType
    }
    let strMovie = JSON.stringify(movie)
    fsWrite('./movies/'+moviesType+"/"+res[1]+".json",strMovie)

}


getClassUrl()
```
#### 爬取数据 cheerio

```
cheerio是nodejs的抓取页面模块，为服务器特别定制的，快速、灵活、实施的jQuery核心实现
```

```
var cheerio = require('cheerio'),
    $ = cheerio.load('<h2 class = "title">Hello world</h2>');

$('h2.title').text('Hello there!');
$('h2').addClass('welcome');

$.html();
//=> <h2 class = "title welcome">Hello there!</h2>

```
#### 实例 -爬取表情包
```
const cheerio = require("cheerio");
const axios = require('axios')
const fs = require('fs')
const url = require('url')
const path = require('path')
//获取HTML文档的内容，内容的获取跟jquery一样

let httpUrl = "https://www.doutula.com/article/list/?page=1"
//等待函数
async function wait(milliseconds){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve()
        },milliseconds)
    })
}

//获取页面总数
async function getNum(){
    res = await axios.get(httpUrl)
    let $ = cheerio.load(res.data)
    let btnLength = $('.pagination li').length;
    let allNum = $('.pagination li').eq(btnLength-2).find('a').text()
    //console.log(allNum)
    return allNum
} 

async function spider(){
    //获取所有的页面总数
    let allPageNum = await getNum()
    for(let i=1;i<=allPageNum;i++){
        await wait(2000)
        getListPage(i)
    }
}

async function getListPage(pageNum){
    let httpUrl = "https://www.doutula.com/article/list/?page="+pageNum;
    let res = await axios.get(httpUrl)
    //console.log(res.data)
    //cheerio解析html文档
    let $ = cheerio.load(res.data)
    //获取当前页面的所有的表情页面的链接
    $('#home .col-sm-9>a').each(async (i,element)=>{
       let  pageUrl = $(element).attr('href');
       let title = $(element).find('.random_title').text()
       let reg = /(.*?)\d/igs;
       title = reg.exec(title)[1];
       fs.mkdir('./img/'+title,function(err){
            if(err){
                //console.log(err)
            }else{
                console.log("成功创建目录："+'./img/'+title)
            }
       });
       //console.log(title)
       await wait(100);
       parsePage(pageUrl,title)
    })
}



async function parsePage(pageUrl,title){
    let res = await axios.get(pageUrl);
    let $ = cheerio.load(res.data)
    $('.pic-content img').each(async (i,element)=>{
        let imgUrl = $(element).attr('src')
       
        //console.log(path.parse(imgUrl))
        extName = path.extname(imgUrl)
        //图片写入的路径和名字
        await wait(50);
        let imgPath = `./img/${title}/${title}-${i}${extName}`
        //创建写入图片流
        let ws = fs.createWriteStream(imgPath)
        axios.get(imgUrl,{responseType:'stream'}).then(function(res){
            res.data.pipe(ws)
            console.log("图片加载完成："+imgPath)
            //关闭写入流
            res.data.on('close',function(){
                ws.close()
            })
        })
        
    })
}

spider()
```
