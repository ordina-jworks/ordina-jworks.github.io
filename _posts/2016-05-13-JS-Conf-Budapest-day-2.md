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
Day 2 started at 9 o'clock.
Enought time to drink great coffee and enjoy the breakfast.

![JS Conf Budapest 2016 Photo Collage]({{ '/img/js-conf-budapest/js-conf-budapest-2016-collage.jpg' | prepend: site.baseurl }}) 


****


## Day 2: Talks

* [Suz Hinton: The Formulartic Spectrum](#suz-hinton-the-formulartic-spectrum)
* [Oliver Joseph Ash: Building an Offline Page for theguardian.com](#oliver-joseph-ash-building-an-offline-page-for-theguardiancom)
* [Nicolás Bevacqua: High Performance in the Critical Rendering Path](#nicolas-bevacqua-high-performance-in-the-critical-rendering-path)
* [Anand Vemuri: Offensive and Defensive Strategies for Client-Side JavaScript](#anand-vemuri-offensive-and-defensive-strategies-for-client-side-javascript)
* [Sam Bellen: Changing live audio with the web-audio-api](#sam-bellen-changing-live-audio-with-the-web-audio-api)
* [Rob Kerr: Science in the Browser: Orchestrating and Visualising Neural Simulations](#rob-kerr-science-in-the-browser-orchestrating-and-visualising-neural-simulations)
* [Stefan Baumgartner: HTTP/2 is coming! Unbundle all the things?!?](#stefan-baumgartner-http2-is-coming-unbundle-all-the-things)
* [Claudia Hernández: Down the Rabbit Hole: JS in Wonderland](#claudia-hernandez-down-the-rabbit-hole-js-in-wonderland)
* [Lena Reinhard: Works On My Machine, or the Problem is between Keyboard and Chair](#lena-reinhard-works-on-my-machine-or-the-problem-is-between-keyboard-and-chair)


****


## Day 2: Morning

<img class="p-image float-image" width="200" alt="Suz Hinton" src="/img/js-conf-budapest/speaker-noopkat.jpg">

### Suz Hinton: The Formulartic Spectrum

Suz is front-developer at Kickstarter. Member of the NodeJS hardware working group. Member of the Ember-A11y Project team.

You can find her on Twitter using the handle [@noopkat](https://twitter.com/noopkat) and blogs on [meow.noopkat.com]().

<blockquote class="clear"><p>
The physical world is just another binary machine.
Data creation, analysis, and corruption combined with JavaScript can make new and unexpected things.
Can you programmatically extract joy from the subjectivity it exists in?
Can it be translated into intentional forms to hook others in?
This session will gently take you along on a personal journey of how you can use code to expose new expressions of the mundane secrets we hold dear.
</p></blockquote>

**Why are we here**

* Data & Art
* Make a mess

**Feelings**

Warning, a lot of feelings

#### Personal history

**1994**

* Commodore 64 graphics book
* Wants to make art on computer
* The littlest artist
* Accidental programmer (Suz didn't really want to become a programmer)
* Semicolon wars;; It doesn't matter how you place your semicolon!

This story is inspired by the movie **Contact by Carl Sagan** and makes Suz wonder: what does sound look like?

#### Formulartic spectrum (made up word: art)
	
* Analysing PCM data (Pulse Code Modulation -> raw uncompressed data)
* Resulted in only 13-ish lines of code

{% highlight javascript %}
audioContext.decodeAudioData(audioData)
    .then(function(decoded) {

    // just get the left ear, it's fine ;)
    let data = decoded.getChannelData(0);

    for (let i = 0; i < data.length; i += 1) {

        // convert raw sample to within 0-255 range
        let hue = Math.ceil((data[i] + 1) * 255 / 2);

        // convert HSL to an RGB array
        let rgb = hslToRgb(hue, 200, 150);

        // create the pixel
        imgData.data[i*4] = rgb[0];
        imgData.data[i*4+1] = rgb[1];
        imgData.data[i*4+2] = rgb[2];
        imgData.data[i*4+3] = rgb[3];
    }

    // put the pixels on a canvas element
    canvas.putImageData(imgData, 0, 0);
});
{% endhighlight %}

Suz talked about programming and art.
She spent a lot of time on the subway and was wondering if it would be possible to use the sounds of the subway to create art.
So she started by taking [the sound of the subway doors closing](http://noopkat.github.io/formulartic-spectrum/#slide-41) and analysing that part.

* Sampling the audio to pixels resulted in 300k pixels
* Make it smaller by converting to 16-beat song

[Check out the visualisation!](http://noopkat.github.io/iltsw/index2.html)

* The top section: Stand clear of the closing doors, please.
* The mid section: white noise
* The bottom section: ding dong!

Suz created a visualisation of the sampled audio that resulted in cats sitting on an subway.

* Cat's can sit on 16 seats in subway car, each seat representing a beat
* In total there were 308.728 samples which divided by 16 beats result in 19.295 samples per beat. Suz took to the average of the sample values of each 'beat'  
* The seats have different colors that represent the drum beat and oscillator note
* When a cat is sitting on a chair we get a guitar strum and note

The subway example is made using:

* SVG images
* divs
* CSS animations

[Check out the working example!](http://noopkat.github.io/iltsw/index5.html)

#### But I'm better at hardware

So Suz created a [subway card with built in speaker](https://noopkat.github.io/formulartic-spectrum/#slide-64)!

### Recap

* Creative coding gets you out of your comfort zone and teaches you to use tools you use everyday in another context
* Art doesn't care about your semicolons
	* Code can be messy
	* no-one cares about semicolons etc
* Art doesn't care about perfection
	* Again, your code doens't really matter

**Art is about what you learned**

* Write messy code
* Make lots of mistakes
* You deserve a break from being judged
* code like no one's watching
* don't 'git rebase -i'
	* Show the history behind good code
	* Code evolves from a first idea to a final solution.
	* At first, code might not be perfect
	* Don't rebase to hide this fact

[View the slides of Suz's talk here!](https://noopkat.github.io/formulartic-spectrum)

****


<img class="p-image float-image" width="200" alt="Oliver Joseph Ash" src="/img/js-conf-budapest/speaker-oliverjash.jpg">

### Oliver Joseph Ash: Building an Offline Page for theguardian.com

Oliver is a software engineer working on the team behind theguardian.com.
Being passionate about the open web, he aims to work on software that exploits the decentralised nature of the web to solve non-trivial, critical problems.
With a strong background in arts as well as engineering, he approaches web development in its entirety: UX, performance, and functional programming are some of the things he enjoys most.

You can find him on Twitter using the handle [@OliverJAsh](https://twitter.com/OliverJAsh). 

<blockquote class="clear"><p>
You’re on a train to work and you open up the Guardian app on your phone.
A tunnel surrounds you, but the app still works in very much the same way as it usually would—despite your lack of internet connection, you still get the full experience, only the content shown will be stale.
If you tried the same for the Guardian website, however, it wouldn’t load at all.
Native apps have long had the tools to deal with these situations, in order to deliver rich user experiences whatever the user’s situation may be.
With service workers, the web is catching up.
This talk will explain how Oliver used service workers to build an offline page for theguardian.com.
</p></blockquote>

Oliver talked about the functionality they created with service workers on The Guardian.
When offline on The Guardian you'll get a crossword puzzle (always the most recent) that you can play.
We summarized the key parts of the talk for you.

#### Website vs native

**Native**

* Content is cached
* Experience:
    * offline: stale content remains
    * server down: stale content remains
    * poor connection: stale while revalidate
    * good connection: stale while revalidate

**Website**

* Experience
    * offline: nothing
    * server down: nothing
    * poor connection: white screen of death
    * good connection: new content

#### How it works

**Service workers**

* Prototype built in < 1 day

**What is a service worker?**

* A script that runs in the backgrond
* Useful for features that don't need user interaction, e.g.:
    * Listen to push events, useful for pushing notification
    * Intercept and handle network requets
    * Future
        * Background sync
        * Alarms (e.g. reminders)
        * Geofencing
* A progressive enhancement
* Trusted origins only (HTTPS only or localhost)
* Chrome, Opera and Firefox stable

For now The Guardian is not yet fully on HTTPS, but they are switching at this time of writing.

Some pages have service workers already enabled such as:

* [theguardian.com/info](https://www.theguardian.com/info)
* [theguardian.com/science](https://www.theguardian.com/science)
* [theguardian.com/technology](https://www.theguardian.com/technology)
* [theguardian.com/business](https://www.theguardian.com/business)

#### How did they do it?

**1. Create and register the service worker**

{% highlight javascript %}
<script>
if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/service-worker.js');
}
</script>
{% endhighlight %}

You can debug service workers in Chrome by selecting Service Workers under the Resources tab.

**2. Prime the cache**

* install event: get ready!
* Cache the assets needed later
* Version the cache. To check if a user has an old version so you can update with newer versions

{% highlight javascript %}
<script>
var version = 1;
var staticCacheName = 'static' + version;

var updateCache = function () {
    return caches.open(staticCacheName)
        .then(function (cache) {
            return cache.addAll([
                '/offline-page',
                '/assets/css/main.css',
                '/assets/js/main.js'
            ]);
        });
};

self.addEventListener('install', function (event) {
    event.waitUntil(updateCache());
});
</script>
{% endhighlight %}

**3. Handle requests with fetch**

* fetch events
    * Default: just fetch
    * Override default
    * Intercept network requests to:
        * Fetch from the network
        * Read from the cache
        * Construct your own response

{% highlight javascript %}
<script>
self.addEventListener('fetch', function (event) {
    event.respondWith(fetch(event.request));
});
</script>
{% endhighlight %}

It is possible to use custom responses when using Service Workers. E.g. Use templating to construct a HTML respose from JSON.

{% highlight javascript %}
<script>
self.addEventListener('fetch', function (event) {
    var responseBody = '<h1>Hello, world!</h1>';
    var responseOptions = {
        headers: {
            'Content-Type': 'text/html'
        }
    };
    var response = new Response(
        responseBody,
        responseOptions
    );
    event.respondWith(response);
});
</script>
{% endhighlight %}

**(Im)mutable**

* Mutable (HTML)
    * Network first, then cache
    * Page -> service worker -> server or cache -> Page
* Immutable (assets: CSS, JS)
    * Cache first, then network
    * Page -> service worker -> cache or server -> Page

**4. Updating the crossword**

Check if the cache has been updated and if it's not up to date, update it and delete old cache.

{% highlight javascript %}
isCacheUpdated().then(function (isUpdated) {
    if (!isUpdated) {
        updateCache().then(deleteOldCaches);
    }
});
{% endhighlight %}

#### Offline-first

Why should we be building with offline first?

* Instantly respond with a "shell" of the page straight from cache when navigating a website
* It improves the experience for users with poor connections
* No more white screen of death
* Show stale content whilst fetching new content

#### Problems and caveats

* Browser bugs in both Chrome and Firefox
* Interleaving of versions in CDN cache

This can be fixed with a cache manifest.

{% highlight json %}
// /offline-page.json
{
    "html": "<html><!-- v1 --></html>",
    "assets": ["/v1.css"]
}
{% endhighlight %}

#### Why? Is this valuable

* Fun
* Insignificant usage due to HTTPS/browser support
    * ... but plant the seed and see what happens
* Iron out browser bugs, pushes the web forward

> "If we only use features that work in IE8, we're condemning ourselves to live in an IE8 world." — Nolan Lawson

#### Conclusion

* Service workers allow us to progressively enchance the experience for
    * Offline users
    * Users with poor connections
* It's easy to build an offline page
* A simple offline page is a good place to start

[The slides of Oliver's talk can be viewed on Speaker Deck](https://speakerdeck.com/oliverjash/building-an-offline-page-for-theguardian-dot-com-jsconf-budapest-may-2016).


****


<img class="p-image float-image" width="200" alt="Nicolás Bevacqua" src="/img/js-conf-budapest/speaker-nzgb.jpg">

### Nicolás Bevacqua: High Performance in the Critical Rendering Path

Nicolás loves the web. he is a consultant, a conference speaker, the author of JavaScript Application Design, an opinionated blogger, and an open-source evangelist.
He participates actively in the online JavaScript community — as well as offline in beautiful Buenos Aires.

You can find him on Twitter using the handle [@nzgb](https://twitter.com/nzgb) and on the web under the name [ponyfoo.com](https://ponyfoo.com/).

<blockquote class="clear"><p>
This talk covers the past, present and future of web application performance when it comes to delivery optimization.
I'll start by glancing over what you're already doing -- minifying your static assets, bundling them together, and using progressive enhancement techniques.
Then I'll move on to what you should be doing -- optimizing TCP network delivery, inlining critical CSS, deferring font loading and CSS so that you don't block the rendering path, and of course deferring JavaScript.
Afterwards we'll look at the future, and what HTTP 2.0 has in store for us, going full circle and letting us forego hacks of the past like bundling and minification.
</p></blockquote>

#### Getting started

Measure what is going on and see what is going on!

**Use the Chrome DevTools Audits.**

* Per-resource advice
* Caching best practices

**PageSpeed Insights (Google)**

[developers.google.com/speed/pagespeed/insights/](https://developers.google.com/speed/pagespeed/insights/)

* Insights for mobile
* Insights for desktop
* Get a rough 1-100 score
* Best practices
* Practical advice

**WebPageTest (webpagetest.org)**

[webpagetest.org](http://www.webpagetest.org/)

* Gives analytics and metrics where you can act on
* A lot of statistics
* PageSpeed Score
* Waterfall View: figure out how to parallelize your download to speed up loading
* Makes it easy to spot FOIT
* Calculates SpeedIndex: SpeedIndex takes the visual progress of the visible page loading and computes an overall score for how quickly the content painted
* Inspect every request
* Analyze TCP traffic
* Identify bottlenecks
* Visualize progress

#### Automate!

But we can automate a lot!

> Measure early. Measure often.

PageSpeed Insights is availble as npm module.

{% highlight sh %}
npm install psi -g
{% endhighlight %}

Webpagetest is also available as npm module but is a bit slower.

{% highlight sh %}
npm install webpagetest-api underscore-cli
{% endhighlight %}

YSlow is available for different platforms.

{% highlight sh %}
npm install grunt-yslow --save-dev
{% endhighlight %}

#### Budgets

* Enforce a performance budget
* Track impact of every commit
* What should I track? More info about this on [timkadlec.com/2014/11/performance-budget-metrics](https://timkadlec.com/2014/11/performance-budget-metrics)
    * Milestone Timings: Load time, time to interact, "time to first tweet"
    * SpeedIndex: Average time at which parts of a page are displayed
    * Quantity based metrics: Request count, page weight, image weight ...
    * Rule based metrics: YSlow grade, PageSpeed score, etc.

Budgeting can also be automated using the grunt-perfbudget plugin.

{% highlight sh %}
npm install grunt-perfbudget --save-dev
{% endhighlight %}

For a lot more tips and tricks we sugget to [view the slides for Nicolás's talk on ponyfoo.com](https://ponyfoo.com/presentations/high-performance-in-the-critical-path).


****


<img class="p-image float-image" width="200" alt="Anand Vemuri" src="/img/js-conf-budapest/speaker-brownhat57.jpg">

### Anand Vemuri: Offensive and Defensive Strategies for Client-Side JavaScript

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

### Sam Bellen: Changing live audio with the web-audio-api

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

### Rob Kerr: Science in the Browser: Orchestrating and Visualising Neural Simulations

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

### Stefan Baumgartner: HTTP/2 is coming! Unbundle all the things?!?

Stefan is a web developer/web lover based in Linz, Austria.
Currently working at Ruxit, making the web a faster place.
He is also a co-host at the German Workingdraft podcast.

You can find him on Twitter using the handle [@ddprrt](https://twitter.com/ddprrt).

<blockquote class="clear"><p>
In this session, we will explore the major features of the new HTTP version and its implications for todays JavaScript developers.
We will critically analyze recommendations for deployment strategies and find out which impact they have on our current applications, as well as on the applications to come.
</p></blockquote>

#### Unbundle all the things?

Everybody is saying to not bundle things, minify things, concatenate things, ... when moving to HTTP/2.

Tools like Browserify, Webpack, etc. would all become obsolete.
But why? We need to question this and see if this is actually the truth.

#### The best request is a request not being made

In HTTP version 1.1 we need to do as few requests possible. Pages like Giphy have 40 TCP connection at a single time!

HTTP/2 was made to prevent the bad parts of HTTP/1.1

HTTP/2 allows a connection to stay open and transfer multiple things over the same connection.
No need for handshakes for each file that needs to be transferred from the server to the client.

#### Rule of thumb

A slow website on HTTP/1.1 will still be a slow website on HTTP/2.
You need to perform optimisations no matter what.

Most important part: **do not block the render path**.

Only serve what you really need.
Again, **the best request is a request not being made**.

#### So, unbundle all the things?

So in some way, yes unbundle all the things.
Because you don't want to transfer bytes you don't need, but there is something more to it.
This article about packaging will get you on the way: [engineering.khanacademy.org/posts/js-packaging-http2.htm](http://engineering.khanacademy.org/posts/js-packaging-http2.htm).

Create a lot of modules to update as flexible as possible and as small as possible.
When using ES6 we can also use Treeshaking.

* Create independent, excheangable components
* Create small, detachable bundles
* Think about long lastig applications and frequently of change

Use tools not rules!


****


<img class="p-image float-image" width="200" alt="Claudia Hernández" src="/img/js-conf-budapest/speaker-koste4.jpg">

### Claudia Hernández: Down the Rabbit Hole: JS in Wonderland

Claudia is Mexican front-end developer.

You can find her on Twitter using the handle [@koste4](https://twitter.com/koste4).

<blockquote class="clear"><p>
What even makes sense in Javascript?

For a language originally created in 10 days it surely has a lot of quirks and perks many JS developers are unaware of.
Sometimes, it might even seem like we fell down the rabbit hole only to find that NaN is actually a Number, undefined can be defined, +!![] equals 1, Array.sort() may not work as you suspected and so much other nonsense that can trip any JS developer’s mind.

This talk is a collection of Javascript’s oddities and unexpected behaviors that hopefully will prevent some future headaches and help understand the language that we all love in a more deeper and meaningful way.
</p></blockquote>

This talk by Claudia was so much fun! We didn't write down anything because it was virtually impossible to do. You need to see this with your own eyes!

You can view the slides on [Speaker Deck](https://speakerdeck.com/claudiahdz/down-the-rabbit-hole-javascript-in-wonderland).

Be sure to check out [jsfuck.com](http://www.jsfuck.com/) for some fun times and [jQuery Screwed](https://github.com/fasttime/jquery-screwed) to get an idea of what you can actually do with JavaScript quirks.


****


<img class="p-image float-image" width="200" alt="Lena Reinhard" src="/img/js-conf-budapest/speaker-lrnrd.jpg">

### Lena Reinhard: Works On My Machine, or the Problem is between Keyboard and Chair

Lena is teamleader, consultant and photographer.

You can find her on Twitter using the handle [@lrnrd](https://twitter.com/lrnrd).

<blockquote class="clear"><p>
In this talk we will look at the many facets that affect our decision making and interactions, and work out how we can change for the better.
Together, we will take a look at the effects that our software has on the daily lives of the thousands of people who are using it.
You’ll learn what you can do as an individual to support change into a positive direction, and how you can help debug this system and make a difference in the tech industry.
You’ll leave knowing about practical things you can do in your daily life to make the tech industry a better, more inclusive and diverse environment that is a better place for everyone.
</p></blockquote>

#### Code debugging

Debugging can be hard and it becomes harder when working with complex software.

Spaghetti code is difficult to read and maintain.
It can be code that is not organised, has lot's of dependencies and is difficult to debug.

#### The Tech Industry is bugged

A lot of people already contributed to the tech industry.
It has grown very fast and has many flaws.

That's why we need to have a look at it and try to fix the defects.

#### Understanding ourselves

To be able to fix this we need to understand ourselves. Our flaws, limitations, ...

> We are privileged and need to understand that.

**Privilege: The human version of "works on my machine".**

Privilege is sitting in your comfy home and not knowing a big thunderstorm is coming that could harm people.

Privilige is being able to stand up when attending a standup and not having to sit because you are disabled.

#### We are biased

We need to understand we are biased.
More often we are being objective and often that is not OK.

We all have biases and we need to realise and understand.

#### Empathy

We need to understand that we need to be empathetic.
Empathy is the right direction.

#### Creativity

Creativity is necessary to design and build good software.

#### Diversity

And so is diversity and understanding each other.

#### Inclusion

Inclusion means all people in the group are respected for who they are.
The lack of inclusion and diversity is a real problem in our industry.


#### The Tech Industry

Let's look at some key points within our industry.

**Company**

* Lack of diversity
* Lack of inclusion
* Harassmant

**Society**

* Racism
* Patriarchy
* Capitalism

**Tech industry**

* Lack of diversity
* Lack of inclusion
* Harassmant
* Racism
* Patriarchy
* Capitalism

#### Software can help people

Our software can help people. A screenreader, accessibility, ...

#### But can also ruin lives

Our software is racist.
Our software (tools like Siri or Cortana or Snapchat) does not correctly recognise skin color, alters skin color and does not recognise harassment or racism.
Animations in software can trigger panic attacks or eppileptic attacks.

> We have a collective responsibility and need to take that very seriously.
> Technology and our code is not neutral. Our work is political and has consequences on lives.

#### Debugging the system

Change starts with you, starts with all of us.
What can we do to debug the system?

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

Quite a talk on some serious matter to close the second day of JS Conf Budapest.

Have you experienced these things yourself in the tech industry?

Have you contributed to debugging the tech industry?


****


## Day 2: Conclusion

Just like day 1, day 2 was one hell of a nice day packed full of great speakers and a superb atmosphere!

The talks by [Rob Kerr](#rob-kerr-science-in-the-browser-orchestrating-and-visualising-neural-simulations) and the one of [Lena Reinhart](#lena-reinhard-works-on-my-machine-or-the-problem-is-between-keyboard-and-chair) surely got the most attention.
Rob's talk because it was impressive to see what they achieved over a course of 2 years to visualise neurons in the browser.
Lena's talk because we got slammed in the face about how faulty the tech industry is at the moment.

This year's edition was, just like the one we attended last year a very good one!
It is nice to see such a diverse community that cares about technology and people.
This is something we should be very proud of.

A big thank you to the organisers and volunteers to make JS Conf Budapest what it is!

### Find us on the family photo!

![JS Conf Budapest 2016 Family Photo]({{ '/img/js-conf-budapest/js-conf-budapest-2016-family-photo.jpg' | prepend: site.baseurl }})

### Next year

In 2017, JS Conf Budapest will be held on the 14th and 15th of September.

We will sure be present for what will be another great edition! See you next year!

### JS Conf Budapest 2016, day 1

[Read our full report on day 1 of JS Conf Budapest here!](/conference/2016/05/12/JS-Conf-Budapest-day-1.html).