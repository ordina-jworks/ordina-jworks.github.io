---
layout: post
authors: [peter_de_kinder]
title: 'What Would Discord Bot Do?'
image: /img/2022-01-14-what-would-discord-bot-do/discorddanger.jpg
tags: [Java, Discord, EDA, architecture, software architecture]
category: development
comments: true
---
Online communication has been widespread for years already. 
But the current world situation has made it near ubiquitous. 
With social contact in real life (IRL) being restricted, our need for communication shifts to the digital world through a wide variety of platforms. 
One of those platforms that focuses heavily on the online gaming community is Discord. 
It offers text communication channels, functionality to videoconference with your friends, and share your screen as a live stream, usually showing off your gaming skills. 
It also offers a way to code interactions with those channels by employing bots. 

Bots in the Discord world are services that take the input presented on a discord server, and perform some automated tasks based on this input. 
Popular bots on Discord allow you to moderate the channel, script shortcut commands, play videos or music, or add all sorts of files. 
There are various possibilities out there that an administrator of a server can add or remove with the click of a button. 
It makes for a more enjoyable and streamlined experience in your interactions. 

But what if there is no bot available to suit the needs of your community? 
For these occasions, Discord offers a development platform where you can code your very own bot, with the functionalities you need. 
There are many possible frameworks to code such a bot (and even a few solutions that offer this functionality without the need to code), and they come in many different coding languages (Java, Python, .NET, Rust, …). 
Since my expertise with coding lies mainly in the Java world, I opted to make my bot in the [Java Discord API (JDA) framework](https://github.com/DV8FromTheWorld/JDA){:target="_blank" rel="noopener noreferrer"}.  
 
To get started we first need to register an application in the [Discord Developer Portal](https://discord.com/developers/applications){:target="_blank" rel="noopener noreferrer"}. 
This is freely available to anyone who has registered a (free) account on Discord. 
It will look similar to the screenshot below, and presents a “New Application” button from where to start. 
After clicking the button, it prompts to enter a name for the new application, which I dubbed TestBotApplication all the while feeling like the next Shakespeare of the Digital Age.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-01-14-what-would-discord-bot-do/discordportal01.png' | prepend: site.baseurl }}" alt="Workspace" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

This takes you to a screen that will allow you to fill in general information about your application, such as an image to identify it with, a description on what the application is for, and some tags to align your new application with searches performed by Discord members on the lookout for the next hot bot. 
It also gives you some technical information that you will need while coding such as the Application ID and the Public Key. 
To round off this section, you can optionally enter some URLs where you describe the Terms of Use and Privacy Policy.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-01-14-what-would-discord-bot-do/discordportal02.png' | prepend: site.baseurl }}" alt="Workspace" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

Once this general information is set up, it is time to define a bot that is linked to this application. 
This is done by clicking on the Bot navigation item on the left side of the screen, which takes us to the Bot section, with a button labeled “Add Bot”. 
Here you can specify the name under which your bot will be visible on the servers that use it. 
Once again, in a fit of unbridled imagination, I went for “Developer Test Bot”. Nobel Prize for Literature, you will be mine!

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-01-14-what-would-discord-bot-do/discordportal03.png' | prepend: site.baseurl }}" alt="Workspace" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

Another important piece of the developer puzzle is the token that can be taken from this page. 
This will be the secret used by our code to access this bot. 
Other configurations that can be determined in this page are the visibility of your bot, as well as activating the usage of OAuth to authenticate with. 
At the bottom of the screen we can already see the different permissions we would like to give our bot. 
But the final piece of the puzzle before trying our hands with the JDA framework is to set up the permissions and connections over at the Oauth2 screen.

On this page, there are only a few things that need to be set up. 
First off, the client id and secret are shown, which we need for our invite URL. 
The bot also needs a redirect in case of OAUTH2 authentication, should we choose to  activate it. 
It is clear that this should be: https://www.evolute.be/discord as we do not intend to activate OAuth for the time being. 
We therefore set the Authorization Method to In-app authorization, which will prompt the administrator of the server where the bot is activated to confirm the rights of the bot. 
We identify our bot as a “Bot” in the scope section, and decide on the rights the bot will need to perform its duties. 
Giving it the Administrator permission will allow the bot to do almost anything in the server, and is thus too wide a permission set for a bot in production, but for test purposes, we will leave it as such for now.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-01-14-what-would-discord-bot-do/discordportal04.png' | prepend: site.baseurl }}" alt="Workspace" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

We head over the the URL Generator submenu item of the OAut2 menu, and fill in the scope “Bot” and permission set “Administrator” once more to get an INVITE URL, which will look something like this (with the client id filled in properly):
{:refdef: style="text-align: center; padding-left: 20px; padding-right: 20px; font-style: italic;font-color:blue;"}
https://discord.com/api/oauth2/authorize?client_id=&lt;clientid&gt;&permissions=8&scope=bot
{: refdef} 

Dropping this link in a browser will take you to a web page where you can add the bot to your Discord server. 
If everything is done correctly, it should show up in the member list of the server. 
But since there is not yet any code behind it, it will be shown as offline.

Time to start coding. 
We first set up a simple Maven project with the JDA dependency wired in. 
It has its own maven repository, so that one we need to add as well. 
I am going for the latest LTS release, although more recent versions are already available (though still in alpha).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>be.evolute.discord</groupId>
    <artifactId>DeveloperTestBot</artifactId>
    <packaging>jar</packaging>
    <version>1.0.0-initial</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <build>
        <resources>
            <resource>
                <directory>resources</directory>
            </resource>
        </resources>
    </build>

    <dependencies>
        <dependency>
            <groupId>net.dv8tion</groupId>
            <artifactId>JDA</artifactId>
            <version>4.4.0_350</version>
        </dependency>
    </dependencies>

    <repositories>
        <repository>
            <id>dv8tion</id>
            <name>m2-dv8tion</name>
            <url>https://m2.dv8tion.net/releases</url>
        </repository>
    </repositories>
</project>
``` 

Since Discord expects you to pilot the bot using WebSocket, I do not feel the need to create a service or a web application. 
I am just going to write a simple java class with a main method, so that I can run this from my IDE. 
This will connect to the bot by initializing the JDA context. 
With the JDBBuilder.createDefault method, you set up a WebSocket connection to your bot and to all resources the bot has been given access to (through permissions). 
This bot is identified by passing the Bot Token we can find in the Developer Portal on our bot page. 
If the JDA context cannot access the bot, it will throw a **javax.security.auth.login.LoginException**.

```java
public static JDA jda;

public static void main(String[] args) throws LoginException {
    System.out.println("Booting up Developer Test Bot...");
    jda = JDABuilder.createDefault(DISCORD_TEST_KEY).build();
    Presence jdaPresence = jda.getPresence();
    jdaPresence.setActivity(Activity.listening("/status..."));
    jdaPresence.setStatus(OnlineStatus.ONLINE);
    jda.addEventListener(new CommandsListener());
}
``` 
For those of you that are not familiar with the WebSocket protocol, it is a way to set up a stable connection between client and server to allow for bidirectional full-duplex communication between them (as opposed to the standard unidirectional requests a client sends towards server to immediately get a response). 
It is identified by the ws://-scheme (as opposed to the http:// or https:// schemes) and only a single TCP/IP socket is used for this channel (HTTP/HTTPS) throughout its existence.

The exchange starts with the client sending a standard request to the server with a number of headers indicating that a WebSocket is needed (protocol switch). 
The response coming from the server (HTTP 101) indicates that it agrees to this, and passed a verification for the originator to identify it is responding to the client’s request. 
Once this WebSocket has been established, the server (or client) will send payloads wrapped in frames (ws scheme) to its counterpart. 
This will continue until either the server or the client sends a closing frame, prompting a closing reply. 
Once the closing reply is received, the WebSocket is terminated. 

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-01-14-what-would-discord-bot-do/discordwebsocket.png' | prepend: site.baseurl }}" alt="Workspace" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

There are various things you can do to the visualization of the bot in the server member list. 
The most common are setting the activity status of the bot and its activity label. 
My main method will set up the label the bot will show by setting its activity. 
I will set it with the label “Listening to /status…”. 
Other possible activities are Playing, Watching, Streaming… 
These activities do not do anything else than setting the label shown on the bot. 
The status of the bot (similar to your status in Teams) can be set with the setStatus method.

The next thing to do, is to create a Listener for my bot that will react to events happening on the server. 
We add this listener (CommandsListener) to the JDA context with the addEventListener method. 
The Listener class itself should extend from the JDA class ListenerAdapter class. 
This gives us a number of methods we can overload to react to specific events. 
I have chosen only to react to messages posted in the text channels of my server, thus the onGuildMessageReceived method needs to be overloaded. 
A Discord guild is the collection of all particularities associated with your server: members, channels, etc… 

```java
public class CommandsListener extends ListenerAdapter {

    @Override
    public void onGuildMessageReceived(@Nonnull GuildMessageReceivedEvent event) {
        Message message = event.getMessage();
        String[] commands = message.getContentRaw().split("\\s+");
        if (commands.length > 0 && "/status".equals(commands[0])) {
            TextChannel channel = event.getChannel();
            channel.sendTyping().queue();
            channel.sendMessage("Danger, Will Robinson!").queue();
        }

    }
}
``` 

Since the commands I listen to might have parameters in the future, I decide to split up the incoming message with spaces as my delimiter. 
Then I have to verify that the incoming message is indeed a command, and not just a chat message from the guild members. 
For this reason, I check that the message is indeed the “/status” command the bot will need to react to. 
Once those checks have been made, I make the bot return the truth about any robot implementation: “Danger, Will Robinson!”. 
The messages in Discord can also be styled using a trimmed down version of Markdown. 
If you want to know what is possible, visit this [link](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-){:target="_blank" rel="noopener noreferrer"}. 

Another interesting command is the sendTyping method. 
This creates the three blinking dots indicating a bot is typing something. 
This is turned off when a message is sent to the Discord server. 
As you might have noticed, there is a bit functional programming going on in these code snippets. 
In short, you can prep the message you are about send to the server with numerous options, and at the end, when you execute the queue method, it will be sent.

Sending back a simple message is maybe not that useful, but you can insert any java code here that you wish for: performing calculations, calling services, … 
You might even want to pay homage to EverQuest, one of the first successful MMORPGs, and implement a “/pizza” command allowing your members to order pizza, so they don’t have to leave their chairs for anything.

TextMessage replies are however very bland. 
A more fanciful option is to send an Embed message. 
This allows setting additional components such as a title, a colour board, images, a footer with thumbnail and lots of other stuff. 
This gives for more options should the need be there.

```java
public class CommandsListener extends ListenerAdapter {

    @Override
    public void onGuildMessageReceived(@Nonnull GuildMessageReceivedEvent event) {
        Message message = event.getMessage();
        String[] commands = message.getContentRaw().split("\\s+");
        if (commands.length > 0 && "/status".equals(commands[0])) {
            TextChannel channel = event.getChannel();
            channel.sendTyping().queue();
            EmbedBuilder builder = new EmbedBuilder()
                    .setTitle("**Lost In Space**")
                    .setDescription("The answer to your question: Danger, Will Robinson")
                    .setColor(Color.RED)
                    .setThumbnail("https://cdn-icons-png.flaticon.com/512/3662/3662817.png")
                    .setFooter("Status Alert!", https://st.depositphotos.com/1008244/1873/v/950/” + 
	    “depositphotos_18734623-stock-illustration-skull-danger-signs.jpg");
            channel.sendMessageEmbeds(builder.build()).queue();
        }

    }
}
``` 

Triggering this listener will add the following message to the channel:
{:refdef: style="text-align: center;"}
<img src="{{ '/img/2022-01-14-what-would-discord-bot-do/discordembed.png' | prepend: site.baseurl }}" alt="Workspace" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

One last nugget of wisdom I will impart in this article: If you want to mention the member that typed the command for the bot in your bot’s reply, this can be done by adding the following piece of markup (<@!>): 
```java
String userId = message.getMember().getUser().getId();
channel.sendMessage(“Replying to <@!" + userId + ">: Hello there!”)
.mentionUsers(userId)
.mentionRepliedUser(true)
        .queue();
``` 

Your bot is ready to go and be enjoyed by all the members that grace your digital playground. 
Now that it is clear what your bot should do, you should probably go back to the permissions in the Discord Developer Platform, remove the Administrator permission, and activate only those permissions it will need.  
