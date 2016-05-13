---
layout: post
author: jan_de_wilde
coauthor: steve_de_zitter
title: 'JS Conf Budapest Day 2'
image: /img/js-conf-budapest-2016.jpg
tags: [JSConfBudapest,JavaScript,Conference]
category: conference
comments: true
---

## From JS Conf Budapest with love

This years JS Conf Budapest is hosted at [Akvárium Klub](http://akvariumklub.hu/).
Located right in the center of the city, below an actual pool, filled with water!

> Akvárium Klub is more than a simple bar: it is a culture center with a wide musical repertoire from mainstream to underground.
> There is always a good concert and a smashing exhibition, performance, or other event happening here, in a friendly scene, situated right in the city center. 

JS Conf Budapest is hosted by the one and only [Jake Archibald](https://twitter.com/jaffathecake) from Google.
After waiting in line to get our badges we were welcomed at the main hall where some companies hosted stands.
In another space after the main hall tables were nicely dressed and people could have a nice breakfast.
For the coffee lovers, professional baristas served the best coffee possible. With a nice heart drawn on top if it.

![Keynote]({{ '/img/js-conf-budapest/from-js-conf-budapest-with-love.jpg' | prepend: site.baseurl }}) 


****


## Day 2: Morning

* [Suz Hinton: The Formulartic Spectrum](#)
* [Oliver Joseph Ash: Building an Offline Page for theguardian.com](#)

### Suz Hinton: The Formulartic Spectrum

Suz is front-developer at Kickstarter. Member of the NodeJS hardware working group. Member of the Ember-A11y Project team.

You can find her on Twitter using the handle [@noopkat](https://twitter.com/noopkat).

> The physical world is just another binary machine.
> Data creation, analysis, and corruption combined with JavaScript can make new and unexpected things.
> Can you programmatically extract joy from the subjectivity it exists in?
> Can it be translated into intentional forms to hook others in?
> This session will gently take you along on a personal journey of how you can use code to expose new expressions of the mundane secrets we hold dear.

#### Data and art

#### Making a mess


****


### Oliver Joseph Ash: Building an Offline Page for theguardian.com

Oliver is ....

You can find him on Twitter using the handle [@OliverJAsh](https://twitter.com/OliverJAsh). 

> You’re on a train to work and you open up the Guardian app on your phone.
> A tunnel surrounds you, but the app still works in very much the same way as it usually would—despite your lack of internet connection, you still get the full experience, only the content shown will be stale.
> If you tried the same for the Guardian website, however, it wouldn’t load at all.
> Native apps have long had the tools to deal with these situations, in order to deliver rich user experiences whatever the user’s situation may be.
> With service workers, the web is catching up.
> This talk will explain how Oliver used service workers to build an offline page for theguardian.com.

****


### Yan Zhu (@bcrypt) : Encrypt the web for $0

**Is the web fast yet?**

Yes. Size of pages is rising. Amount of HTTPS requests is also rising!

**Is TLS fast yet?**

Yes. Netflix is going to secure streams this year over HTTPS.

* 2015: Netflix and chill
* 2016: Netflix and HTTPS and chill

https://istlsfastyet.com

Let's Encrypt (https://letsencrypt.org). At this moment in beta.

https://gethttpsforfree.com

### Dennis Mishumov : Why performance matters

- Speed! 1 second gain will increase revenue bij 1% for Company X. 1 second slower will decrease conversions by approx 5%.

**Performance is about perception! Not mathematics.**

The 20% rule.
- Event: make page load at least 20% faster, otherwise they don't notice. We're talking about noticeable difference. A big difference with meaningful difference.

**Noticeable !== Meaningful**

Perception: we did a live test on the conference where the sames page loaded first in 1.6 seconds and afterwards 2 seconds. Most of the people thought the second 2 second page was faster. Perception!

When delaying audio on a video, our mind will trick us by syncing the audio with what is visible on the screen. Perception!

## Day 2 afternoon

### Princiya Sequeira (Zalando - @princi_ya @ZalandoTech) : Natural user interfaces using JavaScript

**Typed, Clicked, Touched, ?**

**Typed, Clicked, Touched, Guestures/Speech/...**

Evolution of user interfaces

* CLI: Codified, Strict
* GUI: Metaphor, Exploratory
* NUI (Natural User Interfaces): Direct Intuitive

NUI: more natural and more intuitive

**NUI + JS = NUIJS**

Motivation: Started with @princi_ya trying to build simulator for motion controlled 3D camera's. Tool is not dependent on any platform. Once the simulator whas made, trying to build some apps (using leap motion for example) to move a slideshow or other purposes.

Augmented Reality.
Virtual Reality.
Perceptual Computing: bringing human like behaviour to devices
A lot of devices available: VR, motion, ...

**What next?**

Architecture:

* Step 1: USB controller reads sensor data
* Step 2: Data is stored in local memory
* Step 3: Data is streamed via USB to SDK

The streaming part is a very important part. Why? I have no clue.

https://github.com/nuijs

Open source tools also: Webcam swiper and JSObjectDetect

Example: Drawing board with a brush. NUIJS will translate the input data from the mousepointer to the Node.js Web Socket server and this one will process the data and send it back to the LEAP motion SDK. The same code can be used with the LEAP motion itself.

**Viola Jones Algorithm**

* HAAR feature selection
* Creating an integral image
* Adaboost training
* Cascading classifiers

### Maurice de Beijer (@mauricedb) : Event-sourcing your React-Redux applications

React Tutorial (Kickstarter) : @react_tutorial

**"The biggest room in the world, is the room for improvement - Anonymous**

**Restfull way**

Database <= CRUD => Server <= HTTP => Browser / React

Fine if you have a simple application.

Command query responsibility segregation

* Database => Read => Query service <= HTTP =>
* => Browser / React
* Database <= Update <= Command service <= HTTP =>

Note: 2 lines above need to be stacked (in flow form) and both end up to Browser / React

Event sourcing will not overwrite the previous state, but will save the new state. This means that you get a backlog or version history.

### Rachel Watson (@ohhoe) : The Internet of Cats

How can we incorporate cats in technology?

**Trying new things is scary**

* Embarking on a new project: will it succeed, will it suck?
* Using new technologies for the first time: what will happen, will it work for me?
* Contributing to Open Source: putting yourself out there is terrifying!

**Why so scary?**

* Fear of rejection
* Imposter Syndrome
* Inclusiveness of Communities
* Bad behaviour in General: e.g. Oh you didn't know about THIS?, e.g. completely ignoring contributions
* Your GitHub **green** timeline is not a representation of what you're worth. Just opening a PR just for the sake of it sucks.
* Don't instult the contributor, why on earth ...
* Vulgar and brutal harassment of the community, seriously, get a life!
* PR's that get ignored (for over a year) and then the maintainer writes the same fixes and says: Oops! 

**Echochamber.js**

**Proposals for new contributors**

* Find something you are passionate about
* Somthing new you want to try
* Make something cool and open source it yourself
* First point of contact is your peers
* Constructive criticism!

**Building a cat feeder bot**

Node based cat feeder that works over the web. Robokitty!

https://github.com/rachelnicole/robokitty

http://imcool.online/robokitty/

Node.js + Johnny-five + socket.io + Arduino-Uno (no internet connectivity, so not used) + Arduino Yun (not compatible with johnny five, so not used) + Particle Photon (we have winner!à

* Dry goods dispenser
* Particle Photon kit (with breadboard)
* Continuous servo
* 4xAA battery pack with on/off switch
* Misc hardware accessories: ...

A servo needs external power, so yeah, plugging it in the microcontroller is not enough. Lessons learned!

No idea how to solder, oh, worked out!

**Lessons learned**

* Don't be afraid of the unfamiliar
* Don't be afraid to ask for help
* People really like cat stuff
* Don't downplay your abilities: I mean, it's a super cool kitty food dispenser!
* I like nodebots a lot

### Nick Hehr (@HipsterBrown) : The other side of empathy

#### Empathy

Nick Hehr shares Rachels' point of view on the sometimes rude Open Source communication and communication on Social media in general.
In his talk, he addressed the way you should behave when volunteering to contribute or when giving feedback to contributors in Open Source Projects.
And Empathy turns out te be key in this process.

#### Ranting

It's all to easy to judge or express prejudice these days, through these social media channels and not think about the people who are actuall behind the idea or concept you're judging.
People that decide to Open Source the work on which they've spend tons of effort (usually because it's their passion, but still...) aren't exactly waiting for trolls or rants from people who like this easy judging.

Empathy also plays a huge role in the other way around. 
It happens al to often that people trying to contribute to OSS for the first time are being ignored (by literaly ignoring their pull requests for example), being treated like idiots (instead of being given constructive feedback in case of room for improvements), etc...

#### Saying nice things

"If you don't have anything nice* to say, don't say anything at all!"

Nice in this context means constructive. Comment on something you think could use improvement and offer a solution.
Compliment on certain aspects that really improve the tool.

Due to the relative anonymity of social media and other communication channels, we tend to forget these principles.

#### Key take-aways

Key points to take away from this session are:

- Give constructive feedback!!!
- Always keep in mind the language your using when commenting on Open Source initiatives
	- Don't be to blunt or direct in your reactions. 
- Use the right channels for your communication 
	- meaning, don't ask for feedback on twitter
	- Instead turn to platforms such as Slack, IRC, Gitter...
	- Get (constructive) feedback from people you trust
- People that open source their tools don't owe you anything. 
	- They're not entitled to give up all their time for you. 
	- They're not here to start fulfilling all requests from a demanding userbase. It's open source, submit a pull request

Living by these rules will make the (web-)world a little bit of a better place, but won't prevent other people from still continuing these bad habbits.
Don't let these people get to you! Continue doing what you're passionate about en seek out those who will give you that constructive feedback.

## Conclusion

As you can see it is fairly simple - just 4 steps - to add TypeScript support to your Ionic project by changing the default gulp setup used by Ionic.
It's nice to know that Ionic 2 will have support for TypeScript built in so you won't have to do it yourself.
By adding a flag `--ts` to your Ionic 2 project setup it will be enabled.

Personally I love using TypeScript and will use it whenever I can.
It makes my life as a developer a lot easier by spotting errors before I even hit the browser.

What are your thoughts about TypeScript? Feel free to add them in the comments section.
