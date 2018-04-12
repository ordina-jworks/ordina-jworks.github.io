---
layout: post
authors: [jan_de_wilde, steve_de_zitter]
title: 'JS Conf Budapest Day 1'
image: /img/js-conf-budapest-2016.jpg
tags: [JS Conf Budapest,JavaScript,Conference]
category: Conference
comments: true
---

## From JS Conf Budapest with love

This year's edition of JS Conf Budapest was hosted at [Akvárium Klub](http://akvariumklub.hu/).
Located right in the center of the city, below an actual pool, filled with water!

> Akvárium Klub is more than a simple bar: it is a culture center with a wide musical repertoire from mainstream to underground.
> There is always a good concert and a smashing exhibition, performance, or other event happening here, in a friendly scene, situated right in the city center.

JS Conf Budapest is hosted by the one and only [Jake Archibald](https://twitter.com/jaffathecake) from Google.
After waiting in line at 8 o'clock in the morning to get our badges, we were welcomed at the main hall where some companies hosted stands.

In another space after the main hall, tables were nicely dressed and people could have breakfast.
When going downstairs to the right of the main hall, we entered the room where the talks would be given.

For the coffee lovers, professional baristas served the best coffee possible.
With a nice heart drawn on top if it.

<img class="image fit" src="{{ '/img/js-conf-budapest/js-conf-budapest-2016-collage.jpg' | prepend: site.baseurl }}" alt="JS Conf Budapest 2016 Photo Collage" />

At 9 o'clock the conference would officially start so we went downstairs.
After taking our seat, we played the waiting game and all of a sudden, we got this nice intro made with blender and three.js! Check it out for yourself!

<div style="position: relative; width: 100%; height: 0; padding-bottom: 55%;">
<iframe src="http://usefulthink.com/jsconf.bp-intro/" width="100%" height="100%;" style="position: absolute; left: 0; top: 0; bottom: 0; right: 0;"></iframe>
</div>

****

## Day 1: Talks

* [Laurie Voss: What everybody should know about npm](#laurie-voss-what-everybody-should-know-about-npm)
* [Safia Abdalla: The Hitchhiker's Guide to All Things Memory in Javascript](#safia-abdalla-the-hitchhikers-guide-to-all-things-memory-in-javascript)
* [Yan Zhu: Encrypt the web for $0](#yan-zhu-encrypt-the-web-for-0)
* [Denys Mishunov: Why performance matters](#denys-mishunov-why-performance-matters)
* [Princiya Sequeira: Natural user interfaces using JavaScript](#princiya-sequeira-natural-user-interfaces-using-javascript)
* [Maurice de Beijer: Event-sourcing your React-Redux applications](#maurice-de-beijer-event-sourcing-your-react-redux-applications)
* [Rachel Watson: The Internet of Cats](#rachel-watson-the-internet-of-cats)
* [Nick Hehr: The other side of empathy](#nick-hehr-the-other-side-of-empathy)

****

## Day 1: Morning

<span class="image left"><img class="p-image" alt="Suz Hinton" src="/img/js-conf-budapest/speaker-seldo.jpg"></span>

### Laurie Voss: What everybody should know about npm

Laurie is CTO at npm Inc.

You can find him on Twitter using the handle [@seldo](https://twitter.com/seldo).

The presentation he gave can be found a [slides.com/seldo/jsconf-budapest](http://slides.com/seldo/jsconf-budapest).

<blockquote class="clear"><p>
npm is six years old, but 80% of npm users turned up in the last year.
That's a lot of new people! Because of that, a lot of older, core features aren't known about by the majority of npm users.
This talk is about how npm expects you to use npm, and the commands and workflows that can make you into a power user.
There will be lots of stuff for beginners, and definitely some tricks that even most pros don't know.
</p></blockquote>

#### How does npm look up packages?
In contrast to what most people think, npm does not download its modules from GitHub or other version control systems.
They would not like it that such an amount of data is transferred on a daily basis.

In short npm does this: You -> CLI -> Registry.
Let's dive in.

1. First, npm will take a look at your local cache and see if the package your are looking for is present.
2. Next, it will resort to the CDN network and use the server which is the closest as possible to your position.
3. Finally, if npm can't find the package in local cache or the CDN network, it will look it up in the registry. The registry is a set of servers all around the world and it will try to match the best version that you are looking for.

#### EACCESS error
A lot of people have issues with EACCESS errors because they used sudo to install things.
The easy solution is to always keep on using sudo, BUT we can [easily fix npm permission issues](https://docs.npmjs.com/getting-started/fixing-npm-permissions).

#### package.json
Don't write your `package.json` yourself. Let NPM do it!
It will always do it better. Use `npm init`, which will ask you some basic questions and generate `package.json` for you.

#### Scopes
A new feature in npm is scopes.
These are modules that are "scoped" under an organization name that begins with `@`.
Scopes can be public and private.
Here is how to use scopes:

{% highlight sh %}
npm init --scope=username
npm install @myusername/mypackage
require('@myusername/mypackage')
{% endhighlight %}

#### npm-init.js
To extend the `npm init` command, it is possible to create an `npm-init.js` file.
This file is a module that will be loaded by the `npm init` command and will provide basic configurations for the setup.
By default the file is placed in the root of your project: `~/.npm-init.js`.
You can use [PromZard](https://github.com/npm/promzard) to ask questions to the user and perform logic based on the answers.
Remember that `npm init` can always be re-run.

#### Why add stuff in devDependencies.
Simple: because production will install faster! A lot of people don't tend to do this, so please do this!
When using this you can simple run the command below on production and be done with it.

{% highlight sh %}
npm install --production
{% endhighlight %}

#### Bundled dependencies
One of the biggest problems right now with Node.js is how fast it is changing.
This means that production systems can be very fragile and an `npm update` can easily break things.
Using `bundledDependencies` is a way to get round this issue by ensuring that you will always deliver the correct dependencies no matter what else may change.
You can also use this to bundle up your own, private bundles and deliver them with the install.

{% highlight sh %}
npm install --save --save-bundle
{% endhighlight %}

#### Offline installs
A way to prevent npm to look up the registry, and ensure local installs, is by adding the variable `--cache-min` and to set it to a high value such as 999999.

{% highlight sh %}
npm install --cache-min 999999
{% endhighlight %}

#### Run scripts
In `package.json` it is possible to define default run scripts as shown below.

{% highlight sh %}
npm start
npm stop
npm restart
npm test
{% endhighlight %}

Of course it is also possible to define your own run scripts.
You can run these scripts like this:

{% highlight sh %}
npm run <anything>
{% endhighlight %}

#### Run scripts get devDependencies in path
Don't force users to install global tools. That is just not cool.
This way you can prevent to get conflicts over global tools, because different projects can use different versions.

#### SemVer for packages
npm uses Semantic Versioning, which is a standard a lot of projects use to communicate what kind of changes are in a release.
It's important to communicate what kinds of changes are in a release because sometimes those changes will break the code that depends on the package.
Let's take a look at an example.

{% highlight sh %}
1.5.6
Breaking Major . Feature Minor . Fix Patch
{% endhighlight %}

This is quite obvious, right?

npm allows you to change the version (and to add a comment) by using the commands below.

{% highlight sh %}
npm version minor
npm version major
npm version patch
npm version major -m "Bump to version %s"
{% endhighlight %}

#### Microservices architecture
When working with a microservices architecture, it is possible to work with multiple packages for your services.
This can be done by using the link function within npm.

{% highlight sh %}
npm link <dependency>
{% endhighlight %}

Let's say we have a package named Alice and we have other packages that depend on this package.
We can run `npm link`.
In packages that depend on Alice, say Bob, we simply run `npm link alice`.
All changes made in Alice will be immediately available in Bob without performing any `npm update` commands.

#### Unpublish a package
Before the [recent events](http://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm) where a package called left-pad got pulled from npm and broke the internet, it was possible to unpublish a package just like that by using `npm unpublish`.
Now this is restricted after the package has been online for 24 hours.
To really unpublish the package you will need to contact support.

A more friendly way is the use of `npm deprecated` that will tell users the package has been deprecated.

#### Keeping projects up to date
Before running `npm update`, it's preferred to run `npm outdated`.
This command will check the registry to see if any (specific) installed packages are currently outdated.

{% highlight sh %}
npm outdated
npm update
{% endhighlight %}

By doing so, you can prevent yourself from breaking the project if certain packages would not be compatible.

#### Stuff everybody should know about npm
A lot of things are available for npm that will make your life as a developer easier.

* Babel: Transpile all the things! JavaScript, TypeScript, JSX, ...
* Webpack and Browserify
* Greenkeeper (greenkeeper.io) is `npm outdated` as a service!
* Node Security Project: Install by using `npm install nsp -g`. Use by running `nsp check`. You can use this to check if your project contains vulnerable modules.

#### Why should I use npm?
npm reduces friction.
It takes things you have to do all the time and makes things simpler and faster.


****


<span class="image left"><img class="p-image" alt="Safia Abdalla" src="/img/js-conf-budapest/speaker-captainsafia.jpg"></span>

### Safia Abdalla: The Hitchhiker's Guide to All Things Memory in Javascript

Safia is a lover of data science and open source software.

You can find her on Twitter using the handle [@captainsafia](https://twitter.com/captainsafia) or on her webpage [safia.rocks](http://safia.rocks/).

#### Slides and interactive tutorial
The slides of this talk can be found here [http://slides.com/captainsafia/memory-in-javascript](http://slides.com/captainsafia/memory-in-javascript).
Safia also created an [interactive tutorial](https://nbdev.surge.sh/#/gist/21885286a207c05bf1194a35490420c1) on how to use the Chrome DevTools for memory management.

<blockquote class="clear"><p>
This talk will take beginners through an exploration of Javascript's garbage collector and memory allocation implementations and their implications on how performant code should be written.
Attendees will leave this talk having gained insights into the under-the-hood operations of Javascript and how they can leverage them to produce performant code.
</p></blockquote>

#### Why should I care about memory?

1. It forces us to be (better) more inventive programmers, adds restrictions and forces us to use the best tools to create the best possible experience.
2. Memory is scarce. A lot of people still use devices that are not packed with a lot of memory.
Not everyone has high performant development machines.
3. It helps us exercise our empathy muscles.

#### What does it mean to manage memory?

The Good, The Bad, The Ugly

#### How does JS manage memory?
Safia focuses on the V8 JS Engine.

We have basic types in JavaScript:

* booleans
* numbers
* strings

Memory is allocated in a heap structure and uses a root node which has references to other ones: booleans, string, etc.
So basically: root node -> references -> variables.

V8 allocates objects in memory in 6 contiguous chunks, or spaces:

* New space: Memory gets allocated here when an object is created immediately.
It is small and is designed to be garbage collected very quickly, independent of other spaces.
* Old pointer space: Contains most objects which may have pointers to other objects.
Most objects are moved here after surviving in new space for a while.
* Old data space: Objects that just contain raw data (no reference or pointer) will end up here after surviving in new space for a while.
* Large object space: Used to store large object tables.
They get stored here so it doesn't conflict with the store space of the above mentioned spaces.
* Code space: Code objects are allocated here. This is the only space with executable memory.
* Map space: Contains objects which are all the same size and has some constraints on what kind of objects they point to, which simplifies collection.

**How does V8 collect garbage memory?**

V8 uses a 'stop the world' technique that enables it to run a short garbage collection cycle.
This means it will literally halt the program.

V8 has different approaches on how it collects garbage in the new and old space.

* New space: Garbage collection by using a scavenging technique.
Each scavenging cycle will go through the entire heap starting from the root and will create copies.
It will clear out what is currently in new space.
Everything that is not reachable will be cleared out of the space.
You need double the size of the memory that is available for the new space to use for the copy.
* Old space: Mark and sweep technique.
Remove unmarked objects on a regular basis.

#### How do I write memory performant applications?
Asking yourself the following two question will get you started!

* How much memory is my application using?
* How often do garbage collection cycles occur in my application?

Of course you need to have the tools to work with.
The Chrome DevTools HEAP allocation profiler will be our weapon of choice.
It allows you to check the retain size and shallow size of objects.

* Shallow size of an object is the amount of memory it holds of itself.
* Retain size is all of its size and its dependents.

#### Heap dump
Heap dump takes a snapshot of your heap at a specific moment.
It will provide a file with .heap extension which enables you to load it in the Chrome DevTools for further inspection.

`npm install heapdump`

#### Let's practice!

Follow this [interactive tutorial](https://nbdev.surge.sh/#/gist/21885286a207c05bf1194a35490420c1) on how to use the Chrome DevTools for memory management.


****


<span class="image left"><img class="p-image" alt="Suz Hinton" src="/img/js-conf-budapest/speaker-bcrypt.jpg"></span>

### Yan Zhu: Encrypt the web for $0

Yan is engineer [@brave](https://twitter.com/brave) and likes information freedom, breaking shit, cryptography, theoretical physics, free software, infosec, stunt h4cking, and an Internet that respects humans.

You can find her on Twitter using the handle [@bcrypt](https://twitter.com/bcrypt).

<blockquote class="clear"><p>
Everyone in 2016 knows that websites should use HTTPS.
However, there is a common misconception that TLS and other security measures are expensive and slow down both web developers and page load times.
This talk will show you some easy tricks to make your site more secure without sacrificing performance or requiring a lot of effort.
</p></blockquote>

**Is the web fast yet?**

Yes. Size of pages is rising. Amount of HTTPS requests is also rising!

**Is TLS fast yet?**

Yes. Netflix is going to secure streams this year over HTTPS.

* 2015: Netflix and chill
* 2016: Netflix and HTTPS and chill

<img src="/img/js-conf-budapest/HttpsAdoptionNetflix.png">

The numbers aren't entirely clear, so here they are:

- Without encrypted Netflix streams, 65% of internet traffic is unencrypted. Only 29% of internet traffic is encrypted.
- With encrypted Netflix streams, unencrypted internet traffic will drop to 26,9% and encrypted traffic will increase to 67,1%.

Source: [https://www.sandvine.com/downloads/general/global-internet-phenomena/2015/encrypted-internet-traffic.pdf](https://www.sandvine.com/downloads/general/global-internet-phenomena/2015/encrypted-internet-traffic.pdf)

> TLS has exactly one performance problem: it is not used widely enough.
> Everything else can be optimized.

> Data delivered over an unencrypted channel is insecure, untrustworthy, and trivially intercepted.
> We owe it to our users to protect the security, privacy, and integrity of their data — all data must be encrypted while in flight and at rest.
> Historically, concerns over performance have been the common excuse to avoid these obligations, but today that is a false dichotomy. Let's dispel some myths.

Keep reading about this matter on [istlsfastyet.com](https://istlsfastyet.com).

**HTTP/2**

Another technology that can help the adoption of TLS is HTTP/2.
HTTP/2 offers:

- Binary encoding instead of text encoding
- header compression
- Server push
- **multiple requests on single TCP connection!!**

HTTP/2 allows for requests to be sent in parallel rather than sequentially.

Does HTTP/2 require encryption? No. However, Chrome and Firefox will only support HTTP/2 with encryption.

#### Let's Encrypt

Let's Encrypt (a non-profit certificate authority) has left beta stage on the 12th of April and is a new Certificate Authority: It's **free**, **automated**, and **open**.

It is backed by some major sponsors such as Mozilla, Akamai, Cisco Chrome, and so much more.

> The objective of Let’s Encrypt and the ACME protocol is to make it possible to set up an HTTPS server and have it automatically obtain a browser-trusted certificate, without any human intervention.
> This is accomplished by running a certificate management agent on the web server.

Interested in Let's Encrypt? Keep reading on [letsencrypt.org](https://letsencrypt.org).

#### Get HTTPS for free!

Manually setting up your free HTTPS certificates from Let's Encrypt is also an option. You can do that on [gethttpsforfree.com](https://gethttpsforfree.com).


****


<span class="image left"><img class="p-image" alt="Suz Hinton" src="/img/js-conf-budapest/speaker-mishunov.jpg"></span>

### Denys Mishunov: Why performance matters

Denys is frontend developer, speaker. Science aficionado. And writes for [@smashingmag](https://www.smashingmagazine.com/).

You can find him on Twitter using the handle [@mishunov](https://twitter.com/mishunov) or on his personal website [mishunov.me](http://mishunov.me).

<blockquote class="clear"><p>
Performance is not about Mathematics.
Performance is about Perception.
Perception is what makes a site with very few requests nevertheless feel slow, while a site that delivers search results during tens of seconds can feel fast enough for your user.
User’s perception of your website’s speed is the only true performance measure.

This talk is about perception, neuroscience and psychology. The time is ripe to understand performance from the user’s perspective.
</p></blockquote>

In this talk Denys showed us that performance is not always in the numbers, but that it is most of the time perception.

So next time you decide to invest a bunch of money in getting that request 100ms faster, make sure it will have impact!

> Performance is about perception! Not mathematics.

Houston Airport was used as an example to illustrate this quote.
At Houston Airport, there were a lot of complaints about long waiting times at the baggage claim.
They decided to optimize the baggage handling process.
They managed to get luggage to the baggage claim in about 8 minutes (which is nice!).
However, complaints weren't dropping at all.

It turned out that passengers needed only 1 minute to get from the plane to the baggage claim, which meant they needed to wait 7 minutes for their luggage.
Eventually they decided to literally taxi and park the airplanes further so passengers now needed to walk 6 minutes from the plane to the baggage claim which reduced waiting times for luggage to 2 minutes.
This caused complaints to drastically reduce!

#### Speed!

1 second gain will increase revenue by 1% for Company X. 1 second slower will decrease conversions by approximately 5%.

**The 20% rule.**

This rule defines that you should make a page load at least 20% faster, otherwise users will not notice.

We're talking about noticeable difference.
A big difference with meaningful difference.

**Noticeable !== Meaningful**

We did a live test on the conference where the crowd needed to decide which of the two pages displayed loaded faster.
The first page loaded in 1.6 seconds whereas the second one loaded in 2 seconds.
Most of the people thought the second page, with 2 seconds load time was faster. This is all about perception!

Another fun fact is when delaying audio on a video, our mind will trick us by syncing the audio with what is visible on the screen. Again perception!

**Key takeaway**

Don't spend to much time optimizing the nitty gritty details of your code, instead try moving the active phase forward.
As soon as there is activity being shown (pages being loaded), the brain enters the active phase.
The user no longer feels as if he's waiting (Remember the perception?).

You can move the active phase forward by making use of:

- async
- Service workers

> "The perception of performance is just as effective as actual performance in many cases" - [Apple quote](https://developer.apple.com/library/watchos/documentation/Performance/Conceptual/PerformanceOverview/BasicTips/BasicTips.html)

****


## Day 1 afternoon

<span class="image left"><img class="p-image" alt="Suz Hinton" src="/img/js-conf-budapest/speaker-princi_ya.jpg"></span>

### Princiya Sequeira: Natural user interfaces using JavaScript

Princiya works at Zalando Tech where she uses React and Redux. She's also a startup enthusiast, teacher, speaker, DataViz Diva and has a love for food and JavaScript

You can find her on Twitter using the handle [@princi_ya](https://twitter.com/princi_ya) and Zalando Tech using the handle [@ZalandoTech](https://twitter.com/ZalandoTech).

<blockquote class="clear"><p>
The way we interacted with computers on a large scale was stuck in place for roughly 20 years.
From mouse to keyboard to joystick, it is game over.
Today it is the era of gestures.
Today’s gamers can do everything from slice and dice produce in Fruit Ninja to quest for a dragon in Skyrim.
We’ve been captivated by these powerful, natural, and intuitive interactions; imagining what it would be like to have that power at our own fingertips.

In this recent decade, we’ve seen some staggering advances in technologies bring us closer making these magical experiences a reality.
In this talk I will present how we can create new, intuitive, interactions for these novel input devices using JavaScript.
</p></blockquote>

This talk takes on a different approach in user interaction, in way that different ways of input can result in the same output.

At this moment we know the evolution of **Typed, Clicked and Touched** but currently we are evolving to **Typed, Clicked, Touched, Guestures/Speech/...** etc.

#### Evolution of user interfaces.

* CLI: Codified, Strict
* GUI: Metaphor, Exploratory
* NUI (Natural User Interfaces): Direct Intuitive. More natural and more intuitive.

#### NUI + JS = NUIJS

At first, Princiya was trying to build [a simulator for motion controlled 3D camera's](https://github.com/nuijs/simulator).
A tool that is not dependent on any platform without using a physical device.
The simulator is purely based on JavaScript and easily integrates with the device's SDKs.

Once the simulator was made, she tried to build some apps with it (using leap motion for example) to move a slideshow or any other purpose.

The tool can be used for many purposes an a lot of devices are already available (VR, motion, ...)

* Augmented Reality.
* Virtual Reality.
* Perceptual Computing: bringing human like behaviour to devices

#### What next?

**Architecture**

* Step 1: USB controller reads sensor data
* Step 2: Data is stored in local memory
* Step 3: Data is streamed via USB to SDK

**Live demo**

Princiya demonstrated a [drawing board with a brush](https://github.com/nuijs/apps), both with mousepointer and LEAP motion.
NUIJS will translate the input data from the mouse pointer to the Node.js Web Socket server and this one will process the data and send it back to the LEAP motion SDK.
The same code can be used with the LEAP motion itself since it integrates nicely with the device's SDKs.

Other open source tools Princiya mentioned were [Webcam Swiper](https://github.com/iambrandonn/WebcamSwiper) and [js-objectdetect](https://github.com/mtschirs/js-objectdetect).

**Viola-Jones Algorithm**

Most of the tools will use or depend on the Voila-Jones Algorithm which can be used for object detection.
Combined with other tools this can be very powerful.

* HAAR feature selection
* Creating an integral image
* Adaboost training
* Cascading classifiers


****


<span class="image left"><img class="p-image" alt="Suz Hinton" src="/img/js-conf-budapest/speaker-mauricedb.jpg"></span>

### Maurice de Beijer: Event-sourcing your React-Redux applications

Maurice is a freelance developer/trainer and Microsoft Azure MVP.

You can find him on Twitter using the handle [@mauricedb](https://twitter.com/mauricedb).

<blockquote class="clear"><p>
With Event-Sourcing every action leading up to the current state is stored as a separate domain event.
This collection of domain events is then used as the write model in the CQRS model.
These same events are projected out to a secondary database to build the read model for the application.
In this session Maurice de Beijer will explain why you might want to use Event-Sourcing and how to get started with this design in your React and Flux applications.
</p></blockquote>

**What is Event-sourcing**

Event-sourcing is a way of capturing changes in the state of an application.
The traditional way of doing this would be to just update the existing state of your application to whatever state it should be in.
This way you always have the latest state of your data at your disposal.

In Event-sourcing, you'll capture all changes as events.
These events will be stored in the sequence they were applied.
You now have a complete log of events that happened in your application.
This allows for features such as:

- Complete Rebuild: Possibility to rebuild the entire application state by re-running all events.
- Temporal Query: Determining the state of the application at a given point in time.
- Event Replay: Replay incorrect events by reversing it and all subsequent events, then replaying the correct event and re-applying all later events.

Common example of systems that use Event Sourcing are Version Control Systems.

**When to use Event-sourcing?**

Event-Sourcing is particularly useful in situations where you need to keep an audit trail of all changes that occurred to your data.
Accountancy for example is a domain in which Event-Sourcing is very useful, because you need to be able to provide that trail for audit purposes.
**REPHRASE! -> The immutability of events allows for more scalability in your apps also.**

**CQRS and Event Sourcing**

Where Event-Sourcing describes the practice of storing all application state changes in individual events, CQRS describes the practice of separating the command from the read side.

This means you'll have a service exposing all write functionality in your application and a separate service exposing all read operations.

This model works well with Event-Sourcing as you can use the Events occurring on your system as Commands in the CQRS model.

<img class="image fit" src="/img/js-conf-budapest/Event-sourcing.png" alt="CQRS-and-event-sourcing">

During the talk, Maurice showed some samples of code that were the pieces of the puzzle in setting up Event-Sourcing and CQRS in your React-Redux application.

Check out the slides for his talk [here](http://www.slideshare.net/mauricedb/eventsourcing-your-reactredux-applications) to find out more!

****


<span class="image left"><img class="p-image" alt="Suz Hinton" src="/img/js-conf-budapest/speaker-ohhoe.jpg"></span>

### Rachel White: The Internet of Cats

Rachel is a front end developer at IBMWatson. A lover of retro graphics & horror & coding & games, but above all, of Cats.

You can find her on Twitter using the handle [@ohhoe](https://twitter.com/ohhoe).

Find out more about her and her projects on [rachelisaweso.me](rachelisaweso.me) and [imcool.online](imcool.online)

<blockquote class="clear"><p>
Ever lose out on a good night's rest because your pesky cats keep waking you up at 4am for food?
Rachel has.
Many times.
For her first project using node, socket.io, microcontrollers, and johnny-five, Rachel built a web-based feeder that delivers tasty cat chow on a configurable schedule or when triggered remotely.
She'll walk you through her learning process and get you excited about trying new things in your own projects.
Finally, she'll show you how to take the first steps to release your work to the open source community.
</p></blockquote>


One thing is for sure, Rachel really, really, really likes cats!

Where a lot of people try to create things that improve others peoples lives, Rachel tries to do the same, instead, she does this for cats...

One Question is constantly on her mind:

> "How can we incorporate cats in technology?"

Eventually, she decided to create a feeder bot for her cats and immediately thought of open sourcing "the thing".
The talk was mainly a tour of what she's learned and encountered along the way.

**Trying new things is scary**

Rachel wasn't exactly familiar with robotics or backend development, so she would be entering a whole new world.
She'd have to try out new things and start a project without any idea of whether all of this would actually work out.

* Embarking on a new project: will it succeed, will it suck?
* Using new technologies for the first time: what will happen, will it work for me?
* Contributing to Open Source: putting yourself out there is terrifying!

**Why so scary?**

Why is this so scary? It turns out the Open Source developer community can sometimes be quite a harsh environment...

* Fear of rejection
* Imposter Syndrome
* Inclusiveness of Communities
* Bad behaviour in General: e.g. Oh you didn't know about THIS?, e.g. completely ignoring contributions
* Your GitHub **green** timeline is not a representation of what you're worth. Just opening a PR just for the sake of it sucks.
* Don't insult the contributor. Why on earth ...
* Vulgar and brutal harassment of the community, seriously, get a life!
* PR's that get ignored (for over a year) and then the maintainer writes the same fixes and says: Oops!

Eventually, Rachel set up a Twitter poll asking people about what bad experiences in Open Source Software development they'd already encountered, showing off an entire list of Twitter responses. Which weren't that positive (euphemism!)

One of her Twitter contacts actually created (and open sourced) a tool called echochamber.js, which allows you to include a commenting form in your site that stores the comments only in the local storage.
That way, you can be an a**hole and post really offensive comments without actually insulting people.

[**Echochamber.js**](https://github.com/tessalt/echo-chamber-js)

**Proposals for new contributors**

Knowing all of these things now, you might wonder if it's even worth it putting yourself out there.
The answer of course is YES, but consider the following tips when doing so!

* Find something you are passionate about
* Something new you want to try
* Make something cool and open source it yourself
* First point of contact is your peers
* Constructive criticism!

**Building a cat feeder bot**

Now, let's talk about the actual Cat Feeder bot, which was most suitably named RoboKitty. Check it out at [here](https://github.com/rachelnicole/robokitty)! and [here](http://imcool.online/robokitty/)

<img class="image fit" src="/img/js-conf-budapest/RoboKitty-Catfeeder.jpg">

It's a node based cat feeder that works over the web.
You can use it to instantly feed your cat, or you can feed periodically using cron triggers.

After some trial and error on choosing the right combination of hardware, the final list of technologies involved in creating the Cat Feeder Bot looks something like this:

* Node.js
* [Johnny-five](http://johnny-five.io/): Javascript Robotics & IoT platform.
* Particle Photon kit (with breadboard)
* 4xAA battery pack with on/off switch
* Misc hardware accessories

Other things learned along the way were:

- A servo needs external power, so yeah, plugging it in the microcontroller is not enough! :D
- No idea how to solder...? Worked out! -> Youtube -> Learn how to solder.

**Lessons learned**

* Don't be afraid of the unfamiliar
* Don't be afraid to ask for help
* People really like cat stuff
* Don't downplay your abilities: I mean, it's a super cool kitty food dispenser!
* I like nodebots a lot

****

<span class="image left"><img class="p-image" alt="Suz Hinton" src="/img/js-conf-budapest/speaker-hipsterbrown.jpg"></span>

### Nick Hehr: The other side of empathy

Nick is an Empathetic Community Member, Front-End Dev @NamelyHR ,@hoodiehq Contributor, @tesselproject Contributor and @manhattan_js Organizer

You can find him on Twitter using the handle [@HipsterBrown](https://twitter.com/HipsterBrown).

<blockquote class="clear"><p>
In an industry that is so focused frameworks & tooling, we tend to lose sight of the people behind the products and how we work with them.
I’ve found empathy to be a powerful resource while collaborating with teams inside companies and across the open source community.
By breaking down The Other Side of Empathy, I will demonstrate how applying its principles to your development process will benefit the community and the products they create.
</p></blockquote>

#### Empathy

Nick Hehr shares Rachels' point of view on the sometimes rude Open Source communication and communication on Social media in general.
In his talk, he addressed the way you should behave when volunteering to contribute or when giving feedback to contributors in Open Source Software (OSS) projects.
And Empathy turns out to be key in this process.

#### Ranting

It's all too easy to judge or express prejudice these days, through these social media channels and not think about the people who are actually behind the idea or concept you're judging.
People that decide to Open Source the work on which they've spend tons of effort (usually because it's their passion, but still...) aren't exactly waiting for trolls or rants from people who like this easy judging.

Empathy also plays a huge role in the other way around.
It happens all too often that people trying to contribute to OSS for the first time are being ignored (by literally ignoring their pull requests for example), being treated like idiots (instead of being given constructive feedback when there is room for improvement), etc...

#### Saying nice things

>"If you don't have anything nice* to say, don't say anything at all!"

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
	- They're not here to start fulfilling all requests from a demanding user base. It's open source, submit a pull request

Living by these rules will make the (web-)world a little bit of a better place, but won't prevent other people from still continuing these bad habits.
Don't let these people get to you! Continue doing what you're passionate about and seek those that will give you that constructive feedback.

****


### Afterparty with Beatman and Ludmilla

After a long day, it was time for some party time and since JS Conf Budapest was hosted at a club, this could only be good!

We were presented a live set by Breakspoll 2015 winner Beatman and Ludmilla.

<iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/246816288&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>


****


## Day 1: Conclusion

Day 1 was packed full of great speakers and the atmosphere was superb! A lot of inspiring talks that gave us a lot of topics to cover for the months to come within the JWorks unit at Ordina Belgium.

The after party with Beatman and Ludmilla was a perfect closing of the day. On our walk to the hotel we could only imagine what day 2 would bring.

[Read our full report on day 2 of JS Conf Budapest here!](/conference/2016/05/13/JS-Conf-Budapest-day-2.html).
