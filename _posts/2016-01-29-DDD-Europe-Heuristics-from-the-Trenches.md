---
layout: post
authors: [yannick_de_turck]
title: 'Heuristics from the Trenches by Cyrille Martraire'
image: /img/DDDEurope2015.jpg
tags: [Domain-Driven Design, DDD, Software Craftmanship]
category: Domain-Driven Design
comments: true
---
> "Communication usually fails, except by accident" - Osmo Wiio

----------

With this quote of the Finnish researcher [Osmo Wiio](https://en.wikipedia.org/wiki/Osmo_Antero_Wiio), Cyrille opened the second day of the [DDD Europe](http://dddeurope.com) conference. Osmo’s laws of communication are the **human communications equivalent** of Murphy’s law. Basically if communication can fail, it will and if a message can be understood in several different ways it is quite possible that it will be understood in a harmful way. With the quote Cyrille immediately wants to stress that with Domain-Driven Design, deep conversations with domain experts and careful attention to the language are key.

**Business domains** are often very complex and hard to get into for individuals not familiar with the domain. The **conversations' game** with **domain experts** is a game that takes many years and many failures in order to get better at. Cyrille explained that, even though it’s hard, it’s perfectly possible over time to extract a growing set of techniques, heuristics and best practices to boost the effectiveness of the interviews with domain experts, to learn faster and to converge more quickly to better models.

### Practices and tricks for talking to the domain experts
"Why is it so hard?" you might ask yourself or “We don’t talk the same language as them and they don’t have time for us!”. While it is true that the people with the highest expertise within a certain domain often don’t have a lot of time for interviews or meetings, it is up to us, the developers, to make the **necessary preparations** prior to seeing them. You should first take some time in order to teach yourself some **basic domain knowledge**. It all starts with **genuine curiosity**, successful people are curious about their business domains. You may not believe this but here this will help you too! Without this you will have a bad time! **Do your homework**: perform the necessary research about the domain on the internet, Google around, read books, check Oasis, … Usage of **ubiquitous language** is very important.

**Note taking** is also a very important aspect in the whole story. You need to be able to take notes like a pro! Learn to take notes effectively. **Listen actively** and **don’t distort** the stories the domain experts tells you. Keep the words as they are. It really is harder than you would think, so you should turn it into a game:

- **Write down the stories** the domain experts tell you
- **Underline new words** and **add a definition** for yourself, get familiar with all the domain terms
- Take note of **side remarks**
- If you think that you’ve encountered a synonym for an existing new word **dig into it** and **ask for more detail**
- **Show your knowledge** to the domain user to **establish credibility** and to challenge them
- But… Challenge them **respectfully**!

All this is **Domain-Driven Design**!

### Talking to people is hard
It is not easy talking to people and it will often be hard to have **productive conversations**. However this is also something you can **grow into** and for which you can develop the **right toolset**. Have **interactive conversations**, that way you have control over the conversation and the way you can steer it. Start with “what exactly is the goal?”. **Be precise** when asking questions, we want to avoid having to reverse engineer the true need from an expressed solution. Be sure to **scan the notes** you took during a previous conversation and **decide** where you want the conversation to go next.

---
> "I keep developers out of conversations about the domain because they always want to know 'why this' and 'why that'. Just write your code." - [The Expert Beginner](https://twitter.com/expertbeginner1/status/656122859773820929)

----------

You should **question everything**: ask why but don’t go too far!

Combine Domain-Driven Development with **Behaviour-Driven Development**. Both go hand in hand to interview domain experts. You want to **discover the "unknown unknowns"** as early as possible and to **avoid misunderstandings** as often as possible. Be sure to **ask for concrete examples** and **genuine sample documents and data** and although this doesn’t always come easy, ask and insist but as mentioned before know your limits and be sure not to push it.

People always think that talking abstract is faster and will save time but think about it and ask yourself: “Is it truly faster if we were wrong or missed stuff that matters?”. If the domain expert seems hesitant about something also take note of this to take into account that the feature in question might be eligible for change later on, this way we can **model our software design correctly**.

### The domain expert delusion
You might assume that the person, you’re having a conversation with, is an actual system expert within the domain but chances are that he/she is not. The worst expert is the one whose expertise was built from the intricacies of the existing systems. It is therefor also our duty to help out the domain expert where possible:

- **Have empathy**, try to put yourself in their shoes
- **Build a partnership**, it should be a two-way conversation you’re having with the expert
- **Make it clear** that the domain expert is always safe with you, that you have no plan to steal their job
- **Propose things**, it doesn’t always have to be right but this way you will get somewhere
- **Look for invariants**, for example: “Is there any other outcome that is also important?"
- Always **ask for validation** of everything, even if you’re sure about it

It is common in companies that businesses often don’t want all power concentrated into the same hands. This also accounts for domains, you should therefor **assume and probe**. Get to know the business you are dealing with and their mentality. Not that if you happen to discover that there are multiple domain experts the situation gets a bit more tricky. Having multiple domain experts may lead to more confusion and makes it even more important asking for validation and challenging the experts. Something we want to achieve is that we want to suggest features from our code which could be very useful for the business. Instead of having software to support the domain we want to have **software augmenting the domain**.

### Keep improving yourself
**Grow into it** and **build your own toolbox** for implementing Domain-Driven Design. You might ask yourself why you should bother so much with all of this, after all we just want to get to it and write code. This however is a wrong approach because the complexity of the domain is there, it is just hiding behind a wall, you just don’t see it yet. You will discover the complexity sooner or later so you may as well want to get into it as early as possible to save precious time. After all, you want to become a **domain expert** too!

### Other useful resources mentioned by Cyrille:
- [Conversation Patterns for Software Professionals](http://schd.ws/hosted_files/agile2014/d5/1571_Agile2014__Conversation_Patterns_for_Software_Professionals.pdf) by Michael Bartyzel
- [Analysis Patterns](http://martinfowler.com/books/ap.html) by Martin Fowler
- [Living Documentation](https://leanpub.com/livingdocumentation) by Cyrille Martraire
- Slides: [http://www.slideshare.net/cyriux](http://www.slideshare.net/cyriux)
- Blog: [http://cyrille.martraire.com](http://cyrille.martraire.com)
- Twitter: [@cyriux](https://twitter.com/cyriux)