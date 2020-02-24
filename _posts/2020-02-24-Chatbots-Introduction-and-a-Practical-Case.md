---
layout: post
authors: [jasper_rosiers]
title: "Chatbots - Introduction and a practical use case"
image: /img/chatbot.png
tags: [Chatbots, Chatlayer, DialogFlow, Spring Boot, NestJS, Mocking, TypeScript]
category: Machine Learning
comments: true
---

> Chatbots, they seem to be everywhere, and yet, there are a lot of people who have no idea what they are.
> I came home one day in October and told my parents and sisters I was building a chatbot at work.
> Their reaction: "You're building a what now?". 
> So I took ten minutes to explain them what a chatbot is and does.
> In the end, they just said "So... It is a computer person?". <br/> <br/>
> This post will feature a high-level explanation of what chatbots are and what they do, as well as a deep dive into chatbot providers and a technical implementation. 
> In the end, we'll look at a practical case of a chatbot: FleetBot Dina. 

# Table Of Contents

* [Introduction](#introduction)
* [Essential terminology](#essential-terminology)
* [Chatbot providers](#chatbot-providers)
* [Practical case: FleetBot Dina](#practical-case-fleetbot-dina)
* [Technical implementation](#technical-implementation)
* [Conclusion](#conclusion)
* [Resources](#resources)

# Introduction
The concept of chatbots has existed ever since Alan Turing designed the Turing test in 1950, with the original concept of the test dating back to 1936.
The question asked in this test was "Can machines think?". 
The test proposes a way to measure if the testee can know whether he's talking to a human or a machine.
Joseph Weizenbaum was the first to design a real chatbot, ELIZA, in 1966 at the MIT AI laboratory, which he called a 'chatterbot'.
Even though it failed the Turing test, the main idea behind a chatbot has since then remained the same: recognise what a user says using pre-programmed keywords and phrases, and respond accordingly.

<img alt="ELIZA" src="{{ '/img/2020-02-24-Chatbots-Introduction-and-a-Practical-Case/ELIZA.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

Technology has obviously evolved a lot since 1966. 
Modern chatbots do not only look at keywords and phrases anymore.
They use a technology called [Natural Language Processing](https://mobilecoach.com/chatterbots-6-what-is-natural-language-processing/){:target="_blank" rel="noopener noreferrer"} (NLP) and Understanding (NLU) to understand the meaning behind what a user says. 
NLU uses complex algorithms to analyse the input, not only with predefined keywords but by using various aspects of the language and the sentence structure of the given input.

This way, not only can a chatbot understand what a user says, but it can also do a sentiment analysis and extract useful information out of the input.
An example, when the user says *"Damn, someone drove into my **Car Brand** earlier today, but it wasn't my fault. I don't know what I should do now."*, the chatbot would know that the user was quite angry, he had an accident, and he drives a **Car Brand**. 
The bot's response could be: *"I hope you're okay. Here is a list of garages you can go to. Since it wasn't your fault, insurance will help you figure this out."*

<img alt="NLP" src="{{ '/img/2020-02-24-Chatbots-Introduction-and-a-Practical-Case/NLP.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

In 2006, the world saw the first big tech company launch a chatbot called Watson.
IBM's Watson went on to winning a game of "Jeopardy!" against all-time champions Ken Jennings and Brad Rutter in 2011.
Since then, tech giants like Apple (Siri), Google (Google Now), Amazon (Alexa) and Microsoft (Cortana) have all launched their own personal assistant chatbots with their respective NLPs.
In Belgium, Antwerp company [Chatlayer](https://www.chatlayer.ai){:target="_blank" rel="noopener noreferrer"} provides a custom platform to build chatbots. 
They use whichever NLP is best in a given language.
For Flemish & Dutch, they built a custom NLP. 

Like all chatbots, these personal assistants have a specified set of use cases, setting alarms, playing music, reading the weather report, telling jokes,... 
If they don't know the answer to a question, they will usually just look up whatever you asked on the internet, and give you the best response.

# Essential terminology
These are a few terms you should know when studying or working with chatbots.
They will be used throughout this blog.

* **Natural Language Understanding**<br/>
> NLU is the Artificial Intelligence (AI) which tries to understand the meaning behind what a user says.
> It can do a sentiment analysis, extract relations between words and phrasing, do semantic parsing,...
* **Natural Language Processing**<br/>
> NLP consists of NLU, along with extra factors like syntactic parsing. 
> The key takeaway here is that NLP translates the user input to machine language and determines what a user has said.
* **Natural Language Generation (NLG)**<br/>
> NLG comes after the computer has understood the meaning behind the input and formulates an answer. 
> This answer is usually predefined, but can vary depending on the input and the entities the bot has saved so far. 
* **Entities**<br/>
> Entities are data that a chatbot can save during a conversation, e.g. your car brand, your tire type,...
* **Expressions**<br/>
> An expression is anything that a user sends or says to the bot.
* **Intents**<br/>
> The intent is the purpose behind a user's message, e.g. does the user ask for a garage, does he want to know about how to refill his AdBlue,...
* **Context**<br/>
> A context is used when you expect the user to reply to a bot question.
> By using contexts, you can direct the conversation into a certain flow, helping both the user and the computer along.

# Chatbot providers
There are multiple chatbot providers you can use when building bots. 
Each bot has its own NLP and User Interface (UI), but to the core, they all expect the developer to provide the same things: expressions, intents and flows to guide a user through the conversation.
Chatbots can be implemented via various chat clients: Messenger, Microsoft Teams, Slack, Google Assistant,...
Chatbot providers provide you with integrations in different of these clients, and usually enable you to program a custom integration using (REST) APIs.

Below, the biggest chatbot providers of today are listed with their properties (at the time of writing). 
We will not discuss each in detail with how bots are built, since it is equivalent for all, only varying in the UI.
There will be links in the [Resources](#resources) section of this blogpost.

<span class="image right"><img alt="Dialogflow" src="{{ '/img/2020-02-24-Chatbots-Introduction-and-a-Practical-Case/DIALOGFLOW.jpg' | prepend: site.baseurl }}" style="margin:0px auto; max-width: 200px;"></span>

**[Google DialogFlow](https://dialogflow.cloud.google.com/){:target="_blank" rel="noopener noreferrer"}**<br/>
> * Easy and free to start up;
> * Events possible to trigger via API, making it able to move the conversation into a certain flow easily depending on user input;
> * Parameters can all be asked within same intent;
> * Intent structure can become very complicated for bigger bots, especially when first getting into an existing project;
> * **Responses can be customised** based on the supported chat clients;
> * Complicated responses with images, buttons, cards,... and jumping from intent to intent requires a **lot of coding**;
> * No sentiment analysis;
> * **About 20 integrations supported for free out of the box**, both chat and voice, possible to code custom integrations via API;
> * **Multilingual**, Dutch relatively ok, Flemish is difficult.

<span class="image right"><img alt="AmazonLex" src="{{ '/img/2020-02-24-Chatbots-Introduction-and-a-Practical-Case/AMAZONLEX.png' | prepend: site.baseurl }}" style="margin:0px auto; max-width: 200px;"></span>

**[Amazon Alexa/Lex](https://aws.amazon.com/lex/){:target="_blank" rel="noopener noreferrer"}**<br/>
> * Easy and (practically) free to start up (you do have to make an account linked to a credit card);
> * Built to work with **Amazon Lambdas**, booking appointments etc;
> * Integration with Amazon Connect, CRM tools,...;
> * Parameters can all be asked within same intent;
> * No easy way to build big flows, no context possibilities;
> * Best for small conversations like booking an appointment;
> * Integration with Messenger, Slack and Twilio + API;
> * **Single-language -- only English.**

<span class="image right"><img alt="AmazonLex" src="{{ '/img/2020-02-24-Chatbots-Introduction-and-a-Practical-Case/MICROSOFTPOWERVA.jpg' | prepend: site.baseurl }}" style="margin:0px auto; max-width: 200px;"></span>

**[Microsoft Luis/Power Virtual Agents](https://powervirtualagents.microsoft.com/en-us/){:target="_blank" rel="noopener noreferrer"}**<br/>
> * Easy and free to start up;
> * Built to work with **Dynamics 365**;
> * Easy off-handing to live chat when bot fails;
> * Parameters can all be asked within same block;
> * Easy to build big flows -- Tree structure using various blocks depending on use case;
> * **About 15 integrations supported for free out of the box**, both chat and voice, possible to code custom integrations via API;
> * **Single-language -- only English**.

<span class="image right"><img alt="IBMWATSON" src="{{ '/img/2020-02-24-Chatbots-Introduction-and-a-Practical-Case/IBMWATSON.jpg' | prepend: site.baseurl }}" style="margin:0px auto; max-width: 200px;"></span>

**[IBM Watson](https://www.ibm.com/watson/how-to-build-a-chatbot){:target="_blank" rel="noopener noreferrer"}**<br/>
> * Easy and free to start up (30 day trial);
> * Relatively easy to build big flows -- Treelike structure using various blocks depending on use case;
> * Integration with Messenger, Slack, WordPress and Intercom + API;
> * **Multilingual with Watson Language Translator**, Dutch relatively ok, Flemish is difficult.

<span class="image right"><img alt="CHATLAYER" src="{{ '/img/2020-02-24-Chatbots-Introduction-and-a-Practical-Case/CHATLAYER.jpg' | prepend: site.baseurl }}" style="margin:0px auto; max-width: 200px;"></span>

**[Chatlayer](https://www.chatlayer.ai){:target="_blank" rel="noopener noreferrer"}**<br/>
> * Easy and free to start up (30 day trial, Chatlayer has to manually approve your request for a trial);
> * Easy to build big flows -- Tree structure using various blocks depending on use case;
> * Parameters can be asked using 'Input Validation', on faulty type of answer. 
You can reply with a custom message to make sure the user uses the correct format;
> * Extensive reply capabilities;
> * Integration with Messenger, Google Home, WhatsApp and Intercom + API;
> * **Multilingual**, Custom NLP for Dutch/Flemish, uses best available NLP for other languages. 
Can automatically detect and understand all languages, regardless of the language you programmed the bot to understand. 
Can answer only in the languages you programmed.;

# Practical case: FleetBot Dina
At Ordina, we have about 800 cars in our Fleet. 
These, along with everything concerning alternative modes of transport and phone subscriptions, are managed by only two people.
As you're probably thinking right now, this sounds like quite a hefty workload, and you would be quite right.
At the time of writing this blogpost, they have to deal with up to 150 emails on a daily basis, which is only expected to rise as Ordina is constantly growing.
Since we at JWorks also have questions from time to time, but wanted to lift a bit of their workload, we decided to pitch them the idea of building a chatbot.

The chatbot is to be launched to Ordina's Microsoft Teams.
This way, everyone at Ordina could contact it without having to bother with adding it as a separate user or having to create an account on a chat client they don't use.
Since JWorks uses Telegram for a lot of their internal communications, and we like experimenting, we decided to also build a connection to a Telegram bot.
This Telegram connection was only used in the testing of the FleetBot and to improve the accuracy of the NLP.

We tested all of the chatbot providers listed in the [Chatbot providers](#chatbot-providers) section, and ended up choosing Chatlayer for its outstanding Flemish/Dutch NLP, because most of Ordina Belgium's employees are Flemish speaking.
The possibility to extend that functionality to Ordina in the Netherlands was an attractive bonus.
We also wanted to be able to hand the bot over to the Fleet division when it was finished, so they could keep it up to date without us.
We felt that Chatlayer offered the best UI for maintenance by non-developers.

Below is a short example of the Fleetbot in MS Teams.

<div class="responsive-video">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/zgIOB8djVrM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

# Technical implementation
The general program structure is shown in the image below. 
We will discuss the MS Teams bot in detail later on. 
As you can see, both the Teams and Telegram adapter have their own repo & deployment. 
The reason behind this is that we wanted to be able to provide custom connections for any chat client without having to edit in an adapter used for another one.
Using the gateway, we can easily route the response from chatlayer to the adapter it is supposed to go to.

<img alt="GENERALLAYOUT" src="{{ '/img/2020-02-24-Chatbots-Introduction-and-a-Practical-Case/GENERALLAYOUT.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

The image below shows the production environment of the FleetBot in MS Teams. 
As you can see, Teams sends an API call to our adapter, which then converts it to a message format Chatlayer accepts.
For these API calls, as well as testing, we used [NestJS](https://nestjs.com/){:target="_blank" rel="noopener noreferrer"}, an extension of NodeJS in TypeScript.
For the Telegram adapter, we used [Spring Boot](https://spring.io/projects/spring-boot){:target="_blank" rel="noopener noreferrer"} and Java instead to experiment with different technologies.

To get all useful information out of the Teams message, we use the [Microsoft BotFramework](https://docs.microsoft.com/en-gb/azure/bot-service/javascript/bot-builder-javascript-quickstart?view=azure-bot-service-4.0){:target="_blank" rel="noopener noreferrer"}. 
During this conversion, we add a prefix to the id: `teams-prod:`. 
This prefix makes it possible for the Gateway to know that the message came from the Teams bot in the production environment and thus send it back to the correct bot.

<img alt="TEAMSINDETAIL" src="{{ '/img/2020-02-24-Chatbots-Introduction-and-a-Practical-Case/TEAMSINDETAIL.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

The BotFramework provides methods to get a conversation's context, and reply to the correct user using that context.
Hence, we see the `turnContext.sendActivities()` method used to reply to a user.
We used the NodeJS version of the BotFramework, and used a map to save the conversation references. 
The reference gets deleted right after the reply has been sent, so we didn't need to worry about using a database to save the conversation.

<img alt="CONVERSATIONREF" src="{{ '/img/2020-02-24-Chatbots-Introduction-and-a-Practical-Case/CONVERSATIONREF.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

Since Chatlayer supports many types of replies, all of these had to be converted to the possible Teams messages.
Depending on the message type Chatlayer sent, the `sendActivities()` method has to send a different Activity. 

<img alt="CONTINUECONV" src="{{ '/img/2020-02-24-Chatbots-Introduction-and-a-Practical-Case/CONTINUECONV.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto">

As you can see, there are the normal text messages, but also carousels and cards (of which there are multiple types). 
This variety can deliver very fun and engaging conversations, which can improve your user retention and experience.
Of course, the use of all these features depends heavily on the conversation topic and context.
You can see an example of all possible messages below.

<table><tr>
<td><img alt="TEAMS1" src="{{ '/img/2020-02-24-Chatbots-Introduction-and-a-Practical-Case/TEAMS1.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto"></td>
<td><img alt="TEAMS2" src="{{ '/img/2020-02-24-Chatbots-Introduction-and-a-Practical-Case/TEAMS2.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto"></td>
</tr></table>

# Conclusion
After working with chatbots during the past 6 months, I'm proud of what we've achieved so far. 
The FleetBot is being actively tested at JWorks and looking to go live for all Ordina Belgium employees.
Because of working closely with Chatlayer on the FleetBot project, we have initiated a partnership for future chatbot projects.
There already are a number of interesting projects coming up that we're happy to be part of.
Having tested many chatbot providers, we can confidently make an assessment of which one would be best in any use case.

What I'm most excited about is the versatility of chatbots. 
Want one in Telegram or Slack? <br/>
No problem, we can build that connection! <br/>
Want one that speaks Chinese, German and English? <br/>
Can do!

Do you think your company could use a chatbot to raise user satisfaction, reduce your FAQ workload, or for anything else it could help out with?
Get in touch with [Frederick Bousson](mailto:frederickbousson@ordina.be?subject=[Chatbots]%20Interest%20in%20chatbot%20project)! <br/>
We can help you evaluate if a chatbot is indeed the way to go for your specific case and choose the correct provider for your needs.
After that, we will assist you in building the bot and build all necessary chat client connections.

# Resources
* [Chatbot History](https://mobilecoach.com/chatterbots-2-history-of-chatbots/){:target="_blank" rel="noopener noreferrer"}
* [Watson Jeopardy!](https://www.nytimes.com/2011/02/17/science/17jeopardy-watson.html){:target="_blank" rel="noopener noreferrer"}
* [NLP Intro](https://becominghuman.ai/a-simple-introduction-to-natural-language-processing-ea66a1747b32){:target="_blank" rel="noopener noreferrer"}
* [NLP vs NLU](https://nlp.stanford.edu/~wcmac/papers/20140716-UNLU.pdf#page=8){:target="_blank" rel="noopener noreferrer"}
* [10 Lessons Learned From Building Big Chatbots](https://www.chatlayer.ai/wp-content/uploads/downloads/big-bots-guide-20190626.pdf){:target="_blank" rel="noopener noreferrer"}