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

## Day 2: Talks

* [Suz Hinton: The Formulartic Spectrum](#suz-hinton-the-formulartic-spectrum)
* [Oliver Joseph Ash: Building an Offline Page for theguardian.com](#oliver-joseph-ash-building-an-offline-page-for-theguardiancom)
* [Nicolás Bevacqua: High Performance in the Critical Rendering Path](#nicolas-bevacqua-high-performance-in-the-critical-rendering-path)
* [Anand Vemuri : Offensive and Defensive Strategies for Client-Side JavaScript](#anand-vemuri--offensive-and-defensive-strategies-for-client-side-javascript)
* [Sam Bellen : Changing live audio with the web-audio-api](#sam-bellen--changing-live-audio-with-the-web-audio-api)
* [Rob Kerr : Science in the Browser: Orchestrating and Visualising Neural Simulations](#rob-kerr--science-in-the-browser-orchestrating-and-visualising-neural-simulations)
* [Claudia Hernández : Down the Rabbit Hole: JS in Wonderland](#claudia-hernandez--down-the-rabbit-hole-js-in-wonderland)
* [Stefan Baumgartner : HTTP/2 is coming! Unbundle all the things?!?](#stefan-baumgartner--http2-is-coming-unbundle-all-the-things)
* [Lena Reinhard : Works On My Machine, or the Problem is between Keyboard and Chair](#lena-reinhard--works-on-my-machine-or-the-problem-is-between-keyboard-and-chair)

## Day 2: Morning

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


### Nicolás Bevacqua: High Performance in the Critical Rendering Path

Nicolás is ...

You can find him on Twitter using the handle [@nzgb](https://twitter.com/nzgb).

> This talk covers the past, present and future of web application performance when it comes to delivery optimization.
> I'll start by glancing over what you're already doing -- minifying your static assets, bundling them together, and using progressive enhancement techniques.
> Then I'll move on to what you should be doing -- optimizing TCP network delivery, inlining critical CSS, deferring font loading and CSS so that you don't block the rendering path, and of course deferring JavaScript.
> Afterwards we'll look at the future, and what HTTP 2.0 has in store for us, going full circle and letting us forego hacks of the past like bundling and minification.

#### Some title


****


### Anand Vemuri : Offensive and Defensive Strategies for Client-Side JavaScript

Anand is ...

You can find him on Twitter using the handle [@brownhat57](https://twitter.com/brownhat57).

> This talk will specifically focus on the other less common client-side vulnerabilities that are not as frequently discussed.
> Intentionally vulnerable applications developed with client-side JavaScript frameworks will be attacked and exploited live.
> Remediation strategies will also be discussed so that developers have tools to prevent these vulnerabilities.
> Through strengthening the security posture of JavaScript applications, we can take strides towards creating a more secure Internet.

#### Some title


****


## Day 2: afternoon

### Sam Bellen : Changing live audio with the web-audio-api

Sam is ...

You can find him on Twitter using the handle [@sambego](https://twitter.com/sambego).

> As a guitar player, I usually use some effect-pedals to change the sound of my guitar.
> I started wondering: “What if, it would be possible to recreate these pedals using the web-audio-api?”.
> Well, it turns out, it is entirely possible to do so.
> This talk takes you through the basics of the web-audio-api and explains some of the audio-nodes I’ve used to change the live sound of my guitar.

#### Some title


****


### Rob Kerr : Science in the Browser: Orchestrating and Visualising Neural Simulations

Rob is ...

You can find him on Twitter using the handle [@robrkerr](https://twitter.com/robrkerr).

> My talk will show how the old-school, computationally-heavy software used in science can be set free using the centralized power of cloud resources and the ubiquity of the browser.
> We'll see real-time, publicly-broadcast, simulations of the electrical activity in brain cells, visualised in 3D using Javascript.

#### Some title


****


### Claudia Hernández : Down the Rabbit Hole: JS in Wonderland

Claudia is ...

You can find her on Twitter using the handle [@koste4](https://twitter.com/koste4).

> This talk is a collection of Javascript’s oddities and unexpected behaviors that hopefully will prevent some future headaches and help understand the language that we all love in a more deeper and meaningful way.


#### Some title



****


### Stefan Baumgartner : HTTP/2 is coming! Unbundle all the things?!?

Stefan is ...

You can find him on Twitter using the handle [@ddprrt](https://twitter.com/ddprrt).

> In this session, we will explore the major features of the new HTTP version and its implications for todays JavaScript developers.
> We will critically analyze recommendations for deployment strategies and find out which impact they have on our current applications, as well as on the applications to come.

#### Some title


****


### Lena Reinhard : Works On My Machine, or the Problem is between Keyboard and Chair

Lena is ...

You can find her on Twitter using the handle [@lrnrd](https://twitter.com/lrnrd).

> In this talk we will look at the many facets that affect our decision making and interactions, and work out how we can change for the better.
> Together, we will take a look at the effects that our software has on the daily lives of the thousands of people who are using it.
> You’ll learn what you can do as an individual to support change into a positive direction, and how you can help debug this system and make a difference in the tech industry.
> You’ll leave knowing about practical things you can do in your daily life to make the tech industry a better, more inclusive and diverse environment that is a better place for everyone.

#### Some title


****


## Conclusion

As you can see it is fairly simple - just 4 steps - to add TypeScript support to your Ionic project by changing the default gulp setup used by Ionic.
It's nice to know that Ionic 2 will have support for TypeScript built in so you won't have to do it yourself.
By adding a flag `--ts` to your Ionic 2 project setup it will be enabled.

Personally I love using TypeScript and will use it whenever I can.
It makes my life as a developer a lot easier by spotting errors before I even hit the browser.

What are your thoughts about TypeScript? Feel free to add them in the comments section.
