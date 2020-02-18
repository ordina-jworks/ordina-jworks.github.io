---
layout: post
authors: [jasper_rosiers]
title: "Chatbots - Introduction and a practical use case"
image: /img/chatbot.png
tags: [Chatbots, Chatlayer, DialogFlow, Spring Boot, Nest Js, Mocking, TypeScript]
category: Smart tech, Machine Learning
comments: true
---

> Chatbots, they seem to be everywhere, and yet, there are a lot of people who have no idea what they are.
> When I came home one day in October and told my parents and sisters I was building a chatbot at work.
> Their reaction: "You're building a what now?". 
> So I took ten minutes to explain them what a chatbot is and does.
> In the end, they just said "So... It is a computer person?". <br/> <br/>
> This post will feature a high-level explanation of what chatbots are, as well as a deep dive into chatbot providers and a technical implementation. 
> In the end, we'll look at a practical case of a chatbot: FleetBot Dina. 

# Table Of Contents

* [Introduction](#introduction)
* [Essential terminology](#essential-terminology)
* [Chatbot providers](#chatbot-providers)
* [Technical implementation](#technical-implementation)
* [Practical case: FleetBot Dina](#practical-case-fleetbot-dina)
* [Conclusion](#conclusion)
* [Resources](#resources)

# Introduction
The concept of chatbots has existed ever since Alan Turing designed the Turing test in 1950, with the original concept of the test dating back to 1936.
The question asked in this test was "Can machines think?". 
The test proposes a way to measure if the testee can know whether he's talking to a human or a machine.
Joseph Weizenbaum was the first to design a real chatbot, ELIZA, in 1966 at the MIT AI laboratory, which he called a 'chatterbot'.
Even though it failed the Turing test, the main idea behind a chatbot has since then remained the same: recognise what a user says using pre-programmed keywords and phrases, and respond accordingly.

<img alt="ELIZA" src="{{ '/img/2020-02-20-Chatbots-Introduction-and-a-Practical-Case/ELIZA.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

Technology has obviously evolved a lot since 1966. 
Modern chatbots do not only look at keywords and phrases anymore.
They use a technology called [Natural Language Processing](https://mobilecoach.com/chatterbots-6-what-is-natural-language-processing/){:target="_blank" rel="noopener noreferrer"} (NLP) and Understanding (NLU) to understand the meaning behind what a user says. 
NLU uses complex algorithms to analyse the input, not only with predefined keywords but by using various aspects of the language and the sentence structure of the given input.

This way, not only can a chatbot understand what a user says, but it can also do a sentiment analysis and extract useful information out of the input.
An example, when the user says *"Damn, someone drove into my **Car Brand** earlier today, but it wasn't my fault. I don't know what I should do now."*, the chatbot would know that the user was quite angry, he had an accident, and he drives a **Car Brand**. 
The bot's response could be: *"I hope you're okay. Here is a list of garages you can go to. Since it wasn't your fault, insurance will help you figure this out."*

<img alt="NLP" src="{{ '/img/2020-02-20-Chatbots-Introduction-and-a-Practical-Case/NLP.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

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
> Entities are data that that a chatbot can save during a conversation, e.g. your car brand, your tire type,...
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

Below, the biggest chatbot providers of today are listed with their properties. 
We will not discuss each in detail with how bots are built, since it is equivalent for all. 
There will be links in the [Resources](#resources) section of this blogpost.

<span class="image right"><img alt="Dialogflow" src="{{ '/img/2020-02-20-Chatbots-Introduction-and-a-Practical-Case/DIALOGFLOW.jpg' | prepend: site.baseurl }}"></span>

* **[Google DialogFlow](https://dialogflow.cloud.google.com/){:target="_blank" rel="noopener noreferrer"}**<br/>
> * Easy and free to start up;
> * Events possible to trigger via API, making it able to move the conversation into a certain flow easily depending on user input;
> * Parameters can all be asked within same intent;
> * Intent structure can become very complicated for bigger bots, especially when first getting into an existing project;
> * **Responses can be customised** based on the supported chat clients;
> * Complicated responses with images, buttons, cards,... and jumping from intent to intent requires a **lot of coding**;
> * No sentiment analysis;
> * **About 20 integrations supported for free out of the box**, both chat and voice, possible to code custom integrations via API;
> * **Multilingual**, Dutch relatively ok, Flemish is difficult.

<span class="image right"><img alt="AmazonLex" src="{{ '/img/2020-02-20-Chatbots-Introduction-and-a-Practical-Case/AMAZONLEX.png' | prepend: site.baseurl }}"></span>

* **[Amazon Alexa/Lex](https://aws.amazon.com/lex/){:target="_blank" rel="noopener noreferrer"}**<br/>
> * Built to work with **Amazon Lambdas**, booking appointments etc;
> * Integration with Amazon Connect, CRM tools,...;
> * Easy and (practically) free to start up (you do have to make an account linked to credit card);
> * Parameters can all be asked within same intent;
> * No easy way to build big flows, no context possibilities;
> * Best for small conversations like booking an appointment;
> * Integration with Messenger, Slack and Twilio + API;
> * **Single-language -- only English.**

<span class="image right"><img alt="AmazonLex" src="{{ '/img/2020-02-20-Chatbots-Introduction-and-a-Practical-Case/MICROSOFTPOWERVA.jpg' | prepend: site.baseurl }}"></span>

* **[Microsoft Luis/Power Virtual Agents](https://powervirtualagents.microsoft.com/en-us/){:target="_blank" rel="noopener noreferrer"}**<br/>
> * Built to work with **Dynamics 365**;
> * Easy off-handing to live chat when bot fails;
> * Easy and free to start up;
> * Parameters can all be asked within same block;
> * Easy to build big flows -- Tree structure using various blocks depending on use case;
> * **About 15 integrations supported for free out of the box**, both chat and voice, possible to code custom integrations via API;
> * **Single-language -- only English**.

<span class="image right"><img alt="IBMWATSON" src="{{ '/img/2020-02-20-Chatbots-Introduction-and-a-Practical-Case/IBMWATSON.jpg' | prepend: site.baseurl }}"></span>

* **[IBM Watson](https://www.ibm.com/watson/how-to-build-a-chatbot){:target="_blank" rel="noopener noreferrer"}**<br/>
> * Easy and free to start up;
> * Relatively easy to build big flows -- Treelike structure using various blocks depending on use case;
> * Integration with Messenger, Slack, WordPress and Intercom + API;
> * **Multilingual with Watson Language Translator**, Dutch relatively ok, Flemish is difficult.

* **[Chatlayer](https://www.chatlayer.ai){:target="_blank" rel="noopener noreferrer"}**<br/>
> * 

# Technical implementation

# Practical case: Fleetbot Dina

# Conclusion

# Resources