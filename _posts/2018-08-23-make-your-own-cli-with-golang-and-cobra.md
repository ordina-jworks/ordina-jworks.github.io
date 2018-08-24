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
Here you can define a name for you cli together with a short and a long description of it. I’m going to leave everything as it is for now. The next step is to think about which commands you want your cli to do. A good practice I think would be to work with verbs like get, post, describe, … For our little example we want a command like this with an output of “Hello World”.


```
hello-cli say hello
```
To do this we can leverage the generator to add a new command for us. 

Sidenote: by default cobra will add an Apache License. If you don’t want this, you can add the flag “-l none” to all the generator commands from now on. It will however add a copyright claim at the top of every file (// Copyright © 2018 NAME HERE <EMAIL ADDRESS>). If you pass the flag “-a YOUR NAME” the claim will contain your name. These flags are optional though.

```
cobra add say
```
It will generate a file say.go inside the cmd package. Inside this file you can again specify the way the command needs to be used and add descriptions for the command. Further in this file you’ll see the execute function. This is the part that gets executed every time you would call “hello-cli say”. You are probably never going to call this command on its own except for the --help function, so we’re going to return an error if you try to do so. The Run part of the cobra command doesn’t return anything by default, That’s why there is the option to change “Run” to “RunE”. This expects the function to return an error.
```
RunE: func(cmd *cobra.Command, args []string) error {
	return errors.New("provide item to the say command")
},
```
The RunE function has an additional benefit. If it triggers an error, your cli automatically shows the user a list of all possible flags and commands, similar to the help function which is always present with --help.

At the bottom of that file you’ll see a function called init.
´´´
func init() {
    rootCmd.AddCommand(sayCmd)

    // Here you will define your flags and configuration settings.

    // Cobra supports Persistent Flags which will work for this command
    // and all subcommands, e.g.:
    // sayCmd.PersistentFlags().String("foo", "", "A help for foo")

    // Cobra supports local flags which will only run when this command
    // is called directly, e.g.:
    // sayCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
´´´
This is the place where you will add subcommands and flags. By default, the say command is added to the root command. This is what we want. So lets add a sub command to say hello.

```
cobra add sayhello
```
Like the say command the sayhello command is added to the root command. So change the init function as follows.
```
func init() {
	sayCmd.AddCommand(sayhelloCmd)
}
```
As for functionality, edit the Run part
```go
Run: func(cmd *cobra.Command, args []string) {
fmt.Println("Hello World!")
},

```
Now do the following command inside the folder where the main.go resides.

```bash
go build
```
followed by
```
hello-cli say hello
```
If everything worked correctly, your cli should output “Hello World!”.


##Adding flags

To make your cli a bit more interesting, you can add some flags. you can choose between a local and a global flag. Global flags are available and accessible at every stage of your command tree. For this example we are going to make a --name flag to make the cli a bit more personal.
Inside the init function of the sayhello.go file add a flag
´´´
func init() {
    	rootCmd.AddCommand(sayCmd)
 	sayCmd.Flags().StringP("name","n", "", "Set your name")
}
´´´
And add some logic to the Run part.
```
Run: func(cmd *cobra.Command, args []string) {
    name, _:= cmd.Flags().GetString("name")
    if name == "" {
        name = "World"
    }
    fmt.Println("Hallo "+name)
},

```
do a quick go build, and check if that worked.
´´´
hello-cli say hello -n Jhonny
´´´
