---
title: "Spring Boot 学习（一）：入门与项目创建"
description: "旧站 Spring Boot 系列第一篇，记录框架特点、项目结构、配置方式和 Maven 基础配置。"
type: note
domain: technology
topics:
  - "Java 后端"
tags:
  - "Spring Boot"
  - "Spring"
  - "Java"
  - "后端"
  - "历史笔记"
status: archived
created: 2022-02-02
updated: 2022-02-02
difficulty: beginner
series: "Spring Boot 旧站学习笔记"
order: 1
draft: false
featured: false
legacyUrl: "/2022/02/02/SpringBoot学习（一）/"
sourceType: migration
---
> 迁移说明：本文来自旧 Hexo 站点，保留当时的学习记录与代码写法，可能不代表当前最佳实践。

> SpringBoot学习路线

![学习路线](/images/migrated/spring-boot-roadmap.png)

### 什么是SpringBoot

Spring Boot基于Spring 开发，Spirng Boot本身并不提供Spring框架的核心特性以及扩展功能，只是用于快速、敏捷地开发新一代基于Spring 框架的应用程序。也就是说，它并不是用来替代Spring 的解决方案，而是和Spring 框架紧密结合用于提升Spring 开发者体验的工具。SpringBoot以**约定大于配置**的核心思想，默认帮我们进行了很多设置，多数Spring Boot应用只需要很少的Spring 配置。同时它集成了大量常用的第三方库配置（例如Redis、MongoDB、Jpa、RabbitMQ、Quartz 等等)，Spring Boot应用中这些第三方库几乎可以零配置的开箱即用

### SpringBoot的主要优点

* 为所有Spring开发者更快的入门
* **开箱即用**，提供各种默认配置来简化项目配置·内嵌式容器简化Web项目
* 没有冗余代码生成和XML配置的要求

### 第一个SpringBoot项目

官方直接提供了一个快速生成的网站，IDEA也集成了这个网站

* 可以在官网直接下载后，导入IDEA([Spring Initializr](https://start.spring.io/)）
* 直接使用idea创建一个springboot项目（一般开发直接在IDEA中创建）



#### 项目结构

![旧文插图](/images/migrated/spring-boot-project-structure.png)

#### 项目配置文件概述

**controller层demo（编写HTTP接口）：**

```java
package com.wjk.SpringBootdemo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//自动装配：原理！
@RestController
public class HelloController {
    //接口：http://localhost:8080/hello
    @RequestMapping("/hello")
    public String hello(){
        //调用业务，接受前端参数
        return "hello,world";
    }
}

```

**SpringBootApplication：**

```java
package com.wjk.SpringBootdemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//本身就是spring的一个组件

//	程序的主入口
@SpringBootApplication
public class SpringBootdemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootdemoApplication.class, args);
	}

}

```

**pom.xml配置信息（核心）:**

parent： 继承父项目的依赖管理，控制版本和打包等

```xml
<!--有一个父项目-->
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.6.3</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
```

 **dependencies：项目具体依赖**

 spring-boot-starter 所有的spingboot依赖都是使用这个开头的

```xml
<dependencies>
		<!--web依赖：tomcat，dispatcherServlet，xml	-->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

	<!--单元测试-->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>
```

**build：构件配置部分**

```xml
<build>
		<plugins>
	<!--打jar包插件-->
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>
```



### IDEA快速创建

![旧文插图](/images/migrated/spring-initializr-step-1.png)

![旧文插图](/images/migrated/spring-initializr-step-2.png)
