---
layout: post
authors: [nick_geudens]
title: 'Make your own CLI with golang and cobra'
image: /img/make-your-own-cli-with-golang-and-cobra/banner.jpg
tags: [Golang,cobra,CLI,how to]
category: Development
comments: true
---

# Table of contents
1. [What is Node-RED](#what-is-node-red)
2. [Why we are using Node-RED (or an alternative)](#why-we-are-using-node-red-or-an-alternative)
3. [Node-RED to the rescue](#node-red-to-the-rescue)
4. [Configuration components](#configuration-components)
5. [Running an instance](#running-an-instance)
6. [Creating your first flow](#creating-your-first-flow)
7. [Spicing things up](#spicing-things-up)
8. [JSON](#json)
9. [Node-RED persistent config](#node-red-persistent-config)
10. [Node-RED and Docker](#node-red-and-docker)
11. [Node-RED and CI](#node-red-and-ci)
12. [Conclusion](#conclusion)

# Make your own CLI with golang and cobra

There are actually many command line interfaces (CLI's) written in golang these days. There is a big chance that you are already using one. The Docker and Kubernetes CLI are the big examples. Apart from the fact that hole Kubernetes was written in go. These examples are written using a framework called cobra. And that's exactly what I'm going to use to show you how to write a simple CLI with golang. 

to make things easier cobra provides a generator that adds the boilerplate code for you. So you can focus on the logic of your cli. And that's a good thing.

You can get the generator by doing this.
```bash
go get github.com/spf13/cobra/cobra
```
This creates an executable in the $GOPATH/bin directory. With this executable in place you first need to create a new folder, navigate inside the folder and call the following command to start a new project in that folder.

cobra init
It should generated a main.go file, a license and a cmd package. If you look inside the main.go file you'll see that there is not much going on. It just calls the execute function of the cmd package. This function resides in the root.go file, which is doing a lot more as you can see. The important part for now is this.

```go
// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
    Use:   "hello-cobra",
    Short: "A brief description of your application",
    Long: `A longer description that spans multiple lines and likely contains
examples and usage of using your application. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
    // Uncomment the following line if your bare application
    // has an action associated with it:
    //  Run: func(cmd *cobra.Command, args []string) { },
}
```
Here you can define a name for you cli together with a short and a long description of it.
