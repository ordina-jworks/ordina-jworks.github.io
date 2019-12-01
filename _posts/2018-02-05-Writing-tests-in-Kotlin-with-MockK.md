---
layout: post
authors: [yannick_de_turck]
title: 'Mocking in Kotlin with MockK'
image: /img/writing-tests-in-kotlin-with-mockk/mockk.png
tags: [Kotlin, MockK, Unit testing, Mocking, Mockito, Test-Driven Development]
category: Testing
comments: true
---

# Table of contents
1. [Introduction](#introduction)
2. [Mockito and its shortcomings in Kotlin](#mockito-and-its-shortcomings-in-kotlin)
3. [The idiomatic mocking framework for Kotlin](#the-idiomatic-mocking-framework-for-kotlin)
3. [Summing it all up](#summing-it-all-up)
3. [Other useful links](#other-useful-links)

## Introduction
I have been pretty excited about Kotlin since JetBrains released the [first official version](https://blog.jetbrains.com/kotlin/2016/02/kotlin-1-0-released-pragmatic-language-for-jvm-and-android/){:target="_blank"} on the 15th of February 2016.
It did take me a while before I managed to get my hands dirty, which was in between the version 1.1 and 1.2 release.
Besides developing in Java, which I'm doing full time as a senior Java consultant, 
I've also been dabbling in Scala for quite some years with Lightbend's [Play Framework](https://www.playframework.com){:target="_blank"}.
Everyone knows how verbose Java is, and how it lags a bit behind the newer, fancier programming languages.
It still misses features such as pattern matching, case/data classes and local-variable type inference.

Starting from Java 8 with the introduction of Lambdas, we have finally been given the option to add a more functional programming flavour to our code which was due in time.
Scala felt very refreshing for me back then, when I started to use it which was shortly before the JDK 7 release.
It felt clean and powerful, bringing the best of both worlds of object-oriented programming and functional programming.
At the same time, Scala houses a lot of complexity since there are so many ways and styles to tackle problems.
You could compare it a bit to having the toolkit available to build a space rocket when you only plan on building a small airplane. 
And this is where Kotlin comes in, being very similar to Scala but with a focus on practicality and simplicity.
Coming from the industry instead of academia, it focuses on solving problems faced daily by programmers.

I'm a big fan of Test-Driven Development and thoroughly testing the behaviour of my code by making use of mocks.
[Mockito](http://site.mockito.org){:target="_blank"} has been my mocking framework of choice combined with [PowerMock](https://github.com/powermock/powermock){:target="_blank"} for mocking constructors, static and private methods, and more.
As Kotlin also runs on the JVM, it can make use of the huge Java ecosystem.
It was a no-brainer for me to immediately add these testing libraries to my Kotlin project for writing my tests.

And thus I set off, creating a new Kotlin project to see how it fared.

## Mockito and its shortcomings in Kotlin

<p>
    <img class="image fit" style="margin:0px auto; max-width:500px;" alt="Mockito logo" src="/img/writing-tests-in-kotlin-with-mockk/mockito.png" />
</p>

I started off with adding the Mockito dependency to my Kotlin project.

```
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>2.13.0</version>
</dependency>
```

And wrote a first simple test in which I wanted to test a `Service` class that uses a `Generator` to generate a record and a `Dao` for persisting it.

```kotlin
class ServiceTest {
    class Generator { fun generate(): String = "Random String that's not random" }
    class Dao { fun insert(record: String) = println("""Inserting "$record"""") }
    class Service(private val generator: Generator, private val dao: Dao) {
        fun calculate() {
            val record = generator.generate()
            dao.insert(record)
        }
    }

    val generator = Mockito.mock(Generator::class.java)
    val dao = Mockito.mock(Dao::class.java)

    val service = Service(generator, dao)

    @Test
    fun myTest() {
        val mockedRecord = "mocked String"
        Mockito.`when`(generator.generate()).thenReturn(mockedRecord)

        service.calculate()

        Mockito.verify(generator).generate()
        Mockito.verify(dao).insert(mockedRecord)
        Mockito.verifyNoMoreInteractions(generator, dao)
    }
}
```

Writing the test went pretty smooth although the code looks a bit funky.
When I ran it, I stumbled on this nice error:

```
org.mockito.exceptions.base.MockitoException: 
Cannot mock/spy class be.yannickdeturck.HelloTest$Generator
Mockito cannot mock/spy because :
 - final class
 — anonymous classes
 — primitive types
```

As all classes and methods are final by default in Kotlin, using Mockito appears to be a bit problematic due to how Mockito creates its mocks.
If you are interested in how Mockito's mocking works internally you should checkout [this response on StackOverflow](https://stackoverflow.com/a/14447878/1320126){:target="_blank"} that roughly sums it up.

I did a bit more research on using Mockito and stumbled upon this [slightly tuned version](https://github.com/nhaarman/mockito-kotlin){:target="_blank"} for Kotlin, wrapping some of Mockito’s functionalities, providing a simpler API.
I decided to try that one out and replaced my Mockito dependency with it:

```
<dependency>
    <groupId>com.nhaarman</groupId>
    <artifactId>mockito-kotlin</artifactId>
    <version>1.5.0</version>
    <scope>test</scope>
</dependency>
```

I rewrote my test a bit in order to make use of the cleaner syntax the library had to offer.
Note how both defining and using the mocks is a bit more elegant:

```kotlin
class ServiceTest {
    class Generator { fun generate(): String = "Random String that's not random" }
    class Dao { fun insert(record: String) = println("""Inserting "$record"""") }
    class Service(private val generator: Generator, private val dao: Dao) {
        fun calculate() {
            val record = generator.generate()
            dao.insert(record)
        }
    }

    val generator = mock<Generator>()
    val dao = mock<Dao>()

    val service = Service(generator, dao)

    @Test
    fun myTest() {
        val mockedRecord = "mocked String"
        whenever(generator.generate()).thenReturn(mockedRecord)

        service.calculate()

        Mockito.verify(generator).generate()
        Mockito.verify(dao).insert(mockedRecord)
        Mockito.verifyNoMoreInteractions(generator, dao)
    }
}
```

Sadly, we still have the Mockito error.

As I said, in Kotlin all classes and methods are final by default which [Mockito cannot deal with](https://github.com/mockito/mockito/issues/657){:target="_blank"}.
You would have to explicitly make your classes inheritable using the `open` modifier.
Another approach would be to add interfaces to everything.
Changing your code just for the sake of being able to write good tests is something I'm not exactly fond of, and in this case we are also getting around one of the key features of Kotlin.

Starting from Mockito version `2.0.0` it did [became possible to mock final classes](https://github.com/mockito/mockito/wiki/What%27s-new-in-Mockito-2#unmockable){:target="_blank"} although it is an incubating, opt-in feature.
This however, requires a bit of a setup really.
It basically consists of creating a file called `org.mockito.plugins.MockMaker` with as content `mock-maker-inline` and placing it under `resources/mockito-extensions`.
It felt a bit hacky but apparently this is only a temporary way to set it up.
Although there are supposed to be plans to make it more straightforward.
[Hadi Hariri](https://twitter.com/hhariri){:target="_blank"} wrote an extensive [blog post](http://hadihariri.com/2016/10/04/Mocking-Kotlin-With-Mockito/){:target="_blank"} on setting this up and you should check it out if you would like to learn more about it.

Good, so this makes it possible to create mocks without having to add the `open` modifier to all your classes and methods!
It does't appear to be completely compatible with Mockito Kotlin even though the library depends on Mockito version `2.8.9`.
Trying to run the test resulted in the following error:

```
org.mockito.exceptions.base.MockitoInitializationException: 
Could not initialize inline Byte Buddy mock maker. (This mock maker is not supported on Android.)
```

At the time of writing there is a version `2.0.0` in alpha for Mockito Kotlin so I tried to switch to it to see if it changed anything.
Note that the dependency is a bit different and you need to use the classes in the `com.nhaarman.mockitokotlin2` package:

```
<dependency>
    <groupId>com.nhaarman.mockitokotlin2</groupId>
    <artifactId>mockito-kotlin</artifactId>
    <version>2.0.0-alpha02</version>
    <scope>test</scope>
</dependency>
```
 
It got rid of the above error.
I did ran into some unexpected behaviour where my mocks' behaviour was rather unexpected when I also added partial mocking using spies.
I spent some time to get my head around it and during my quest for answers I stumbled upon this library called [MockK](http://mockk.io){:target="_blank"}, created by [Oleksiy Pylypenko](https://twitter.com/oleksiyp){:target="_blank"}.

I decided to check it out as I became a bit annoyed with Mockito in Kotlin so far.

## The idiomatic mocking framework for Kotlin

<p>
    <img class="image fit" style="margin:0px auto; max-width:500px;" alt="MockK logo" src="/img/writing-tests-in-kotlin-with-mockk/mockk.png" />
</p>

Although I am a huge fan of Mockito for mocking in Java, using Mockito in Kotlin just feels a bit too Java-ish when you have this elegant Kotlin code all around in your project. 
MockK's main philosophy is offering first-class support for Kotlin features and being able to write idiomatic Kotlin code when using it.
Adding MockK is as simple as ever as you only have to add the dependency to your project and you are set to go.

<img alt="MockK version" src="https://img.shields.io/maven-central/v/io.mockk/mockk.svg?label=release" />

Maven:

```
<dependency>
    <groupId>io.mockk</groupId>
    <artifactId>mockk</artifactId>
    <version>${mockk.version}</version>
    <scope>test</scope>
</dependency>
```

Gradle:

```
testCompile "io.mockk:mockk:${mockkVersion}"
```

The available [MockK documentation](http://mockk.io){:target="_blank"} provides a really nice overview of all the different features with a lot of examples, making it very easy to get started.
If you have used a mocking framework before such as Mockito, everything should come natural as you usually do when writing tests with mocks.
You have the same three parts in which your tests are divided:

- Preparing the test data and setting up the mocking
- Executing the logic that you want to test
- Performing the necessary validation and verification checks to see if the result and behaviour matches your expectations.

The test from above is written as follows:

```kotlin
class ServiceTest {
    class Generator { fun generate(): String = "Random String that's not random" }
    class Dao { fun insert(record: String) = println("""Inserting "$record"""") }
    class Service(private val generator: Generator, private val dao: Dao) {
        fun calculate() {
            val record = generator.generate()
            dao.insert(record)
        }
    }

    val generator = mockk<Generator>()
    val dao = mockk<Dao>()
    val service = Service(generator, dao)

    @Test
    fun myTest() {
        val mockedRecord = "mocked String"
        every { generator.generate() } returns mockedRecord
        every { dao.insert(mockedRecord) } just Runs

        service.calculate()

        verifyAll {
            generator.generate()
            dao.insert(mockedRecord)
        }
    }
}
```

Going over the example, everything should feel familiar but more elegant.
You may however, wonder what the `every { dao.insert(mockedRecord) } just Runs` line is doing exactly.
By default in MockK, mocks are strict so you need to provide some behaviour for them.
If we were to omit the line, the test would fail as we would run into the following error: 

```
io.mockk.MockKException: no answer found for: Dao(#2).insert(mocked String)
```

A feature I was immediately fond of as I like to write strict tests.
Note that you can also define the mock as being a _relaxed mock_ in order to avoid this strict behaviour:

```kotlin
val dao = mockk<Dao>(relaxed = true)
```

Mockito has something similar for verifying with `Mockito.verifyNoMoreInteractions(generator, dao)` which I also extensively use to enforce that all calls of mocked objects are verified.
Of course, the above example is only the tip of the iceberg as MockK houses a ton of other features such as annotations to simplify creating mock objects, 
spying to mix mocks and real objects, partial argument matching, capturing arguments, verification order support, matchers, coroutine mocking support, and so much more.

After fiddling with Mockito, I happily continued using MockK for my little Kotlin project.

## Summing it all up
Mockito for me felt a bit hacky/unnatural and too Java-ish when using it in a Kotlin project.
I imagine it will probably become better in the near future.

MockK, being a newer library specifically targeted at Kotlin, felt clean and pleasant to use with excellent documentation.
Oleksiy is also actively working on the library as you can see in the repo's [releases section](https://github.com/oleksiyp/mockk/releases){:target="_blank"}.

I highly recommend checking out MockK for mocking in a Kotlin project as it is currently a better option in my humble opinion.
Oleksiy is also very active on the [MockK Gitter](https://gitter.im/mockk-io/Lobby){:target="_blank"} and he helps you out quickly should you have any questions.
He is also open to feedback and enjoys being challenged in order to make MockK an even better library.
If you want to learn more about MockK, you should definitely read Oleksiy's blog post series in the next section.

## Other useful links
- [MockK documenation](http://mockk.io){:target="_blank"}
- [MockK GitHub](https://github.com/oleksiyp/mockk){:target="_blank"}
- [MockK Gitter](https://gitter.im/mockk-io/Lobby){:target="_blank"}
- [Oleksiy Pylypenko's Twitter](https://twitter.com/oleksiyp){:target="_blank"}
- [Blog post by Hadi Hariri: Mocking Kotlin with Mockito](http://hadihariri.com/2016/10/04/Mocking-Kotlin-With-Mockito/){:target="_blank"}
- [Blog post by Oleksiy Pylypenko: Mocking is not rocket science: Basics](https://blog.kotlin-academy.com/mocking-is-not-rocket-science-basics-ae55d0aadf2b){:target="_blank"}
- [Blog post by Oleksiy Pylypenko: Mocking is not rocket science: Expected behavior and behavior verification](https://blog.kotlin-academy.com/mocking-is-not-rocket-science-expected-behavior-and-behavior-verification-3862dd0e0f03){:target="_blank"}
- [Blog post by Oleksiy Pylypenko: Mocking is not rocket science: MockK features](https://blog.kotlin-academy.com/mocking-is-not-rocket-science-mockk-features-e5d55d735a98){:target="_blank"}