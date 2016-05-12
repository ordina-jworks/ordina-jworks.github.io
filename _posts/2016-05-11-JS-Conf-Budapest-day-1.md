---
layout: post
author: jan_de_wilde
coauthor: steve_de_zitter
title: 'JS Conf Budapest Day 1'
image: /img/ionic-and-typescript.jpg
tags: [JSConfBudapest,JavaScript,Conference]
category: conference
comments: true
---

### From JS Conf Budapest with love

This years JS Conf Budapest is hosted at [Akvárium Klub](http://akvariumklub.hu/).
Located right in the center of the city, below an actual pool, filled with water!

> Akvárium Klub is more than a simple bar: it is a culture center with a wide musical repertoire from mainstream to underground.
> There is always a good concert and a smashing exhibition, performance, or other event happening here, in a friendly scene, situated right in the city center. 

JS Conf Budapest is hosted by the one and only [Jake Archibald](https://twitter.com/jaffathecake) from Google.
After waiting in line to get our badges we were welcomed at the main hall at some stands and  a warm welcome astarted with a very nice WebGL Master of ceremony Jake Archibald from Google. A lot of jokes and 

## Day 1 morning

### Laurie Voss

#### CTO, npm Inc. @seldo

Registry -> CLI -> You
Registry is a set of servers all around the world.
Tries the match the best version that you are looking for.
Will try to download local cache, otherwise CDN (uses the most closest server to your current location), otherwise registry (worldwide)

It is possible to specify a gist url but NPM does not download from git or something else. That would like be a bazillion amount of data and would not be nice.

EACCESS error -> use sudo -> NOPE! fix your rights

Don't write your package.json yourself, let NPM do it!

New feature in npm is scopes.
npm init --scope=username
npm install @myusername/mypackage
require('@myusername/mypackage')

Can be public and private

tilde/.npm-init.js and PromZard
When you initialise npm it will look in this file and provide basic configurations for the setup.

npm init can always be re-run.

**Why add stuff in devDependencies.**

Because production will install faster.

npm install --production

**Bundled dependencies**

npm install --save --save-bundle

**Offline installs**

npm install --cache-min 999999

**Run scripts**

npm start

npm stop

npm restart

npm test

Are default run scripts you can add to your package.json file.

**Run scripts get devDependencies in path**

Don't force users to install global tools. Don't get conflicts over global tools. Different versions in different projects.

**SemVer - Semantic Versioning**

1.5.6

Breaking Major . Feature Minor . Fix Patch

npm version minor

npm version major

npm version (something else)

npm version major -m "Bump to version %s"

**Microservices architecture**

Work with multiple packages for your services. 

use npm link

In package "Alice" run npm link

In "bob", which requires "alice" run npm link alice

**Unpublish package**

Now restricted after 24 hours. You need to contact support. Since the recent events with npm package that broke the internet. More friendly way is npm deprecated, that tells users the package has been deprecated.

**Keep projects up to date**

npm outdated

npm update

**More run scripts**

npm run start

npm run <anything>

**Stuff everybody should know about npm**

Babel: Transpile all the things! JavaScript, TypeScript, JSX, ...

Webpack and Browserify

Greenkeeper (greenkeeper.io) "npm outdated" as a service!

Node Security Project: npm install nsp -g. nsp check. Check if your project contains vurnerable modules.

Why NPM: npm reduces friction. Takes things you have to do all the time and make things simpler and faster.

### Safia (@captainsafia - safia.rocks) : The Hitchhiker's Guide to All Things Memory in JavaScript

j.mp/js-mem-live

**>> Slides on safia.rocks**

Safia created an interactive tutorial on how to use the chrome devtools for memory management.

**Why care about memory?**

1. It forces us to be (better) more inventive programmers. Add restrictions and forces us to use the best tools to create the best possible experience.
2. Memory is scarce. A lot of people still use devices that are not packed with a lot of memory. Not everyone has high performant dev machines.
3. It helps us exercise our empathy muscles

**What does it mean to manage memory?**

The Good, The Bad, The Ugly

**How does JS manage memory?**

V8 JS Engine.

Booleans, numbers, strings, ...
Memory is allocated in a heap structure. Uses a root node which has references to booleans, string, etc.

So: root node -> references -> variables

6 spaces

* New space: memory get's allocated here when an object is created immediately
* Old pointer space: if you don't use an object for a while
* Old data space: if it's not a reference
* Large object space: store large object tables, store here so it doesn't conflict with the store space of the above mentioned spaces
* Code space: ...
* Map space: 

V8 uses a 'stop the world' technique. Runs a short garbage collection cycle -> Halt the program.

V8 has different approaches on how it collects garbage in the new and old space.

- New space: Garbage collection by Scavenging technique. Starts a Scavenging cycle. Going through entire heap starting from the root and create copies. It will clear out what is currently in new space. Everything that is not reachable will be cleared out of the space. You need double the size of the memory that is availble for the new space to use for the copy.
- Old space: Mark and sweep technique. Remove unmarked objects on a regular basis. Mark and sweep has a rich history in computer science history :)

**How do I write memory performant applications?**

* How much memory is my application using?
* How often do GC cycles occur in my application?

Tools: Chrome Devtools HEAP allocation profiler. Check retain size and shallow size of objects. shallow size of an object is the amount of memory it holds of itself. Retain size is all of it's size and it's dependants.

Heapdump: npm install heapdump . Takes snapshot of your heap at a specific moment. Get a file with a .heap extension which enables you to load it in the chrome devtools.

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

## Day 1 afternoon

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



## Day 2

### Speaker 1

### Speaker 2

### Speaker 3

## Conclusion

As you can see it is fairly simple - just 4 steps - to add TypeScript support to your Ionic project by changing the default gulp setup used by Ionic.
It's nice to know that Ionic 2 will have support for TypeScript built in so you won't have to do it yourself.
By adding a flag `--ts` to your Ionic 2 project setup it will be enabled.

Personally I love using TypeScript and will use it whenever I can.
It makes my life as a developer a lot easier by spotting errors before I even hit the browser.

What are your thoughts about TypeScript? Feel free to add them in the comments section.
