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
3. [Using environment variables as input](#node-red-to-the-rescue)
4. [Using environment variables as input](#configuration-components)
5. [Running an instance](#running-an-instance)
6. [Creating your first flow](#creating-your-first-flow)
7. [Spicing things up](#spicing-things-up)
8. [JSON](#json)
9. [Node-RED persistent config](#node-red-persistent-config)
10. [Node-RED and Docker](#node-red-and-docker)
11. [Node-RED and CI](#node-red-and-ci)
12. [Conclusion](#conclusion)

# Make your own CLI with golang and cobra

There are a lot of command line interfaces (CLI's) available these days, some of which are written in golang, and there’s a big chance that you’re using one of them. The Docker and Kubernetes CLI are one of the big examples. Even kubernetes itself is written in go. To make the life of the developers easier, they used a framework called cobra to make these CLI’s. And that's exactly what I'm going to use to show you how to write a simple CLI with golang.

###Getting started
Cobra provides a generator that adds the boilerplate code for you. So you can focus more on the logic of your cli. You don’t want to be busy figuring out how to parse flags, you want to make the flags actually do something.

Assuming you have go correctly installed, you can get the generator by doing the following.
```bash
go get github.com/spf13/cobra/cobra
```
This creates an executable in the $GOPATH/bin directory. With this executable installed you can go ahead and create a new folder for your go code. Navigate inside the folder and call the “cobra init” command to start a new project in that folder. It will take the name of the folder as the default name of the cli.

Sidenote: by default cobra will add an Apache License. If you don’t want this, you can add the flag “-l none” to all the generator commands from now on. It will however add a copyright claim at the top of every file (// Copyright © 2018 NAME HERE <EMAIL ADDRESS>). If you pass the flag “-a YOUR NAME” the claim will contain your name. These flags are optional though.

It should generated a main.go file, cmd package and a licence file if you chose to keep it. When you look inside the main.go file you'll see that there’s not much going on. It just calls the execute function of the cmd package. This function resides in the root.go file, which is doing a lot more. For now, just focus op this part.
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
Here you can define how to use the cli, together with a short and a long description. 

### Adding functionality
The next step is to think about which actions you want your cli to perform. A good practice is to work with verbs like get, post, describe,… For our little example we want the cli to say hello, so I’m going to construct it as follows.
```bash
hello-cli say hello
```
To do this we can leverage the generator to add a new command for us.
```bash
cobra add say
```
It will generate a file “say.go” inside the cmd package. In this file you can again specify the way you want the command to be used and describe its function. You’ll also see the execute function which gets executed every time you call “hello-cli say”. You’re probably never going to use it like that, except with a --help flag. If a user calls it like that, we want the user to know he needs to provide additional items to the command. So we’re going to return an error if that happens. The Run part of the cobra command doesn’t return anything by default. You can however change “Run” to “RunE”, which expects the function to return an error if there is any.
```go
RunE: func(cmd *cobra.Command, args []string) error {
  return errors.New("Provide item to the say command")
},
```
The RunE function also shows the help output if there’s an error. This is to show the user how to properly use your command.

At the bottom of the file you’ll see a function called init.
´´´go
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
Here you can add subcommands and flags. By default, the say command is added to the root command, which is exactly what we want. Let's add a sub command to say hello.
```bash
cobra add sayhello
```
Like the say command, sayhello is added to the root command. In this case we don’t want that. Add it to the say command instead.
```go
func init() {
  sayCmd.AddCommand(sayhelloCmd)
}
```
To make the sayhello print “Hello World”, edit the Run part.
```go
Run: func(cmd *cobra.Command, args []string) {
  fmt.Println("Hello World!")
},
```
Now execute the following inside your projectfolder.
```bash
go build
```
Followed by
```
hello-cli say hello
```
If everything worked correctly, your cli should output “Hello World!”.

### Adding flags
To make your cli a bit more interesting, you can add some flags. you can choose between a local and a global one. Global flags are available and accessible at every stage of your command tree. For this example we are going to make a --name flag to make the cli a bit more personal. Navigate to the init function of the sayhello.go file, and add a flag.
´´´
func init() {
      rootCmd.AddCommand(sayCmd)
  sayhelloCmd.Flags().StringP("name","n", "", "Set your name")
}
´´´
The first string is the full name of the flag, and can be executed with two dashes like “--name”. The second string is the short notation, which can be executed with one dash like “-n”. The third one is the default value, and the fourth a description. To make this flag doe something we need to add some logic to the Run part.
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
hello-cli say hello -n Nick
´´´
The output should be “Hello Nick”. 

### Using environment variables as input
If you have a case where you’ll always use the same input for a flag, you can use environment variables as input. In our case, we don’t want to type our name every time we execute something. Let’s be lazy.
To use environment variables we need to leverage the os package from the go standard library. Add it as the default value for the name flag. This way it will use the environment variable if it’s set.
´´´go
func init() {
    sayCmd.AddCommand(sayhelloCmd)
    sayhelloCmd.Flags().StringP("name", "n", os.Getenv("NAME"), "Set your name")
}
´´´

### Taking a file as input
