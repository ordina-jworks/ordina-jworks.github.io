---
layout: post
authors: [jan_de_wilde, steve_de_zitter]
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
After waiting in line at 8 o'clock in the morning to get our badges we were welcomed at the main hall where some companies hosted stands.

In another space after the main hall tables were nicely dressed and people could have breakfast.
When going downstairs to the right of the main hall we entered the room where the talks would be given.

For the coffee lovers, professional baristas served the best coffee possible. With a nice heart drawn on top if it.

![JS Conf Budapest 2016 Photo Collage]({{ '/img/js-conf-budapest/js-conf-budapest-2016-collage.jpg' | prepend: site.baseurl }}) 

At 9 o'clock the conference would officially start so went downstairs.
After taking our seat we played the waiting game and all of a sudden, we got this nice intro made with blender and three.js! Check it out for yourself!

<div style="position: relative; width: 100%; height: 0; padding-bottom: 55%;">
<iframe src="http://usefulthink.com/jsconf.bp-intro/" width="100%" height="100%;" style="position: absolute; left: 0; top: 0; bottom: 0; right: 0;"></iframe>
</div>

****


## Day 2: Talks

* [Suz Hinton: The Formulartic Spectrum](#suz-hinton-the-formulartic-spectrum)
* [Oliver Joseph Ash: Building an Offline Page for theguardian.com](#oliver-joseph-ash-building-an-offline-page-for-theguardiancom)
* [Nicolás Bevacqua: High Performance in the Critical Rendering Path](#nicolas-bevacqua-high-performance-in-the-critical-rendering-path)
* [Anand Vemuri : Offensive and Defensive Strategies for Client-Side JavaScript](#anand-vemuri--offensive-and-defensive-strategies-for-client-side-javascript)
* [Sam Bellen : Changing live audio with the web-audio-api](#sam-bellen--changing-live-audio-with-the-web-audio-api)
* [Rob Kerr : Science in the Browser: Orchestrating and Visualising Neural Simulations](#rob-kerr--science-in-the-browser-orchestrating-and-visualising-neural-simulations)
* [Stefan Baumgartner : HTTP/2 is coming! Unbundle all the things?!?](#stefan-baumgartner--http2-is-coming-unbundle-all-the-things)
* [Claudia Hernández : Down the Rabbit Hole: JS in Wonderland](#claudia-hernandez--down-the-rabbit-hole-js-in-wonderland)
* [Lena Reinhard : Works On My Machine, or the Problem is between Keyboard and Chair](#lena-reinhard--works-on-my-machine-or-the-problem-is-between-keyboard-and-chair)


****


## Day 2: Morning

<img class="p-image float-image" width="200" alt="Suz Hinton" src="/img/js-conf-budapest/speaker-noopkat.jpg">

### Suz Hinton: The Formulartic Spectrum

Suz is front-developer at Kickstarter. Member of the NodeJS hardware working group. Member of the Ember-A11y Project team.

You can find her on Twitter using the handle [@noopkat](https://twitter.com/noopkat).

<blockquote class="clear"><p>
The physical world is just another binary machine.
Data creation, analysis, and corruption combined with JavaScript can make new and unexpected things.
Can you programmatically extract joy from the subjectivity it exists in?
Can it be translated into intentional forms to hook others in?
This session will gently take you along on a personal journey of how you can use code to expose new expressions of the mundane secrets we hold dear.
</p></blockquote>

#### Data and art

#### Making a mess

<blockquote class="twitter-tweet" data-lang="nl"><p lang="en" dir="ltr">Subway Synth by <a href="https://twitter.com/noopkat">@noopkat</a> at <a href="https://twitter.com/hashtag/jsconfbp?src=hash">#jsconfbp</a>. Inspired by the New York City subway sounds. <a href="https://t.co/Ldj8qSizft">pic.twitter.com/Ldj8qSizft</a></p>&mdash; Nick Hehr (@hipsterbrown) <a href="https://twitter.com/hipsterbrown/status/732196920245030912">16 mei 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

****

<img class="p-image float-image" width="200" alt="Oliver Joseph Ash" src="/img/js-conf-budapest/speaker-oliverjash.jpg">

### Oliver Joseph Ash: Building an Offline Page for theguardian.com

Oliver is ....

You can find him on Twitter using the handle [@OliverJAsh](https://twitter.com/OliverJAsh). 

<blockquote class="clear"><p>
You’re on a train to work and you open up the Guardian app on your phone.
A tunnel surrounds you, but the app still works in very much the same way as it usually would—despite your lack of internet connection, you still get the full experience, only the content shown will be stale.
If you tried the same for the Guardian website, however, it wouldn’t load at all.
Native apps have long had the tools to deal with these situations, in order to deliver rich user experiences whatever the user’s situation may be.
With service workers, the web is catching up.
This talk will explain how Oliver used service workers to build an offline page for theguardian.com.
</p></blockquote>

#### Web vs native

Native
- content is cached
- experience:
-- offline: stale content remains
-- server down: stale content remains
-- poor connection: stale while revalidate
-- good connection: stale while revalidate

website
- experience
-- offline: nothing
-- server down: nothing
-- poor connection: white screen of death
-- good connection: new content

#### How it works

**Service workers**
- Prototype built in < 1 day

**What are service workers**
- script that runs in the backgrond
- useful for features that don't need user interaction
-- listen to push events, useful for pushing notification
-- intercept and handle network requets
-- future
--- background sync
--- alarms
--- geofencing
- a progressive enhancement
- trusted origins only (https only!, localhost)
- Chrome, Opera and Firefox stable

The guardian is not on https, but they are switching.
Some pages have service workers already enabled /info /science /technology.

--- When offline on the guardian you'll get a crossword puzzle (always the most recent) how did they do it?

1. Create and register the service worker

2. Something i missed :(

Chrome DevTools: about:debug#workers

Service worker has
* install event
* cache the assets needed later
* version off the cache (to check if a user has an old version so you can update with newer versions)

3. Handle requests

* fetch events
-- default: just fetch
-- override default
-- intercept network requests to:
--- fetch from the network
--- something
--- something else

**Service worker: custom responses**
use templating to enable custom json response

**(Im)mutable**
Mutable (HTML)
Immutable (assets: CSS, JS)

**HTML**
Network first, then cache
Page -> service worker -> server or cache -> Page

4. Updating the crossword

Check if the cache has been updated and if it's not up to date, update it and delete old cache.

**offline-first**

* instantly respond with a "shell" of the page straight from cache
* improves the experience


**Why**

* FUn
* insignificant usage due to https/browser support
** ... plant the seed and see what happens
* flatten out browser bugs

**Conclusion**

* allow us to progressively enchance the experience for: offline users, ...
* something
* something

****


<img class="p-image float-image" width="200" alt="Nicolás Bevacqua" src="/img/js-conf-budapest/speaker-nzgb.jpg">

### Nicolás Bevacqua: High Performance in the Critical Rendering Path

Nicolás is ...

You can find him on Twitter using the handle [@nzgb](https://twitter.com/nzgb).

<blockquote class="clear"><p>
This talk covers the past, present and future of web application performance when it comes to delivery optimization.
I'll start by glancing over what you're already doing -- minifying your static assets, bundling them together, and using progressive enhancement techniques.
Then I'll move on to what you should be doing -- optimizing TCP network delivery, inlining critical CSS, deferring font loading and CSS so that you don't block the rendering path, and of course deferring JavaScript.
Afterwards we'll look at the future, and what HTTP 2.0 has in store for us, going full circle and letting us forego hacks of the past like bundling and minification.
</p></blockquote>

Ponyfoo.com

#### Getting started

Measure what is going and and see what is going on!
DevTools Audits.
- per resource advice
- caching hints

PageSpeed Insights (Google)
- mobile
- desktop
Get a rough 1-100 score.
Best practices
Practical advice

WebPageTest (webpagetest.org)
- Gives analytics and metrics where you can act on
- A lot of statistics (see site, include image)
- Waterfall View: figure out how to parallelize your download to speed up loading

Automate!
- Measure early and measure often
npm install psi -g

- A little bit slower (for webpagetest) but also option
npm install webpagetest-api underscore-cli

- Yslow
npm install grunt-yslow --save-dev

Budgets!
- Inforce a performance budget.
- Track impact of every commit
- What should I track?
timkadlec.com/2014/11/performance-budget-metrics


****


<img class="p-image float-image" width="200" alt="Anand Vemuri" src="/img/js-conf-budapest/speaker-brownhat57.jpg">

### Anand Vemuri : Offensive and Defensive Strategies for Client-Side JavaScript

Anand is Senior Application Security Consultant at nVisium

You can find him on Twitter using the handle [@brownhat57](https://twitter.com/brownhat57).

<blockquote class="clear"><p>
This talk will specifically focus on the other less common client-side vulnerabilities that are not as frequently discussed.
Intentionally vulnerable applications developed with client-side JavaScript frameworks will be attacked and exploited live.
Remediation strategies will also be discussed so that developers have tools to prevent these vulnerabilities.
Through strengthening the security posture of JavaScript applications, we can take strides towards creating a more secure Internet.
</p></blockquote>

#### Break the web together!

> They say the best offense is good defense.
> The best offense is offense. 

#### XSS

* attacks users
* JS Injection
* Exploits can be bad, really bad

Open source vulnerable nodejs application "medcellar".

Burp Suite (captures requests before sending them to the application).
Burp Suite is an integrated platform for performing security testing of web applications.
https://portswigger.net/burp/

XSS is a serious vulnerability. It may not seem so for some people or clients but it really is!

* How do we exploit apps where users have direct control 
* How do we attack web apps on a private network

**CSRF Attacks!!**

* "Session Riding"
* Attacker sends malicious URL to submit a form to a third party domain
* Victim is tricked into interacting with the malicious link and performs undesirable actions

Using a third party domain you can create a form (you won 1 million dollars) to perform an action like this.

**BeEF**
Browser exploitation framework for more advanced stuff.
Like submitting false data through a JSON request to a service. Or a regular HTML form request.

Kali Linux.

"When you enter a coffee shop and see someone using this, disconnect from the internet and run away as fast as you possibly can." - Quote from Anand


****


## Day 2: afternoon

<img class="p-image float-image" width="200" alt="Sam Bellen" src="/img/js-conf-budapest/speaker-sambego.jpg">

### Sam Bellen : Changing live audio with the web-audio-api

Sam is ... developer at Made with love.

You can find him on Twitter using the handle [@sambego](https://twitter.com/sambego).

<blockquote class="clear"><p>
As a guitar player, I usually use some effect-pedals to change the sound of my guitar.
I started wondering: “What if, it would be possible to recreate these pedals using the web-audio-api?”.
Well, it turns out, it is entirely possible to do so.
This talk takes you through the basics of the web-audio-api and explains some of the audio-nodes I’ve used to change the live sound of my guitar.
</p></blockquote>

Presentation can be found here: https://github.com/Sambego/pedalboard-presentation

#### Get the sound in the browser

* Create new audio context.
* Get the audio input of your computer: navigator.getUserMedia()
* Create inputNode from the media stream we just fetched
* COnnect the inputnode to the audiocontext.destination

#### Add effects to the sound

**Volume pedal**

* Create a gainNode = audioContext.createGain();
* Value of gain is 0 tot 1
* So for now we have input -> gain -> output.

**Distortion pedal**

* Make the audio sound rough.
* Create a waveShaperNode = audioContext.createWaveShaper();
* Set a value
* So for now we have input -> Waveshaper -> output.

**Delay pedal**

* delayNode = audioContext.createDelay();
* Set a value delayNode.delayTime.value = 1 (1 second)

**Reverb pedal**

* Some kind of echo on your sound
* convolverNode = audioContext.createConvolver()
* Load impulse-response-file and do some crazy stuff

**How to create an oscilator**

* oscilatorNode = audioContext.createOscilator()
* Set Hz value

**web-midi-api**

* Request access and start doing things with it


****


<img class="p-image float-image" width="200" alt="Rob Kerr" src="/img/js-conf-budapest/speaker-robrkerr.jpg">

### Rob Kerr : Science in the Browser: Orchestrating and Visualising Neural Simulations

Rob works at IBM Research Australia.

You can find him on Twitter using the handle [@robrkerr](https://twitter.com/robrkerr).

<blockquote class="clear"><p>
My talk will show how the old-school, computationally-heavy software used in science can be set free using the centralized power of cloud resources and the ubiquity of the browser.
We'll see real-time, publicly-broadcast, simulations of the electrical activity in brain cells, visualised in 3D using Javascript.
</p></blockquote>

#### Science in the browser

A neuron is just a text file that describes the different branches of it.
We have an ID, X, Y, Z, Radius and parent data.

| --- | --- | --- | --- | --- |
| ID | X | Y | Z | R | Parent |
 
He wanted to learn Three.JS and created a visualisation tool.
Software that enables "sharable science" by creating tools that can be shared with the world.
It is much more easy to create a webapp nowadays and so replace the nativa applications.

The tool enables researchers to play a scenario where a certain spike is triggered in a branch of the neuron. 
That gives a lot of knowledge about how neurons behave.


****


<img class="p-image float-image" width="200" alt="Stefan Baumgartner" src="/img/js-conf-budapest/speaker-ddprrt.jpg">

### Stefan Baumgartner : HTTP/2 is coming! Unbundle all the things?!?

Stefan is ...

You can find him on Twitter using the handle [@ddprrt](https://twitter.com/ddprrt).

<blockquote class="clear"><p>
In this session, we will explore the major features of the new HTTP version and its implications for todays JavaScript developers.
We will critically analyze recommendations for deployment strategies and find out which impact they have on our current applications, as well as on the applications to come.
</p></blockquote>

#### Unbundle all the things?

Everybody is saying to not bundle things, minify things, concatenate things, ... when moving to HTTP/2.
Tools like Browserify, Webpack, etc. would all become obsolete.
But why? We need to question this and see if this is actually the truth.

But first: The best request is a request not being made.

In HTTP version 1.1 we need to do as few requests possible. 
Pages like Giphy have 40 TCP connection at a single time!

HTTP/2 was made to prevent the bad parts of HTTP/1.1
HTTP/2 allows a connection to stay open and transfer multiple things over the same connection.
No need for handshakes for each file that needs to be transferred from the server to the client.

Rule of thumb: a slow website on HTTP1.1 will still be a slow website on HTTP/2.
You need to perform optimisations no matter what.

Most important part: DO NOT BLOCK THE RENDER PATH.

Only serve what you really made.
Again, the best request is a request not being made.

So in some way, yes unbundle all the things. Because you don't want to transfer bytes you don't need.
But there is something more to it.

Article about packaging: engineering.khanacademy.org/posts/js-packaging-http2.htm
Good article to read!

Create a lot of modules to update as flexible as possible and as small as possible.
When using ES6 we can also use Treeshaking.
* Create independent, excheangable components
* Create small, detachable bundles
* Think about long lastig applications and frequently of change

Use tools not rules!


****


<img class="p-image float-image" width="200" alt="Claudia Hernández" src="/img/js-conf-budapest/speaker-koste4.jpg">

### Claudia Hernández : Down the Rabbit Hole: JS in Wonderland

Claudia is Mexican front-end developer.

You can find her on Twitter using the handle [@koste4](https://twitter.com/koste4).

<blockquote class="clear"><p>
This talk is a collection of Javascript’s oddities and unexpected behaviors that hopefully will prevent some future headaches and help understand the language that we all love in a more deeper and meaningful way.
</p></blockquote>

http://www.jsfuck.com/

https://github.com/fasttime/jquery-screwed


#### Some title


****


<img class="p-image float-image" width="200" alt="Lena Reinhard" src="/img/js-conf-budapest/speaker-lrnrd.jpg">

### Lena Reinhard : Works On My Machine, or the Problem is between Keyboard and Chair

Lena is teamleader, consultant and photographer.

You can find her on Twitter using the handle [@lrnrd](https://twitter.com/lrnrd).

<blockquote class="clear"><p>
In this talk we will look at the many facets that affect our decision making and interactions, and work out how we can change for the better.
Together, we will take a look at the effects that our software has on the daily lives of the thousands of people who are using it.
You’ll learn what you can do as an individual to support change into a positive direction, and how you can help debug this system and make a difference in the tech industry.
You’ll leave knowing about practical things you can do in your daily life to make the tech industry a better, more inclusive and diverse environment that is a better place for everyone.
</p></blockquote>

**Code debugging**
Debugging can be hard and it becomes harder when working with complex software.

Spaghetti code is difficult to read and maintain. It can be code that is not organised, has lot's of dependencies and is difficult to debug.

**The Tech Industry is bugged**
A lot of people contributed to the tech industry. It has grown very fast and has many flaws.
That's why we need to have a look at it and try to fix the defects.

**Understanding ourselves**
To be able to fix this we need to understand ourselves. Our flaws, limitations, ...

> We are privileged and need to understand that

Privilege: The human version of "works on my machine".

Privilege is sitting in your comfy home and not knowing a big thunderstorm is coming that could harm people.
Privilige is being able to stand up when attending a standup and not having to sit because you are disabled.

**We are biased**
We need to understand we are biased. More often we are being objective and often that is not OK.
We all have biases and we need to realise and understand.

**Empathy**
We need to understand that we need to be empathetic. Empathy is the right direction.

**Creativity**
Creativity is necessary to design and build good software.

**Divirsity**
And so is divirsity and understanding each other.

**Inclusion**
Inclusion means all people in the group are respected for who they are.
The lack of inclusion and diversity is a real problem in our industry.

#### Company

* Lack of divirsity
* lack of inclusion
* Harassmant

#### Society

* Racism
* Patriarchy
* Capitalism

#### Tech industry

All of the above (under company and society).

#### Software can help people

Our software can help people. A screenreader, accessability, ...

#### But can also ruin lives

Our software is racist. Our software (tools like Siri or Cortana) does not correctly recognise skin color and does not recognise harassment or racism.
Animations in software can trigger panic attacks or eppileptic attacks. 

> We have a collective responsibility and need to take that very seriously.
> Technology and our code is not neutral. Our work is political and has consequences on lives.

**Debugging the system**

1. **Educate yourself**, about systemic issues and oppresion
2. **Practice empathy**, because we need it to be good designers and developers
3. **Work on Humility**, because none of us are Unicorns
4. **Understanding Priviliges**, and use them for good
5. **Address biases**, and establish policies to address them
6. **Listen**, and actively look for voices outside of your networks
7. **Amplify others' voices**, and speak less
8. **Work on diversity**, because it's our moral obligation
9. **Work on inclusion**, to make spaces welcoming and safe
10. **Give**, our knowledge, time, technical skills, money
11. **Work on being allies**, constantly


****


## Day 2: Conclusion

Something ...

### Find us on the family photo!

![JS Conf Budapest 2016 Family Photo]({{ '/img/js-conf-budapest/js-conf-budapest-2016-family-photo.jpg' | prepend: site.baseurl }})

### Next year

In 2017, JS Conf Budapest will be held on the 14th and 15th of September.

We will sure be present for what will be another great edition! See you next year!