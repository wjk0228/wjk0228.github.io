---
title: "Spring Boot 学习（二）：自动装配与启动原理"
description: "旧站 Spring Boot 系列第二篇，整理依赖管理、自动装配、主启动类与运行过程。"
type: note
domain: technology
topics:
  - "Java 后端"
tags:
  - "Spring Boot"
  - "Spring"
  - "Java"
  - "后端"
  - "自动装配"
  - "历史笔记"
status: archived
created: 2022-02-05
updated: 2022-02-05
difficulty: beginner
series: "Spring Boot 旧站学习笔记"
order: 2
draft: false
featured: false
legacyUrl: "/2022/02/05/SpringBoot学习（二）/"
sourceType: migration
---
> 迁移说明：本文来自旧 Hexo 站点，保留当时的学习记录与代码写法，可能不代表当前最佳实践。

### 自动装配原理

> pom.xml

* spring-boot-dependencies：核心依赖在父工程中；

```xml
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-dependencies</artifactId>
    <version>2.6.3</version>
  </parent>
```

* 我们在写或者引入一些springboot依赖时，不需要指定版本，就是因为有这些版本仓库

> 启动器

```xml
    <!--启动器-->
        <dependency>
            <!--默认启动器-->
            <groupId>org.springframework.boot</groupId>   
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>   
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
```

* 启动器：其实就是SpringBoot的启动场景；

* 比如spring-boot-starter-web 会自动导入web环境所以的依赖；

* springboot会将所有的功能场景，变成一个个启动器

* 我们要使用什么功能，就只需要找到对应的启动器就可以 `启动器`



> 主程序

**@SpringBootApplication :标注这个类是一个spingboot的应用**

```java
@SpringBootApplication
public class Springboot01HelloworldApplication {

   public static void main(String[] args) {
   	  //将springboot应用启动
      SpringApplication.run(Springboot01HelloworldApplication.class, args);
   }

}
```

* **注解**

 ```java
    @SpringBootConfiguration :springboot的配置
    	@Configuration：spring配置类
    	@Component： 说明这也是一个spring的组件
    
    
    @EnableAutoConfiguration ：自动配置
    	@AutoConfigurationPackage ：自动配置包
    		@Import({Registrar.class})：自动配置 `包注册`
    	@Import({AutoConfigurationImportSelector.class}) ：自动配置导入选择
    
    
    // 获取所有的配置
    List<String> configurations = this.getCandidateConfigurations(annotationMetadata, attributes);
 ```

获取候选的配置(getCandidateConfigurations)

```java
protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
    List<String> configurations = SpringFactoriesLoader.loadFactoryNames(this.getSpringFactoriesLoaderFactoryClass(), this.getBeanClassLoader());
    Assert.notEmpty(configurations, "No auto configuration classes found in META-INF/spring.factories. If you are using a custom packaging, make sure that file is correct.");
    return configurations;
}
```

META-INF/spring.factories:自动配置的核心文件

![旧文插图](/images/migrated/spring-boot-auto-config.png)

```java
Properties properties = PropertiesLoaderUtils.loadProperties(resource);
所有资源加载到配置类中
```

* 流程图

![旧文插图](/images/migrated/spring-boot-run-process.png)

**结论：**springboot所有的自动配置都是在启动的时候送奥妙并加载：`spring.factories`所有的自动配置类都在里面，但不一定生效，

要判断条件是否成立，只要导入对应的start，就有了对应的启动器。有了启动器，我们自动装配就会生效，然后就能配置成功。



1. springboot在启动的时候，从类路径下/META-INF/`spring.factories`获取指定的值；
2. 将这些自动配置的类导入容器，自动配置就会生效，帮我们进行自动配置
3. 以前我们需要自己配置的东西，自动配置类都帮我们解决了
4. 整个J2EE的整体解决方案和自动配置都在springboot-autoconfigure的jar包中;
5. **它将所有需要导入的组件以全类名的方式返回，这些组件就会被添加到容器中﹔**
6. 它会给容器中导入非常多的自动配置类(xxxAutoConfiguration)，就是给容器中导入这个场景需要的所有组件，并配置好这些组件;
7. **有了自动配置类，免去了我们手动编写配置注入功能组件等的工作;**
