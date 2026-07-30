---
title: "TypeScript 初学（三）：类、继承与多态"
description: "旧站 TypeScript 系列第三篇，整理类、继承、修饰符、静态成员、多态与抽象类。"
type: note
domain: technology
topics:
  - "TypeScript"
tags:
  - "TypeScript"
  - "前端"
  - "面向对象"
  - "历史笔记"
status: archived
created: 2023-01-07
updated: 2023-01-07
difficulty: beginner
series: "TypeScript 旧站学习笔记"
order: 3
draft: false
featured: false
legacyUrl: "/2023/01/07/Typescript（三）/"
sourceType: migration
---
> 迁移说明：本文来自旧 Hexo 站点，保留当时的学习记录与代码写法，可能不代表当前最佳实践。

## Typescript的类

### 复习ES5中的类
#### 1.最简单的类


```
function Person() {
    this.name = '张三';
    this.age = 20;
}

var p = new Person();
console.log(p.name);
```


#### 2.构造函数和原型链里面增加方法


```
function Person() {
    this.name = '张三';  /*属性*/
    this.age = 20;
    this.run = function () {    /*实例方法*/
        alert(this.name + "在运动")
    }
}
原型链上上面的属性会被多个实例共享  构造函数不会
    Person.prototype.sex="男";
    Person.prototype.work=function () {
        alert(this.name+"在工作")
    }
var p = new Person();
console.log(p.name);
```


#### 3.类里面的静态方法


```
function Person() {
    this.name = '张三';  /*属性*/
    this.age = 20;
    this.run = function () {    /*实例方法*/
        alert(this.name + "在运动")
    }
}
Person.getInfo=function () {
    alert('我是静态方法');
}

//调用静态方法
Person.getInfo();
```

#### 4.es5里面的继承 对象冒充实现继承



```
function Person() {
    this.name = '张三';  /*属性*/
    this.age = 20;
    this.run = function () {    /*实例方法*/
        alert(this.name + "在运动")
    }
}

Person.prototype.sex = "男";
Person.prototype.work = function () {
    alert(this.name + "在工作")
}

//web类 继承Person类 原型链+对象冒充的组合继承模式

function Web() {
    Person.call(this);  /*对象冒充实现继承*/
}
var w=new Web();
w.run();  //对象冒充可以继承构造函数里面的属性和方法
w.work()  //无法继承原型链上面的属性和方法
```


#### 5.原型链实现继承

```
function Person() {
    this.name = '张三';  /*属性*/
    this.age = 20;
    this.run = function () {    /*实例方法*/
        alert(this.name + "在运动")
    }
}

Person.prototype.sex = "男";
Person.prototype.work = function () {
    alert(this.name + "在工作")
}
//web类 继承Person类
function Web() {

}
Web.prototype=new Person(); //原型链实现继承
var w=new Web();
//可以继承构造函数里面的属性和方法，也可以继承原型链上面的属性和方法
w.work();
```


#### 6.原型链继承的问题

```
function Person(name,age) {
    this.name = name;  /*属性*/
    this.age =age;
    this.run = function () {    /*实例方法*/
        alert(this.name + "在运动")
    }
}

Person.prototype.sex = "男";
Person.prototype.work = function () {
    alert(this.name + "在工作")
}
var p=new Person('李四',20);
p.run();

function Web(name,age) {

}
Web.prototype=new Person();

var w=new Web('赵四',20);  //实例化子类的时候无法给父类传参
```



#### 7.原型链+构造函数组合继承模式

```
function Person(name,age) {
    this.name = name;  /*属性*/
    this.age =age;
    this.run = function () {    /*实例方法*/
        alert(this.name + "在运动")
    }
}

Person.prototype.sex = "男";
Person.prototype.work = function () {
    alert(this.name + "在工作")
}
var p=new Person('李四',20);
p.run();

function Web(name,age) {
    Person.call(this,age,name);  /*对象冒充继承  实例化子类可以给父类传参*/
}
Web.prototype=new Person();

var w=new Web('赵四',20);
```


#### 8.原型链+构造函数另一种方式

```
function Person(name,age) {
    this.name = name;  /*属性*/
    this.age =age;
    this.run = function () {    /*实例方法*/
        alert(this.name + "在运动")
    }
}

Person.prototype.sex = "男";
Person.prototype.work = function () {
    alert(this.name + "在工作")
}
var p=new Person('李四',20);
p.run();

function Web(name,age) {
    Person.call(this,age,name);  /*对象冒充继承  实例化子类可以给父类传参*/
}
Web.prototype=Person.prototype;

var w=new Web('赵四',20);
w.work();
```

### Typescript中的类
#### 1.ts中类的定义


```
class Person{
    name:string;  //属性 前面public
    constructor(n:string){   //构造函数  实例化类时触发的方法
        this.name=n;
    }
    run():void{
        alert(this.name)
    }
}

var p=new Person("张三");

p.run();
```

```
class Person{
    name:string;  //属性 前面public
    constructor(n:string){   //构造函数  实例化类时触发的方法
        this.name=n;
    }
    run():void{
        alert(this.name)
    }
    getName():string{
        return this.name;
    }
    setName(name:string):void{
        this.name=name;
    }
}

var p=new Person("张三");

alert(p.getName());

p.setName("李四");
```
#### 2.ts中实现继承  extends、super

```
class Person{
    name:string;  
    constructor(name:string){   
        this.name=name;
    }
    run():string{
        return `${this.name}在运动`
    }
}


// var p=new Person("王五");
// alert(p.run())

/*

class Web extends Person{
    constructor(name:string){
        super(name);
    }
}
var w=new Web('李四');
alert(w.run())

```
##### ts中继承的探讨  父类的方法和子类的方法一致 

#### 3.类里面的修饰符 
##### typescript里面定义属性的时候提供三种修饰符 
- public
- protected
- private

#### 4. 静态属性、静态方法

```
function Person(){
    this.run1=function(){

    }
}

Person.name='哈哈哈哈';
Person.run2=function(){  //静态方法

}

var p=new Person();

Person.run2()  //静态方法的调用

```
```
jQuery中的使用
function $(element){
        return new Base(element)
}

$.get=function(){
    
}

function Base(element){
    this.element="获取dom节点";

    this.css=function(attr,value){
        this.element.style.attr=value
    }
}
$('box').css('color','red')

$.get('url',function(){

})
*/
```
```
class Person{
    public name:string;
    public age:number=20;
    static sex='男';
    constructor(name:string){
        this.name=name;
    }
    run(){   //实例方法
        alert(`${this.name}在运动`)
    }
    work(){
        alert(`${this.name}在工作`)
    }

    static print(){   //静态方法 无法直接调用类中的属性
        alert('print方法'+Person.sex)
    }
}

// var p=new Person('张三');

// p.run();
Person.print();

alert(Person.sex);
```


#### 5.多态：父类定义一个方法不去实现，让继承它的子类去实现  每一个子类有不同的表现
#####  多态属于继承
```
class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    eat() {
        console.log('吃的方法 ');
        
    }
}

class Dog extends Animal{
    constructor(name:string){
        super(name)
    }
    eat(){
        return `${this.name}吃肉`
    }
}

class Cat extends Animal{
    constructor(name:string){
        super(name)
    }
    eat(){
        return `${this.name}吃鱼    `
    }
}
```

#### 6.抽象类  用abstract关键字定义抽象类和抽象方法，抽象类中的抽象方法不包含具体实现并且必须在派生类中实现
##### abstract抽象方法只能放在抽象类里面
##### 抽象类和抽象方法用来定义标准

```
abstract class Animal {
    public name: string;
    constructor(name: string) {
        this.name = name;
    }
    abstract eat(): any;
}

class Dog extends Animal {

    //抽象类的子类必须实现抽象类里面的抽象方法
    constructor(name: any) {
        super(name)
    }
    eat() {
        console.log(this.name + '吃粮食');
    }
}

var d=new Dog('小狗');

d.eat();
```
