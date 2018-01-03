---
layout: post
authors: [frederic_ghijselinck, orjan_de_smet, stefanie_geldof, martijn_willekens, yannick_vergeylen, dimitri_de_kerf, michael_vervloet]
title: 'JSConf Budapest 2017 Day 1'
image: /img/js-conf-budapest-2017/header.png
tags: [JS Conf Budapest,JavaScript,Conference]
category: Conference
comments: true
---

## From JSConf Budapest with love

This year's edition of JS Conf Budapest returned to the first venue at [Urania National Movie theater](http://www.urania-nf.hu/).

> Uránia Cinema in the middle of the city, near the party-district.
> Designed by Henrik Schmahl in the late 1890's, the interior is characterized by the ornamental motifs of the Venetian Gothic and Moor styles.
> The place is listed as the world's 3rd most beautiful cinema on Bored Panda. 
> Many tech conferences were hosted here recently, such as TEDx and Strech Conference, because of the unique atmosphere.

JS Conf Budapest 2017 is hosted by [Glen Maddern](https://twitter.com/glenmaddern) and [Charlie Gleason](https://twitter.com/superhighfives).
First thing to do when entering the building was getting our badges.
Then we could have breakfast at some standing tables on the first floor.
For the coffee lovers, professional baristas served the best coffee possible. With a nice heart drawn on top if it.
At 9:45 the conference would officially start so we went to the conference room.

****

<img class="image fit" src="{{ '/img/js-conf-budapest-2017/js-conf-budapest-2017-collage.jpg' | prepend: site.baseurl }}" alt="JS Conf Budapest 2017 Photo Collage" />

****

## Day 1: Talks

* [Bodil Stokke: You Have Nothing To Lose But Your Chains](#bodil-stokke-you-have-nothing-to-lose-but-your-chains)
* [Stefan Judis: Watch your back, Browser! You're being observed](#stefan-judis-watch-your-back-browser-youre-being-observed)
* [Jonathan Martin: Async patterns to scale your multicore JavaScript... elegantly](#jonathan-martin-async-patterns-to-scale-your-multicore-javascript-elegantly)
* [Madeleine Neumann: Impostor syndrome - am I suffering enough to talk about it?](#madeleine-neumann-impostor-syndrome---am-i-suffering-enough-to-talk-about-it)
* [Eirik Vullum: JavaScript Metaprogramming - ES6 Proxy Use and Abuse](#eirik-vullum-javascript-metaprogramming---es6-proxy-use-and-abuse)
* [Sandrina Pereira: How can Javascript improve your CSS mixins](#sandrina-pereira-how-can-javascript-improve-your-css-mixins)
* [Kacper Sokołowski: You use Content Security Policy, don't you?](#kacper-sokołowski-you-use-content-security-policy-dont-you)
* [Dan Callahan: Practical WebAssembly](#dan-callahan-practical-webassembly)
* [Luke Bonaccorsi: How I ended up automating my curtains and shouting at my laptop](#luke-bonaccorsi-how-i-ended-up-automating-my-curtains-and-shouting-at-my-laptop)

****

## Day 1: Morning

<span class="image left"><img class="p-image" alt="Bodil Stokke" src="/img/js-conf-budapest-2017/speaker-bodil.jpg"></span>

### Bodil Stokke: You Have Nothing To Lose But Your Chains

You can find her on Twitter using the handle [@bodil](https://twitter.com/bodil).

The presentation she gave can be found at her [personal website](https://bodil.lol/join-us-now/).

<blockquote class="clear"><p>
A talk about the open source movement and the Free Software movement it grew out of
</p></blockquote>

The talk started with a story about Richard and a Xerox printer. Richard is a developer suffering from a minor
usability flaw in the Xerox printer at his office. Like the good developer he is, he wants to fix the issue and share
it with the world for everybody's benefit. Therefore, he needs access to the code. However, it turns out that Xerox' 
code for that particular printer is not publicly available. So, Richard can't fix the issue. He will have to live 
with the inconvenience, as well as everyone at the office and even everyone using that same printer. The clue here is 
that a minor fix has to wait until someone at Xerox finds the time to solve the issue. Considering the minor status of 
the issue, it's not even likely to happen... ever. With open source software this fix could be done by a motivated user 
in a few moments. 

This little intro sets the mood for the talk. One can consider it a bit opinionated, but there are with no doubt some 
powerful arguments for open source software. The talk also covers the free software movement that all started it and 
from which the open source movement branched of. The difference though is just in its philosophy. First of all, a common
misunderstanding is that free software does not mean one can get it with zero cost. It says that anyone can get the code 
and is free to do with it as pleased. Modify, change, sell or use it for another purpose. On the other hand, open source 
software provides some restrictions. Therefore, open source software is more popular and used more widely, because it 
gives control. 

For example: a concurring company might purchase your proprietary software and then have access to the code. They could 
copy your product and sell it for a lower price. This can be done with Free software, but open source software has some 
licenses defined to prevent this. In the talk some of these licenses are covered. I took the liberty to list some of them here with a 
short explanation. Click trough to see how easily it is to use them and have a legal basis to rely on.

The most popular and widely used licenses are:
#### [Apache License 2.0](https://opensource.org/licenses/Apache-2.0)
Designed to be simple and easy to comply with, but more extensive than the previous versions. One can use the licensed 
software for any purpose, to change and redistribute. Changes can be distributed under other licenses, but unchanged 
code needs to be distributed under the same license.

#### [3-clause BSD license](https://opensource.org/licenses/BSD-3-Clause)
Designed to be simple and short. It allows unlimited redistribution for any purpose as long as its copyright notices 
and the license's disclaimers of warranty are maintained. The license also contains a clause restricting use of the 
names of contributors for endorsement of a derived work without specific permission. In the 2-clause version that 
restriction is left out.

#### [GNU General Public License](https://opensource.org/licenses/GPL-3.0)
Software under GNU GPL is free (as in: do with it as you please). The main restrictions defined by this license are that
you should always mention the authors of the software and it must always stay under the GNU GPL license.

#### [MIT License](https://opensource.org/licenses/MIT)
Created by Massachusetts Institute of Technology. It has one simple rule: the copyright statement should stay in any
copy of the software. 'Copyright (c) &lt;year&gt; &lt;copyright holders&gt;'

#### [Mozilla Public License 2.0](https://opensource.org/licenses/MPL-2.0)
Code under MPL can be copied or changed, but must stay under MPL. The code can be combined with closed source files.

Open source should be considered by many companies, since many can benefit from open source. SpaceX for example benefits 
from open source software, non the less their own code is closed. Another company by the same founder, Elon Musk, has 
its code publicly available: Tesla, the electric car manufacturer. Here's a part I found on 
 [Tesla's own blog](https://www.tesla.com/blog/all-our-patent-are-belong-you).
 
 <blockquote class="clear"><p>
 At Tesla we felt compelled to create patents out of concern that the big car companies would copy our technology and 
 then use their massive manufacturing, sales and marketing power to overwhelm Tesla. We couldn’t have been more wrong. 
 The unfortunate reality is the opposite: electric car programs (or programs for any vehicle that doesn’t burn 
 hydrocarbons) at the major manufacturers are small to non-existent, constituting an average of far less than 1% of 
 their total vehicle sales.
 </p></blockquote>
 
While the competition might benefit from sharing your code, so does the world. This counts for Tesla in particular. 
While there might be a huge market for electric vehicles, we also need them as fast a possible. Open source software 
can help us achieve that goal.

****

<span class="image left"><img class="p-image" alt="Stefan Judis" src="/img/js-conf-budapest-2017/speaker-stefan.jpg"></span>

### Stefan Judis: Watch your back, Browser! You're being observed

You can find Stefan on Twitter using the handle [@stefanjudis](https://twitter.com/stefanjudis).

The presentation can be found on [speakerdeck](https://speakerdeck.com/stefanjudis/watch-your-back-browser-youre-being-observed).

<blockquote class="clear"><p>
To get information from a browser, you always had to do a pull. However, it's now also possible to ask the browser to push this information to you when something has changed by using observables!
</p></blockquote>

Verifying whether an element has become visible in the viewport is a very common use case. 
If you have to pull that information from the browser, it's also a very heavy one since the piece of code doing that verification, is run each time a scroll event is fired. 
A better way would be to have the browser letting us know when an element has reached the viewport. 
Therefore, browsers offer a so called `IntersectionObserver` through JavaScript. 
When creating an `IntersectionObserver` you can pass it a callback function which will be fired when the observed elements enter or leave the viewport. 
Optionally you can also pass some options such as how much of the element should become visible/hidden in the viewport.
Unfortunately Safari doesn't support this feature yet, but luckily, it's polyfillable.

There are several more observers such as:
- `MutationObserver` - fires when an attribute of an observed element has changed (supported by all major browsers)
- `ResizeObserver` - fires when an element is resized (behind a flag in Chrome, not yet supported in other major browsers)
- `PerformanceObserver` - emits metrics about the performance of the web page (e.g. time to paint, `mark` statements, navigation time...) (supported by all major browsers except Edge)

Another great benefit of these observers is that all functions RxJS offers us (e.g. `skip`, `pairwise`, `filter` ...), can be used as well!
The emitted values of the observers are collections so we can use functions such as `map`, `filter` and `reduce` there as well.
As mentioned in the presentation, these two combined gives us "Collection super powers!".

****

<span class="image left"><img class="p-image" alt="Jonathan Martin" src="/img/js-conf-budapest-2017/speaker-jonathan.jpg"></span>

### Jonathan Martin: Async patterns to scale your multicore JavaScript... elegantly

You can find Jonathan on Twitter using the handle [@nybblr](https://twitter.com/nybblr).

The presentation can be found on [speakerdeck](https://speakerdeck.com/nybblr/async-patterns-to-scale-your-multicore-javascript-dot-dot-dot-elegantly).

<blockquote class="clear"><p>
“JavaScript is single-threaded, so it doesn’t scale. JavaScript is a toy language because it doesn’t support multithreading.”
Outside (and inside) the web community, statements like these are common.

In a way, it’s true: JavaScript’s event loop means your program does one thing at a time.
This intentional design decision shields us from an entire class of multithreading woes,
but it has also birthed the misconception that JavaScript can’t handle concurrency.

In fact, JavaScript’s design is well-suited for solving a plethora of concurrency problems
without succumbing to the “gotchas” of other multithreaded languages. You might say that JavaScript is single-threaded…
just so it can be multithreaded!
</p></blockquote>


Before diving into solving concurrency problems, Jonathan explained how the (V8) JavaScript runtime actually works and reacts under the hood.
Next, he told us how the call stack, event loop WebAPIs and the callback queue works and how it handles synchronous (blocking) and asynchronous (non-blocking) code.
Explaining that would be an entire blog post on its own. Luckily he gave us a great link to a video that explains it very clearly, so I'll add that instead.

<div class="responsive-video">
<iframe src="https://player.vimeo.com/video/96425312" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>
<p><a href="https://vimeo.com/96425312" target="_blank">Philip Roberts: Help, I&#039;m stuck in an event-loop.</a></p>


#### What is concurrency, multi threading and parallelism
So if you've just watched the video above, you know that JavaScript has one call stack (a single thread) and executes the functions in sequence.
With multithreading, as the word says, we have multiple threads.
This means that the program can assign these tasks to multiple stacks so that multiple tasks get executed at the same time.


In a computer with a single processor and single core, to do multi threading,
the processor would alternate between these tasks really fast so that they appear to be happening at the same time.
Back in the early days of computing, this was the only option we had. This is called <b>concurrency</b>.

Around 2005 Intel, AMD and the other chip manufacturers started creating processors with multiple cores. 
This meant it could actually do multiple things at the same time, since it had multiple "brains".
Processors could now assign different tasks to different cores and they would run at the same time. 
This is what we call <b>parallelism</b>

### JavaScript multi threading: impossible?
Although your JavaScript code is single-threaded and only does one thing at a time, the JavaScript Runtime and Web APIs are multithreaded!
When you pass a callback function to `setTimeout()` or start an AJAX request with `fetch()`,
you are essentially spinning up a background thread in the runtime. 
Once that background thread completes and the current call stack finishes executing, your callback function is pushed onto the (now empty) call stack and run-to-completion.
So your JavaScript code itself is single-threaded, but it orchestrates legions of threads!

### ES2017 async functions
The title of his talk contained the word 'Elegant' and this is where the ES2017 async/await functionality comes in.
This is a great alternative for dealing with promises in JavaScript. 
If you're a JavaScript developer you probably know what 'callback hell' is, or at least heard of it.
When writing complex programs, we could find ourselves in a situation where we would have to create multiple nested Promises to make sure we have the results of one call to continue with the next and so on.

Async - declares an asynchronous function (`async function someName(){...}`).
* Automatically transforms a regular function into a Promise.
* When called, async functions resolve to whatever is returned in their body.
* Async functions enable the use of await.

Await - pauses the execution of async functions. (`var result = await someAsyncCall();`).
* When placed in front of a Promise call, await forces the rest of the code to wait until that Promise finishes and returns a result.
* Await works only with Promises, it does not work with callbacks.
* Await can only be used inside async functions.

```javascript
// Promise approach
function getJSON(){
    // To make the function blocking we manually create a Promise.
    return new Promise( function(resolve) {
        request.get('https://myurl.com/example.json')
            .then( function(json) {
                // The data from the request is available in a .then block
                // We return the result using resolve.
                resolve(json);
            });
    });
}
```
```javascript
// Async/Await approach
// The async keyword will automatically create a new Promise and return it.
async function getJSONAsync(){
    // The await keyword saves us from having to write a .then() block.
    let json = await request.get('https://myurl.com/example.json');
    // The result of the GET request is available in the json variable.
    // We return it just like in a regular synchronous function.
    return json;
}
```

If you're a beginner with async functions and want to learn more this topic, check out <a href="https://www.youtube.com/watch?v=568g8hxJJp4&t=362s" target="_blank">this video</a>


For further reading on how Jonathan used async patterns for multicore JavaScript, he has written an <a href="https://www.bignerdranch.com/blog/cross-stitching-elegant-concurrency-patterns-for-javascript/" target="_blank">elaborate blog post</a> about it. 
We suggest you go check it out!

****

<span class="image left"><img class="p-image" alt="Madeleine Neumann" src="/img/js-conf-budapest-2017/speaker-madeleine.jpg"></span>

### Madeleine Neumann: Impostor syndrome - am I suffering enough to talk about it?

Madeleine is a front-end developer at 9Elements. She's also a conference organiser of RuhrJS.
You can find Madeleine on Twitter using the handle [@maggysche](https://twitter.com/maggysche).

The presentation can be found on [slideshare](https://www.slideshare.net/MadeleineNeumann/jsconf-budapest-impostor-syndrome-am-i-suffering-enough-to-talk-about-it).

<blockquote class="clear"><p>
The reason we struggle with insecurity is because we compare our behind the scenes with everyone else’s highlight reel.
</p></blockquote>

Madeleine wanted to share her life experience with us. 
While she attended secondary school, Madeleine was the creepy loner. 
_'What's wrong with me?'_, _'What did I do wrong?'_ she asked herself on several occasions. 
_'My behaviour must be wrong, I have to change'_. 
So she decided to take up programming in high school and felt truly belonged.
After Madeleine graduated high school, she started to work as a front-end developer where she was learning a lot, very quickly! 
However, she soon discovered that the speed at which she was learning gradually stagnated. 
She had mixed feelings about her profession and abilities, thinking she did not belong there and had no idea what she was doing.
So, she decided to work even harder. 
All of her friends and colleagues congratulated her for her effort and hard work, but Madeleine still wasn’t satisfied. 
Shortly after, she learned about _"the imposter syndrome"_.
Here are some common signs that someone might experience, where one feels like an imposter:  
* Does everyone overestimate you?
* Do you tend to discuss yourself?
* Do you compare your ability to those around you and think they’re more intelligent than you are?
* Does the fear of failure freak you out?
* Sometimes you’re afraid others will discover how much knowledge you really lack?
* You can’t understand the compliments you receive?
* You feel bad when you’re not ‘the best’ or at least ‘very special’?
* You avoid evaluations if possible and have a dread of others evaluating you?
* Do you focus more on what you haven’t done?

Madeleine discovered that her answer to all the previous questions was 'yes' and came to the conclusion she sabotaged herself. 
Now, how do you escape the 'imposter zone'?
* You aren't born to live a life of another person
* Learn to be a healthy perfectionist
* Answer on the following question 'What would I do, if I was not afraid?'
* Ask for help
* Mentor people what you're doing
* It's a good thing to know, what you don't know
* Talk about it
* Bribe your friends
* Being wrong doesn't make you a fraud
* Focus on providing value and write it down
* Keep a file of nice things someone has said about you
* Stop commenting compliments
* And finally, take time for yourself

Madeleine learned that sometimes, it’s not that bad to be an imposter. 
Because if you are an imposter, you are an overachiever and you can surprise people with your talent.

****


## Day 1 afternoon

<span class="image left"><img class="p-image" alt="Eirik Vullum" src="/img/js-conf-budapest-2017/speaker-eirik.jpg"></span>

### Eirik Vullum: JavaScript Metaprogramming - ES6 Proxy Use and Abuse

You can find Eirik on Twitter using the handle [@eiriklv](https://twitter.com/eiriklv).

The presentation can be found [here](http://slides.com/eiriklv/javascript-metaprogramming-with-proxies/).

<blockquote class="clear"><p>
This very interesting talk handles metaprogramming in JavaScript. Recently a new feature in ES6 was added to all 
major browsers, making JavaScript even more exciting! 
</p></blockquote>

First of all, what is metaprogramming? According to wikipedia: _'The ability to read, generate, analyse or transform 
other programs, and even modify itself while running'_. That is clear enough in my opinion. 

In metaprogramming one can define 2 branches. The first branch could be described as macros to extend your language. 
This happens during compile/transpile time. The second branch is called reflection and happens at runtime. There are 
three forms of reflection:
- Introspection: the ability to examine itself
- Self-modification: the ability to alter its structure
- Intercession: the ability to alter its behaviour

In JavaScript they are possible by default. Lets call it a perk of this beautiful scripting language. However, it seldom 
results in readable code and you'll probably need to write a lot of code for something we can now achieve in a much 
easier way.

This talk covers some of the possibilities of proxies. Proxies couldn't be used until recently, because it isn't
polyfillable. It's a feature that needs to be supported by the engine, where reflection truly happens. 
Therefore, nor typescript, nor babel, nor any other JavaScript preprocessor could solve that for you. 
By the way, preprocessors extend your language through macros, since their magic happens at transpile time.

So what is this proxy I am so exited about? It's called a proxy after the same principle we use in networking.
A proxy is middleware that intercepts interaction with an interface. Therefore, it has access to the communication 
stream and it needs access to the interface it's routing to. That's very similar to how we can use proxies in 
JavaScript. We can wrap any object with a proxy and define a handler. That handler is an object containing traps. 
A trap is a function that 'mocks' a property or function from the object that is being proxied. The proxy then knows 
which actions will be performed (before they are actually performed) and can choose how to handle them. It could do 
something totally different or even nothing at all.

```javascript
let handler = {
    set: (object, prop, value) => {
        // do what you desire (alter the value for example);
        object[prop] = value; // this wil execute the default setter
        return true; // to indicate success
    },    
    get: (object, prop) => {
        let value = object[prop]; // this wil execute the default getter
        // do what you desire
        return value;
    }
};

let mySquare = new Square(10,10);
let myProxySquare = new Proxy(mySquare, handler);
```
The above handler will intercept all `get` and `set` calls to a proxied class. `get` and `set` methods here are so 
called traps. For what purposes can we use this? One of the main purposes is to create developer friendly interfaces. 
In the slides you'll find some nice examples of great uses. My favorite is the url builder, it's glorious in its 
simplicity, [check it out here](http://slides.com/eiriklv/javascript-metaprogramming-with-proxies/#/46).

Now to wrap it all up, proxies are awesome, we can create powerful abstractions, be lazy and write less code and add
functionality in a transparent way. Even though it might seem like magic for anyone else than yourself and despite a 
small performance cost, it's still perfect if you want to create clean interfaces for others to enjoy.

****

<span class="image left"><img class="p-image" alt="Sandrina Pereira" src="/img/js-conf-budapest-2017/speaker-sandrina.jpg"></span>

### Sandrina Pereira: How can Javascript improve your CSS mixins

Sandrina is UI Developer at Farfetch. You can find Sandrina on Twitter using the handle [@a_sandrina_p](https://twitter.com/a_sandrina_p).

All code can be found on her [GitHub](https://github.com/sandrina-p/css-mixins-on-javascript-with-unit-tests) page and the slides [here](https://docs.google.com/presentation/d/19v8jkgS_0F7DrGw-8SzHktzy7nkC9W9XCNDqeXzB2wg/edit#slide=id.g235012375a_0_0).

<blockquote class="clear"><p>
To write good tests, you have to know exactly what you need to do. 
When you know what to do, you do less.
When you do less, you can do better!
</p></blockquote>

CSS and JavaScript work together more than ever these days. 
Using the good parts of both worlds ensures us that we can get better in web development. 
One of the reasons is because CSS primarily doesn’t have logic behind it. 
It's simple and straightforward. 
However, when you have to start using logic in your CSS, you can for example add a loop with SCSS.
When you find yourself reusing the same CSS code over and over, you can write a _mixin_.
However, at the end of the day, things can get ugly. 
Therefore, many programmers use PostCSS to write logic in their CSS code. 
There are more than half a million downloads per month of PostCSS plugins!

Here's how you write a mixin in CSS: 
```javascript
// index.css 
@define-mixin size $value {
 	width: $value;
	height: $value;
}
.avatar {
 	@mixin size 20px;
}
```

This is how it works in JavaScript:
```javascript
// size.js
module.exports = (mixinNode, value) => ({
 	width: value,
	height: value,
})

// postcss.config.js
module.exports = {
    // ...  
 	plugins: [
		require('postcss-mixins')({
 			mixindsDir: '../src/mixins/',
		}, 
		// ... 
	]
}

// index.css
.avatar {
	@mixin size 20px;
}
```

Now, we can't test logic in CSS, but in JavaScript we can!
```javascript 
// size.test.js
import size from '../src/mixins/size.js';

test('Size returns width and height', () => {
  expect(size(null, '24px').toEqual({
      width: '24px',
      height: '24px'
    });
});
```

So you started to use CSS mixins with JavaScript and ended up with a folder full of mixins to improve your CSS. 
Instead of using a series of mixins in the CSS file itself that only improve **your** project, 
we can create a custom property with the PostCSS plugin called _‘Boilerplate’_.
Using that, we can do the following: 

```javascript
// index.css
.avatar {
  size: 20px;
}

// index.js
const postcss = require('postcss');
postcss.plugin('postcss-size', () => css => {
  // let’s transform CSS with JS
  css.walkDecls('size', decl => {
      // 1. get the size value 
      const value = decl.value;
      // 2. add “width” & “height” properties
      decl.cloneBefore({ prop: 'width', value });
      decl.cloneBefore({ prop: 'height', value });
      // 3. remove “size” property 
      decl.remove();
  });
});

// index.test.js
const plugin = require('./index.js');
const postcss = require('postcss');

function run(input, output) { ... };
test('Sets width and height', () => {
  return run(
    '.foo { size: 1px; }',
    '.foo { width: 1px; height: 1px; }'
  );
});
```

After you execute the command `npm publish` in the console, you aren't only going to improve your own project, but everyone's projects.
You can find other popular PostCSS plugins [here](https://github.com/postcss/postcss/blob/master/docs/plugins.md).

<blockquote class="clear"><p>
That’s why I came here today. To share something that improved my project and might improve yours as well. 
I believe sharing is what make us better.
</p></blockquote>

****

<span class="image left"><img class="p-image" alt="Kacper Sokołowski" src="/img/js-conf-budapest-2017/speaker-kacper.jpg"></span>

### Kacper Sokołowski: You use Content Security Policy, don't you?

Kacper is a front-end developer for Codewise.
He's also a speaker and community organiser for KrakowJS.
You can find Kacper on Twitter using the handle [@kaapa_s](https://twitter.com/kaapa_s)

The presentation can be found [here](http://slides.com/kaapa/deck/)

<blockquote class="clear"><p>
Everyone knows that security is important right?
The biggest companies like Facebook and Google spend tons of money on bug bounty programs to ensure that their products are secure.
But is there a way that we can make our website prone to some of the most popular attacks?
There is one security mechanism which can help, but yet not everyone knows and uses it.
It’s called Content Security Policy.
</p></blockquote>

Kacper started his presentation with an example to demonstrate why security is **hard**.
<blockquote><p>
In 2005, Kamkar released the Samy worm, the first self-propagating cross-site scripting worm, onto MySpace.
The worm carried a payload that would display the string "but most of all, Samy is my hero" on a victim's profile and cause the victim to unknowingly send a friend request to Kamkar.
When a user viewed that profile, they would have the payload planted on their page.
Within just 20 hours of its October 4, 2005 release, over one million users had run the payload, making it the fastest spreading virus of all time.
</p></blockquote>

#### XSS
Cross Site Scripting (XSS) was used to inject and spread the virus.
It's a technique to inject and execute any JavaScript code in the context of the page.

What can you do with XSS?
* Steal cookies
* Steal localstorage data
* Break the layout and style of the page
* Whatever you can do with JavaScript...

You can find a lot of information about XSS and other vulnerabilities on this website: [https://www.owasp.org](https://www.owasp.org)

#### HOW TO BE SAFE?!

##### CSP
Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks.

Inline code is considered harmful so don't use something like this:
```html
<script>
alert('hello JSConfBP!');
...
</script>

```
Instead externalise your code and do something like this:
```html
<script src="..."></script>
```

##### HTTP HEADERS

When you have externalised your scripts, you need to make sure your site only loads these scripts.
To enable CSP, you need to configure your web server to return the Content-Security-Policy HTTP header.

_Specifying your policy:_

**Content-Security-Policy:** script-src 'self' http://google.com ...

_Specifying your directive(s):_

Content-Security-Policy: **script-src** 'self' http://google.com ...

_Specifying the URL list:_

Content-Security-Policy: script-src **'self' http://google.com ...**



Other directives you can use:
* connect-src
* img-src
* script-src
* style-src
* ...

You can use the fallback directive for other resource types that don't have policies of their own: **default-src**



##### Conclusion

Many parts of your website **will probably break** when you CSP for the first time.
So, start using it as early as possible!

****

<span class="image left"><img class="p-image" alt="Dan Callahan" src="/img/js-conf-budapest-2017/speaker-dan.jpg"></span>

### Dan Callahan: Practical WebAssembly

You can find Dan on Twitter using the handle [@callahad](https://twitter.com/callahad).
<blockquote class="clear"><p>In this talk Dan explained what WebAssembly is all about. 
How it works, what it's for, the features that are already there and which features are yet to come.</p></blockquote>

WebAssembly, what is it?
Well, according to <a target="_blank" href="http://webassembly.org/">http://webassembly.org/</a>:
<blockquote class="clear">"WebAssembly or wasm is a new portable, size- and load-time-efficient format suitable for compilation to the web."</blockquote>

<b>A compiler for the web:</b>
* Low-level, binary format for programs:<br>
    WebAssembly is a fast, portable, compact, cross-browser binary format for compilation to the web.
* It's an <i>open standard<i> supported by <i>all major browsers</i>. <a href="https://caniuse.com/#feat=wasm" target="_blank">caniuse.com</a>
* Direct successor of asm.js
* General purpose virtual architecture
* It allows new types of applications and heavy 3D games to run efficiently in browsers.


<h3>Why?</h3>

##### Performance!

WebAssembly is a binary format for JS.
It has 2 major benefits:
* The JS engine can skip the parsing step
* It's much more compact than the JS original source

##### Portability

At the moment of writing this blog, there are two languages that can compile into wasm, those are C/C++ and Rust.
This is great for portability since code written in C works on Mac, Linux and Windows.

### Is JavaScript dead?

JavaScript is alive, but its client-side monopoly is dead.
WebAssembly doesn't replace JavaScript, but does expand the web and complements JavaScript:
* High Level (JS) vs. Low Level (WASM)
* Text (JS) vs. Binary (WASM)

### Unity Support

When it comes to creating 3D games, Unity also has experimental support for WebAssembly.<br>
Check out <b><a target="_blank" href="http://webassembly.org/demo/">this demo</a> of an in browser game</b>

### Unreal Engine

This is a video of Epic's "Zen Garden" demo running in Firefox.
The demo is built with WebAssembly and WebGL 2, both emerging standards that enable amazing video games and applications in the browser.

<div class="responsive-video m-b">
    <iframe src="https://www.youtube.com/embed/TwuIRcpeUWE?rel=0" frameborder="0" allowfullscreen></iframe>
</div>

### What about older browsers

Use asm.js as a fallback.

When using Binaryen with Emscripten, it can load the compiled code using one of several methods.


By setting <code>-s BINARYEN_METHOD='..'</code> you can specify those methods, as a comma-separated list. 
It will try them one by one, which allows fallbacks.

By default, it will try native support. The full list of methods is:
* native-wasm: Use native binary wasm support in the browser.
* interpret-s-expr: Load a .wast, which contains wasm in s-expression format and interpret it.
* nterpret-binary: Load a .wasm, which contains wasm in binary format and interpret it.
* interpret-asm2wasm: Load .asm.js, compile to wasm on the fly and interpret that.
* asmjs: Load .asm.js and just run it, no wasm. Useful for comparisons or as a fallback for browsers without WebAssembly support.


### Can I compile JS to WASM?

Don't do that!
Browsers will still have native JavaScript VM along-side wasm.
There's no reason to compile JS to wasm because you would also have to include a whole JavaScript VM.
The resulting code would be huge and slower than the JS VM natively provided.

### Interesting Links:

<ul>
    <li>
        <a href="https://mbebenita.github.io/WasmExplorer/" target="_blank">Here</a> you can translate C/C++ to WebAssembly and see the machine code generated by the browser.
    </li>
    <li>
        <a href="https://youtu.be/3GHJ4cbxsVQ" target="_blank">YouTube video</a> on what WebAssembly means for React
    </li>
    <li>Tanks demo Unity game on <a target="_blank" href="http://webassembly.org/demo/">webassembly.org</a></li>
</ul>



****

<span class="image left"><img class="p-image" alt="Luke Bonaccors" src="/img/js-conf-budapest-2017/speaker-luke.jpg"></span>

### Luke Bonaccorsi: How I ended up automating my curtains and shouting at my laptop

You can find Luke on Twitter using the handle [@lukeb_uk](https://twitter.com/lukeb_uk).

The presentation can be found [here](https://docs.google.com/presentation/d/1lG5SmhHLaFwqw1jSKiyNkjipm2UwxSfaPvxKX-C8VVI/edit#slide=id.p)

<blockquote class="clear"><p>
Being lazy can lead to some great out of the box thinking and finding innovative solutions for common everyday stuff.
Luke talks about how he created a chatbot that automates things for him to make them a bit less common and/or boring.</p></blockquote>

### Woodhouse

<div>
<p style="width: 60%;">
<img src="/img/js-conf-budapest-2017/luke-woodhouse.jpg" alt="Woodhouse" style="float: left; padding: 5px;" height="100px"/>
He would have named it Jarvis, but since this would be a far worse butler than Jarvis was, he named it Woodhouse after the butler character from the tv-series 'Archer'.
</p>
</div>

Around mid-2014 he started working on a chatbot that does little bits in his house. 
Basically, he put together a Raspberry Pi running JavaScript code that actually serves as a router with some core functionality built in like:
* Broadcasting
* Preference storage
* Scheduling

There’s two types of modules that make it up:
* Plugins do all the heavy-lifting so you can interface with hardware (as long as it’s possible with JavaScript or the node ecosystem) or get it to send a message. You could for example let it connect to API’s to get it to do your builds on your CI tools.
* The interfaces which are basically chat systems. They are the way to talk to the chat bots. If the system has a way for you to build stuff for it in JavaScript, you can connect to it and let it do stuff on for example: Facebook, Slack, HipChat and many more…

### Open source
All of it is open source (MIT) and is avaiable on <a href="https://github.com/Woodhouse/core" target="_blank">GitHub</a>. 
It's written in JavaScript and runs on NodeJs.


### Automating Lamps
<div class="responsive-video m-b">
    <iframe src="https://www.youtube.com/embed/5YNmMdTzfaQ" frameborder="0" allowfullscreen></iframe>
</div>

Sending a message in a chat application that gets picked up by Woodhouse and he/it then turns on his lamps at home.
So, as he walks down the street getting to his house, instead of coming home and stumbling over things searching for the light switch in the dark,
he can just send a message and the lights will be on when he gets there.


<p>
<img src="/img/js-conf-budapest-2017/luke-lamp-plugs.jpg" alt="Lamp plugs image" class="image left fit">
<b>Lamp plugs</b> (they are from China, so super safe, right?). Maybe not, but they cost about £15 and are great for poking around.
After doing so, he found out that there was a Google group that had been hacking around with them and found the SSH password for it.
It turned out it runs <a href="https://openwrt.org/" target="_blank">OpenWrt</a> which is a router firmware based on Linux.
So, after being able to SSH into it and work with the Linux installed on it, you can run basic scripts on it (it has limited memory so you can’t just install everything you like on it).
But most importantly, it’s got a web server built into it, so you can hit an endpoint and make the relay turn on. That’s how his relay works.
There’s an endpoint on the plug and when he goes to that endpoint, it switches it on or off depending on a parameter.
</p>


### Automating the curtains
For giving talks about the application, he wanted to add something new to the application and so… he automated his curtains.

<div class="responsive-video m-b">
    <iframe src="https://www.youtube.com/embed/Crudcsaheoc" frameborder="0" allowfullscreen></iframe>
</div>

The setup and parts for it are very basic and simple. It’s basically some string, plastic wheels, a servo and an esp82266.

<div style="display: block;">
<p>
<img src="/img/js-conf-budapest-2017/luke-esp8266.jpg" alt="esp8266 board and components" class="image left fit">
The esp8266 is a wireless Arduino type board, but the cheap Chinese version so you can buy loads of them and connect them
to your network. So for about £2 each you can control stuff over your network from anywhere. 
It runs <a href="https://mongoose-os.com/" target="_blank">Mongoose OS</a>
which lets you write JavaScript on your hardware, it takes away a lot of the complexities of the lower level code and lets you use a language you know.
</p>
</div>
<br>
### Shouting at his laptop

Not out of frustration or anything like that. Besides the chatbot, he wanted to add voice control to the application so that he could tell his laptop to open/close the curtains or turn on/off the lights.

<div class="responsive-video m-b">
    <iframe src="https://www.youtube.com/embed/CQzn16TzZ0w" frameborder="0" allowfullscreen></iframe>
</div>

It uses a NodeJs library for offline 'hot words' detection. So instead of having it constantly listening to him,
he can just shout ‘Woodhouse’ which will make it reply to say that it’s listening. The rest of the complex speech to text is done by Google,
since they have a lot more data than him. There are open source systems for doing speech to text, but you would have to train it yourself and well, we’re doing all this because we want to be lazy…
So he created a few of these voice control units and spread them around the house and let them connect to one central instance. So he can activate it from wherever he is in the house.

### Conclusion

So instead of being lazy, he admits to being the stupid kind of lazy. 
He has spent about hundreds of hours coding for it to do simple stuff.
So it's not really about being lazy, but more being not driven to do those simple things.


****

### Party feat Live:JS by SINNERSCHRADER

After a long day of JavaScript fun we were invited to a rooftop party at [Corvinteto](https://corvinteto.hu/) located near the venue.
Imagine a party with awesome visuals, music & beats, and lights - all powered and created by JavaScript!
More info about the concept can be found here: [LiveJS](http://livejs.network)

<div class="responsive-video">
    <iframe src="https://www.youtube.com/embed/G4nIMBWy1bQ" frameborder="0" allowfullscreen></iframe>
</div>

****

## Day 1: Conclusion

At the first day of the conference we were already inspired by some good talks. Wondering what day 2 would bring. 


[Read our full report on day 2 of JS Conf Budapest 2017 here!](/conference/2018/01/03/JS-Conf-Budapest-day-2.html)
