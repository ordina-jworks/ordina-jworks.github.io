---
layout: post
authors: [nick_geudens]
title: 'Make your own CLI with golang and cobra'
image: /img/make-your-own-cli-with-golang-and-cobra/banner.jpg
tags: [Golang,Cobra,CLI,Go]
category: Development
comments: true
---

# Table of contents
1. [Getting started](#getting-started)
2. [Adding functionality](#adding-functionality)
3. [Adding flags](#adding-flags)
4. [Using environment variables instead of flags](#using-environment-variables-instead-of-flags)
5. [Taking a file as input](#taking-a-file-as-input)
6. [That’s it!](#thats-it)

>There are lots of command line interfaces (CLI's) available these days, some of which are written in golang.
There’s even a big chance that you’re using one of them.
Docker or Kubernetes for example, have a CLI written in go.
These were written using a framework called cobra.
And that's exactly what I'm going to use to show you how to write your own simple CLI with golang.
I’m also going to show you ways to provide parameters like environment variables and config files to your CLI, so you can do more that just the basics.

# Getting started
The framework Cobra provides a generator that adds some boilerplate code for you.
This is handy because now you can focus more on the logic of your CLI instead of figuring out how to parse a flags.
Assuming you have golang correctly installed, you can get the generator by doing the following.
```bash
go get github.com/spf13/cobra/cobra
```
This creates an executable which you can run from anywhere, because it is located in the $GOPATH/bin directory, which is in turn added to your PATH variable if you installed go correctly.

You can go ahead and create a new folder for your go code.
The name of the folder will be used as the name of your CLI.
Navigate inside this folder with your terminal and call “cobra init” to start a new project.
It should generated a main.go file and a cmd package.

Sidenote: by default cobra will add an Apache License.
If you don’t want this, you can add the flag “-l none” to all the generator commands.
It will however add a copyright claim at the top of every file (// Copyright © 2018 NAME HERE <EMAIL ADDRESS>).
If you pass the flag “-a YOUR NAME” the claim will contain your name. These flags are optional though.

When you look inside the main.go file, there’s not much going on. It just calls the execute function of the cmd package.
This function resides in the root.go file, which is doing a lot more. For now, just focus op this part.
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
Here you can define how to use the CLI, together with a short and a long description. 

# Adding functionality
In the next step we need to think about which actions we want the CLI to perform.
A good practice is to work with verbs like get, post, describe,… For our example we want the CLI to say hello, so I’m going to construct it as follows.
```bash
hello-cli say hello
```
To do this we can leverage the generator again to add a new command for us.
```bash
cobra add say
```
It will generate a file inside the cmd package called “say.go”.
In this file you can again specify the way you want the command to be used and describe its function.
You’ll also see the execute function which gets executed every time you call “hello-cli say”.
You’re probably never going to use it like that, except with a --help flag. If a user calls it like that, we want the user to know he needs to provide additional items to the say command.
So we’re going to return an error if that happens.
The Run function of the cobra command doesn’t return anything by default.
You can however change “Run” to “RunE”, which expects the function to return an error if there is any.
```go
RunE: func(cmd *cobra.Command, args []string) error {
    return errors.New("Provide item to the say command")
},
```
The RunE function also shows the help output if there’s an error.
This is to show the user how to properly use your command.

At the bottom of the file you’ll see a function called init.
```go
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
```
Here you can add subcommands and flags.
By default, the say command is added to the root command, which is exactly what we want.
Let's add a sub command to say hello.
```bash
$ cobra add sayhello
```
Like the `say` command, `sayhello` is added to the root command.
In this case we want it to be added to the `say` command instead.
```go
func init() {
    sayCmd.AddCommand(sayhelloCmd)
}
```
To make the `sayhello` print “Hello World”, edit the `Run` function.
```go
Run: func(cmd *cobra.Command, args []string) {
    fmt.Println("Hello World!")
},
```
Now execute the following inside your projectfolder.
```bash
$ go install
```
Followed by
```bash
$ hello-cli say hello
```
If everything worked correctly, your CLI should output “Hello World!”.

# Adding flags
To make your CLI a bit more interesting, we are going to add some flags.
You can choose between local and persistent ones.
Local flags are available only for that command, whereas persistent flags are also available for the subcommands of that command.
For this example we want to greet a person by name.
We're going to do this by making a `--name` flag.
Navigate to the `init` function of the `sayhello.go` file, and add a flag.
```go
func init() {
    rootCmd.AddCommand(sayCmd)
    sayhelloCmd.Flags().StringP("name", "n", "", "Set your name")
}
```
The first string is the full name of the flag, and can be executed with two dashes like `--name`.
The second string is the short notation, which can be executed with one dash.
The third one is the default value, and the fourth is a description. 

To make the flag do something we need to add some logic to the `Run` function.
```go
Run: func(cmd *cobra.Command, args []string) {
    name, _:= cmd.Flags().GetString("name")
   	if name == "" {
       		name = "World"
   	}
  	fmt.Println("Hallo "+name)
},

```
do a quick go install, and check if it works.
```bash
hello-cli say hello -n Nick
```
The output should be "Hello Nick". 

# Using environment variables instead of flags
If you don't want to pollute your command line, or if you're working with sensitive data which you don't want to show up in the history, it's a good idea to work with environment variables.
To do this, you can use [Viper](https://github.com/spf13/viper){:target="_blank" rel="noopener noreferrer"}. Viper is another dependency from [spf13](https://github.com/spf13){:target="_blank" rel="noopener noreferrer"}.
Cobra already uses Viper in the generated code, so why not use it as well.
You can however achieve the same result by using the os package from the Go standard library.

We want to make the environment variable the default value.
If you remember, the default value is set in the `init()` function. 
```go
func init() {
    sayCmd.AddCommand(sayhelloCmd)
    sayhelloCmd.Flags().StringP("name", "n", viper.GetString("ENVNAME"), "Set your name")
}
```
That's all you need to do to parse environment variables.

# Taking a file as input
For this next part,  we want to provide multiple parameters to our CLI.
You can provide flags for every single one of them, but when you have a lot of parameters, a config file can be a better option.
So create a new file with a `.yaml` extension, and add the following contents.
```yaml
name: "Billy"
greeting: "Howdy"
```
If you used the generator, There will already be a flag configured that expects the path to an initial config file.
You can find this flag in the `root.go` file under the `initConfig()` function.
As you can see, it uses Viper again to do this.

Good news! We don't have to do it ourselves!
The only thing we need to do is to extract the variables from the file.

```go
Run: func(cmd *cobra.Command, args []string) {
    greeting := "Hello"
    name, _ := cmd.Flags().GetString("name")
    if name == "" {
        name = "World"
    }
    if viper.GetString("name")!=""{
        name = viper.GetString("name")
    }
    if viper.GetString("greeting")!=""{
        greeting = viper.GetString("greeting")
    }
    fmt.Println(greeting + " " + name)
},
```
Again use Viper in the same way as you did before with the environment variables.
Try it out by doing another install and typing this command.
```bash
$ hello-cli say hallo --config config.yml
```
# That’s it!
>You have successfully written a CLI in Golang that can parse about any variable around the block! 
All sample code can be found on [github](https://github.com/nickgeudens/hello-cli){:target="_blank" rel="noopener noreferrer"}.

