---
layout: post
authors: [duncan_casteleyn]
title: 'JDK distributions'
image: /img/2019-04-24-JDK-distributions/openjdk.png
tags: [Java, OpenJDK, JDK]
category: Java
comments: true
---

> Around February we had a discussion in our chat group of developers which made us realise how much confusion there is on the new update cycle for the JVM.
> We decided it would be good idea to write a blog post that should clear up the confusion for our developers and clients.

# Table of content

* [Oracle's JDK distributions](#oracles-jdk-distributions)
* [OpenJDK updates](#openjdk-updates)
* [OpenJDK providers](#openjdk-providers)
* [Java Desktop, Java Web Start and JavaFX](#java-desktop-java-web-start-and-javafx)

## Oracle's JDK distributions

First we have to explain what changed to Oracle's JDK distributions recently, which has brought along a lot of uncertainty within the Java community.
This blog post is going to try to explain these changes and more importantly, tell you what you should know about the licenses and options you have.

At the end of this article you should know more about the free updates and commercial support options from  various JDK vendors and understand that OpenJDK 8 and 11 are still being updated, even though Oracle is going to stop leading those projects, to focus on the new versions and providing commercial support.

### Six month release cycle

Java SE now has new major versions released every six months since Java version 9.
Prior to this version, updates where provided by Oracle and other OpenJDK contributors.
These releases, such as 8u91, 8u111 and 8u131, were released every six months.
You would not get further updates on 8u91 once 8u111 was released and no longer get updates for 8u111 once 8u131 was released.

Since Java version 9 however, there is a new six month release cycle for major versions.
Similar to the old update cycle.
In the new version system you will no longer get updates for Java 12 once Java 13 is released.
Exceptions being long-term support versions which will get updates beyond six months.
More about that later.

Below is a table for free updates.
Each vendor can release their own OpenJDK distributions and decide for themselves how long they provide free updates.
If you want pick a vendor, make sure you research how long they will be providing free updates/support because this may vary from vendor to vendor.
Further in the article we provide a table with most of this information.

| Version       | Release date  | Free updates ended or superseded                                                             |
| ------------- | ------------- | -------------------------------------------------------------------------------------------- |
| OpenJDK 6     | December 2006 | Supported primarily by Azul systems                                                          |
| OpenJDK 7     | July 2011     | Supported primarily by Red Hat until at least June 2020                                      |
| OpenJDK 8     | March 2014    | Supported by Red Hat, Amazon, Azul Systems, BellSoft, Google, IBM, jClarity, SAP, and others.|
| OpenJDK 9     | Sept 2017     | Superseded by OpenJDK 10                                                                     |
| OpenJDK 10    | March 2018    | Superseded by OpenJDK 11                                                                     |
| OpenJDK 11    | Sept 2018     | Supported by Red hat, Amazon, Azul Systems, BellSoft, Google, IBM, jClarity, SAP, and others.|
| OpenJDK 12    | March 2019    | Superseded by OpenJDK 13                                                                     |
| OpenJDK 13    | Sept 2019     | Will be superseded by OpenJDK 14                                                             |


### Support and licenses

Before Java 9, Oracle would provide updates for their JDK for three years.
The license allowed you to use these updates personally and commercially.
The updates had no support so if you wanted support you had to buy a license from Oracle and those licenses also came with longer update cycles.
Starting April 2019, the new Oracle JDK 8 updates will be restricted and will remain free for personal desktop use, development, testing, prototyping, demonstrating and for use with certain types of applications.
Commercial use of these updates requires you to get a license for a paid support plan.
Using older versions is allowed, but will not contain important security patches.

Java 9 brings new update cycles which allows for new implementations like TLS 1.3 to be added to Java faster.
Oracle also started producing Oracle OpenJDK builds which use the GNU General Public License, version 2, with the Classpath Exception.
Every major Java version has free updates for six months until the next major version is released.
If you need new updates and support for these older versions, you will have to buy a license from Oracle which will extend support and updates although they only provide this for LTS releases.

#### Support

So what if I want support from Oracle?
Support isn't free commitment to fix bugs and requiring to answer users their problems costs money.
Because of that, Oracle has never provided free support.
If you need the reassurance of bug fixes and somebody to answer your questions then you have to get commercial support.
You aren't limited to Oracle's support.
Which vendor you choose to get this support from is up to you.
But each vendor has their own JDK binaries so make sure you use the binaries of the vendor you want to get commercial support from and don't forget to check how long they will support your OpenJDK version.
Each vendor can decide for themselves how long they provide support for their OpenJDK libraries, so this isn't a decision you should make on a whim.

You might also be thinking: "Why would I pay for commercial support for (open source) JDK versions?".
Don't forget that Oracle and other vendors pour money in development of these JDK versions and this money has to come for somewhere.
You are not obliged to get paid support with one of the vendors providing OpenJDK versions, but we think it's worth thinking about supporting the Java ecosystem to ensure its long-lasting future.
If there is no money to develop the JDK further then there won't be any progression to the future of the JDK ecosystem.

### Long-Term Support (LTS)

In the OpenJDK, LTS is an understanding between various contributors which are mainly led by Oracle and Red Hat which means that the code line for Java SE 11, 17, 23, etc will be maintained for a longer period of time than six months.

Oracle leads the first six months of the OpenJDK LTS code line, providing updates and producing the Oracle OpenJDK builds, but afterwards as mentioned before, provide updates under a paid support plan.

There's a but however: Oracle will work with other OpenJDK vendors to hand over the OpenJDK LTS code line and allow those vendors to continue working on these updates together.
Handing over the OpenJDK code line has already occurred for both Java 8 and Java 11 with Red Hat taking over those update projects.
This doesn't mean that they are the only one contributing to the OpenJDK project.
Various people can still provide patches and add new features to new versions of the OpenJDK.
You can read more about JDK 11 updates on the [OpenJDK Wiki](https://wiki.openjdk.java.net/display/JDKUpdates/JDK11u){:target="_blank" rel="noopener noreferrer"}.
You'll see that there are updates planned until at least mid October 2019.

This means that the Oracle JDK could differ from the OpenJDK based binaries and the JDKs provided by other vendors.
Most of the major vendors have continued to take efforts to keep them in sync as much as possible, but this does mean you should develop, test, ... your applications on the binaries you plan on using in production, or you might end up with some unexpected results during production.
To prevent big differences, a TCK is  provided by Oracle for OpenJDK distributions.
More about that later in the article.

## OpenJDK updates

The OpenJDK community works on free, open-source implementations of the Java SE standard.
Oracle contributes a lot to these projects and forms the basis for both the Oracle JDK and OpenJDK builds.
OpenJDK 11+ versions are interchangeable with Oracle's JDK for applications.
Oracle will continue to contribute to OpenJDK while they provide updates for the corresponding Oracle OpenJDK build version.
Once that version is superseded, Oracle will cease contributing to that version and start updating the next one.

### Updates from other vendors

Oracle is very receptive of the idea on having community maintenance and will continue to support handover of the OpenJDK to the community to a qualified volunteering entity once they have moved on to work on the next version.
Red Hat is currently globally leading and updating OpenJDK 6 and OpenJDK 7 projects after Oracle ended updates for them.
After Red Hat stopped updating OpenJDK 6, Azul Systems took over leading the project and continued to provide updates for the project to this day of writing.

Red Hat is currently leading OpenJDK 8 and OpenJDK 11 since April 2019.
This does not mean that they are the sole contributors to the project.
Other vendors are providing patches and updates as well. 
The biggest contributions are happening to the OpenJDK 8 project with contributions from not just Red Hat, but Amazon, Azul Systems, BellSoft, IBM, jClarity, Google, Sap and many other vendors.

For consistency, these vendors provide extended update cycles for their OpenJDK for the same versions that are deemed LTS for Oracle's JDK.

## OpenJDK providers

### Build yourself from source providers

One of the options you have is to build a JDK from source code meaning OpenJDK, no commercial support and you need to build it yourself and keep it updated.
This is not something we would suggest doing since this requires you to put resources in, checking for updates and applying patches if needed.
There is also no way of getting any commercial support if you ever need it.

#### Source providers
* [Mercurial](http://hg.openjdk.java.net/){:target="_blank" rel="noopener noreferrer"}
* [Tarballs (Java 7+)](https://openjdk-sources.osci.io/){:target="_blank" rel="noopener noreferrer"}
* [AdoptOpenJDK](https://www.github.com/AdoptOpenJDK/openjdk-build){:target="_blank" rel="noopener noreferrer"}

### Using binaries from providers

The most convenient option is to use binary distributions from other providers that are providing public updates.

#### Free binary distributions & commercial support

| Distribution                                                | Versions  | TCK  | Public updates           | Arch(*)       | Commercial Support              | Commercial Support ended                           |
| ----------------------------------------------------------- | --------- | ---- | -----------------------  | ------------- | ------------------------------- | -------------------------------------------------- |
| [AdoptOpenJDK](https://adoptopenjdk.net/){:target="_blank" rel="noopener noreferrer"}                   | 8, 11     | No   | Until at least Sep 2023  | Major + Minor | IBM, jClarity                   | Indefinitely (IBM), Until at least 2025 (jClarity) |
| [Amazon Corretto](https://aws.amazon.com/corretto/){:target="_blank" rel="noopener noreferrer"}         | 8, 11     | Yes  | Until at least June 2023 | Major         | -                               | ?                                                  |
| [Azul Zulu](https://www.azul.com/downloads/zulu/){:target="_blank" rel="noopener noreferrer"}           | 8, 11     | Yes  |                          | Major + Minor | Azul                            | March 2025 (8), September 2026 (11)                |
| [Bellsoft Liberica](https://www.bell-sw.com/pages/products){:target="_blank" rel="noopener noreferrer"} | 8, 11     | Yes  | Until at least 2023      | Major + Minor | BellSoft                        | Until 2026                                         |
| [Oracle OpenJDK](https://openjdk.java.net/){:target="_blank" rel="noopener noreferrer"}                 | 11        | Yes  | Until Mar 2019           | Major         | Oracle (through the Oracle JDK) | September 2023, September 2026 (extended support)  |
| [SapMachine](https://sap.github.io/SapMachine/){:target="_blank" rel="noopener noreferrer"}             | 11        | Yes  | September 2022           | Major         | SAP                             | September 2022                                     |

\* **Major** = Linux x86, MacOS, Windows x64,
**Minor** = various other platforms.

***Notes:***

*As a general philosophy, AdoptOpenJDK will continue to build binaries for LTS releases as long as the corresponding upstream source (Oracle OpenJDK) is actively maintained.*
*The Eclipse OpenJ9 Support Document covers extra support info for that VM.*
*This information might change overtime and was gathered from the vendors pages and support.*
*Contact vendors for the most recent information.*
*jClarity will support their JDK binaries as long as produced which likely means 2028*

##### Technology Compatibility Kit for Java (TCK)

The Java Compatibility Kit (a.k.a., the JCK or TCK for Java SE) is an extensive test suite used by Oracle and licensees to ensure compatible implementations of its platform.
This ensures that the OpenJDK implementation does not have major differences from the Oracle's JDK, but it is still possible for there to be minor differences in the binary distribution.

Sun released a specific license to permit running the TCK in the OpenJDK context for any GPL implementation deriving substantially from OpenJDK.
This also means to be TCK compliant.
The JDK distribution is required to use the same GPL license.
Otherwise you cannot obtain legal access the TCK.
It is available at no charge to developers who are planning to deploy a compatible Java implementation based on code derived from the OpenJDK or who are participating in OpenJDK research, bug fixes, code enhancement and/or ports to other hardware or software architectures.

### Using distributions provided by your linux distribution

Many Linux distributions will continue to provide OpenJDK binaries for their distributions through their package managers including and not limited to Debian, Ubuntu, CentOS, Fedora, Alpine, ...

## Java Desktop, Java Web Start and JavaFX

There are various changes with Desktop Java SE starting with the Oracle JDK 11 that you should be aware of.

### JavaFX and OpenJFX

As of Java version 11, both Oracle's JDK and Oracle's OpenJDK will no longer contain the JavaFX or OpenJFX libraries.
You will have to add these libraries yourself or through build tools.
The update cycle is the same as OpenJDK: if OpenJFX 12 is released, public updates are dropped for OpenJFX 11.

### Java Packager

The Java packager, which allows you to bundle applications and their dependencies with the JVM, is no longer part of the OpenJDK and has been removed from all of Oracle's JDK versions starting from version 11.
There is a [JEP](https://bugs.openjdk.java.net/browse/JDK-8200758) to add a new packaging tool to OpenJDK but this is not yet ready for Java 11.

### Java WebStart

Java WebStart has been removed from Oracle's JDK versions starting from version 11.
* Alternatively you can use [IcedTea-Web](https://icedtea.classpath.org/wiki/IcedTea-Web){:target="_blank" rel="noopener noreferrer"}
* AdoptOpenJDK will be supporting OpenJDK binaries with IcedTea-Web
* IBM will be supporting AdoptOpenJDK builds of OpenJDK with IcedTea-Web
* Builds from Red hat include a simplified IcedTea-Web installer (ojdkbuild)
* Karukun is working on an [OSS replacement for Web Start](https://dev.karakun.com/webstart/){:target="_blank" rel="noopener noreferrer"}

## Sources
The information in this blog post comes from various sources which will be listed below.
A huge thanks goes out to the creators of the "Java Is Still Free" document who granted us permissions to use their post for this blog post.
We used these sources either because we were granted permissions to use them or the terms allowed us to use them.

* [Java Is Still Free](https://docs.google.com/document/d/1nFGazvrCvHMZJgFstlbzoHjpAVwv5DEdnaBr_5pKuHo/edit?usp=sharing)
* [The jdk-updates-dev Archives](https://mail.openjdk.java.net/pipermail/jdk-updates-dev/)
