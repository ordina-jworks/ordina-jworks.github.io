---
layout: post
authors: [gert-jan_theunissen]
title: 'Integrate Angular in Spring Boot using Gradle'
image: /img/2018-10-12-spring-boot-angular-gradle/angular-spring-boot-gradle.jpg
tags: [Angular, Spring Boot, Gradle]
category: Architecture
comments: true
---

I often found myself struggling when I had to integrate Angular into a Spring Boot project. This is something that should
not take a lot of your valuable development time. That's why I want to share how I did it with Gradle in a very fast and easy way.

I set up an example repo which you can find [on GitHub](https://github.com/gurtjun/angular-spring-boot-gradle){:target="_blank" rel="noopener noreferrer"}.

## Application structure

This guide assumes you have a root directory that contains two child directories. 
One with the Angular code, and another one with the Spring Boot code. By keeping these apart from each other
it will be easier to develop within the application. 

We'll make use of [Gradle's multi-project builds](https://docs.gradle.org/current/userguide/intro_multi_project_builds.html){:target="_blank" rel="noopener noreferrer"}
to split the application into multiple modules. 

Because I generated my Spring Boot project with [Spring Initializr](https://start.spring.io){:target="_blank" rel="noopener noreferrer"}
I already have a Gradle Wrapper, `gradlew` file, `gradle.bat` file and `settings.gradle` file available. 
We want to move those to our root directory. 
Keep the `build.gradle` file within the Spring Boot directory.

We should also add a new `build.gradle` file to the root directory and another one to the child directory with our Angular code.

Your application structure should look like this:
```
.
├── build.gradle
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
├── gradle.bat
├── todo-api
│   └── build.gradle
├── todo-ui
│   └── build.gradle
└── settings.gradle
```

You should have three `build.gradle` files, we'll check their content within a minute. 
But we first have to tell Gradle the name of our project and make sure it will recognize the two modules. 
This can be done in `settings.gradle`.

```groovy
rootProject.name = 'todo'

include 'todo-api', 'todo-ui'
``` 

We'll use `todo` as the project name and include both the backend and frontend module by specifying their directory name.
It's important that this name matches the path of the directory, otherwise Gradle cannot find these modules.

Gradle will now recognize both child directories as a subproject. 

## Angular

For the Angular part we want to create a jar with a `static` directory that contains the result of our Angular build. 
By doing this we can include the jar in our backend module. And because Spring Boot will automatically add static web 
resources located within `static`, the Angular application will be visible when we launch the application.

This can be done by using the [com.moowork.node](https://plugins.gradle.org/plugin/com.moowork.node){:target="_blank" rel="noopener noreferrer"} plugin.

Let's take a look at the `build.gradle` file in our `todo-ui` project. 
```groovy
// 1
plugins {
  id 'java'
  id "com.moowork.node" version "1.2.0"
}

// 2
node {
  version = '9.2.0'
  npmVersion = '6.4.1'
  download = true
}

// 3
jar.dependsOn 'npm_run_build'

// 4
jar {
  from 'dist/todo-ui' into 'static'
}
```

Let me explain step-by-step what we're doing here:
1. We need the `java` plugin to have the `jar` task available and the `com.moowork.node` plugin to execute node scripts like `npm_run_build`.
2. We have to specify which node and NPM version we want to use.
3. Before creating the jar with the `jar` task we want to build our Angular project, otherwise we don't have any static files to serve. 
This can be done by using the `npm_run_build` task.<sup>1</sup>
4. When we build the Angular project our static files will become available in `dist/todo-ui`. We want those files into `static`. 
The `from 'dist/todo-ui' into 'static'` command in the `jar` task will simply copy everything from `dist/todo-ui` into `static`.<sup>2</sup>

When we build the subproject it will run `npm run build` and create a new jar with the build result in the `static` directory. 

We can now setup Spring Boot to include the jar. 

## Spring Boot

Our Spring Boot project already has a `build.gradle` file generated. 
We just have to add one line within our dependencies to include the todo-ui module.

```groovy
dependencies {
	implementation(project(':todo-ui'))
}
```

Build the project, execute the generated Spring Boot jar and go to [localhost:8080](http://localhost:8080){:target="_blank" rel="noopener noreferrer"}, 
you should see your Angular web application. That's all folks!

## Note

There are several ways to integrate Angular in Spring Boot using Gradle (or Maven). 
To me, this is the easiest and fastest way to do it. Because we've separated the backend from the frontend it will be 
a lot easier to find your way in both modules.

Now go and apply this on your own projects! Don't hesitate to contact me if you have any questions.

<sub><sup>
<sup>1</sup> by default, `npm run build` will execute `ng build` (specified in `package.json`)<br/>
<sup>2</sup> by default, Angular will output the build result in `dist/{project-name}` (specified in `angular.json`)
</sup></sub>
