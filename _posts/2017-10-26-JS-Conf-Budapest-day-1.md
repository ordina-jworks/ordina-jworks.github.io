---
layout: post
authors: [frederic_ghijselinck, orjan_de_smet, stefanie_geldof, martijn_willekens, yannick_vergeylen, dimitri_de_kerf]
title: 'JS Conf Budapest Day 1'
image: /img/js-conf-budapest-2017/js-conf-budapest-2017.png
tags: [JS Conf Budapest,JavaScript,Conference]
category: Conference
comments: true
---

## From JS Conf Budapest with love

This year's edition of JS Conf Budapest returned to the first venue at [Urania National Movie theater](http://akvariumklub.hu/).

> Uránia Cinema in the middle of the city, near the party-district.
> Designed by Henrik Schmahl in the late 1890's, the interior is characterized by the ornamental motifs of the Venetian Gothic and Moor styles.
> The place is listed as the world's 3rd most beautiful cinema on Bored Panda, and many tech conferences were hosted here recently, like TEDx, and Strech Conference, because of the unique atmosphere.

JS Conf Budapest 2017 is hosted by [](https://twitter.com/) and [](https://twitter.com/).

At 9:45 the conference would officially start so we went to the conference room.

****

## Day 1: Talks

* [Bodil Stokke: You Have Nothing To Lose But Your Chains](#bodil-stokke-you-have-nothing-to-lose-but-your-chains)
* [Stefan Judis: Watch your back, Browser! You're being observed](#stefan-judis-watch-your-back-browser-youre-being-observed)
* [Jonathan Martin: Async patterns to scale your multicore JavaScript... elegantly](#jonathan-martin-async-patterns-to-scale-your-multicore-javascript-elegantly)
* [Madeleine Neumann: Impostor syndrome - am I suffering enough to talk about it?](#madeleine-neumann-impostor-syndrome-am-i-suffering-enough-to-talk-about-it)
* [Eirik Vullum: JavaScript Metaprogramming - ES6 Proxy Use and Abuse](#eirik-vullum-javascript-metaprogramming-es6-proxy-use-and-abuse)
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
A talk about the Open Source movement and the Free Software movement it grew out of
</p></blockquote>

The talk started of with a story about Richard and a Xerox printer. Richard is a developer suffering from a minor
usability flaw in the Xerox printer at his office. Like the good developer he is, he wants to fix the issue and share
it with the world for everybody's profit. But therefor he needs access to the code. Turns out that Xerox' code for 
that particular printer is not publicly available. Therefor Richard can't fix the issue and not only he has to live 
with the inconvenience, but everyone at the office, and even everyone using that same printer. The clue here is that a 
minor fix has to wait until someone at Xerox finds the time to solve the issue. Considering the minor status of the 
issue, it's not even likely to happen... ever. With open source software this fix could be done by a motivated user in 
a few moments. 

This little intro sets the mood for the talk, and one can consider it a bit opinionated, but there are no doubt some 
powerful arguments for open source software. The talk also covers the free software movement that all started it, and 
from which the Open source movement branched of. The difference though is just in its philosophy. First of all a common
misunderstanding, free software does not mean one can get it with zero cost. It says that anyone can get the code and 
is free to do with it as pleased. Modify, change, sell or use it for another purpose. Open source software provides 
some restrictions. Therefor Open source software is more popular and used more widely, it gives control. 

For example: A concurring company might purchase your proprietary software and then have access to the code. They could 
copy your product and sell it for a lower price. This can be done with Free software but Open source software has some 
licenses defined to prevent this. In the talk some are covered, I took the liberty to list some of them here with a 
short explanation. Click trough to see how easily it is to use them and have a legal basis to rely on.

The most popular and widely used licenses are:
#### [Apache License 2.0](https://opensource.org/licenses/Apache-2.0)
Designed to be simple and easy to comply with, but more extensive than the previous versions. One can use the licensed 
software for any purpose, to change and redistribute. Changes can be distributed under other licenses but unchanged 
code needs to be distributed under the same license.

#### [3-clause BSD license](https://opensource.org/licenses/BSD-3-Clause)
Designed to be simple and short. It  allows unlimited redistribution for any purpose as long as its copyright notices 
and the license's disclaimers of warranty are maintained. The license also contains a clause restricting use of the 
names of contributors for endorsement of a derived work without specific permission. In the 2-clause version that 
restriction is left out.

#### [GNU General Public License](https://opensource.org/licenses/GPL-3.0)
Software under GNU GPL is free (as in: do with it as you please). The main restrictions defined by this license are that
you should always mention the authors of the software and it must always stay under the GNU GPL license.

#### [MIT License](https://opensource.org/licenses/MIT)
Created by Massachusetts Institute of Technology, it has one simple rule. The copyright statement should stay in any
copy of the software. 'Copyright (c) &lt;year&gt; &lt;copyright holders&gt;'

#### [Mozilla Public License 2.0](https://opensource.org/licenses/MPL-2.0)
Code under MPL can be copied or changed, but must stay under MPL. The code can be combined with closed source files.

Open source should be considered by many companies, since many profit form open source. SpaceX for example profits from
 open source software, non the less their own code is closed. Another company by the same person, Elon Musk, has its 
 code publicly available: Tesla, the electric car manufacturer. Here is a part I found on 
 [Tesla's own blog](https://www.tesla.com/blog/all-our-patent-are-belong-you).
 
 <blockquote class="clear"><p>
 At Tesla we felt compelled to create patents out of concern that the big car companies would copy our technology and 
 then use their massive manufacturing, sales and marketing power to overwhelm Tesla. We couldn’t have been more wrong. 
 The unfortunate reality is the opposite: electric car programs (or programs for any vehicle that doesn’t burn 
 hydrocarbons) at the major manufacturers are small to non-existent, constituting an average of far less than 1% of 
 their total vehicle sales.
 </p></blockquote>
 
While sharing your code can benefit the concurrence, it also benefits the world. This counts for Tesla in particular, 
while there might be a huge market for electric vehicles, we also need them as fast a possible. And open source can 
help us with achieving that goal.

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

Another great benefit of these Observers is that all functions RxJS offers us (e.g. `skip`, `pairwise`, `filter` ...), can be used as well!
The emitted values of the Observers are collections so we can use functions such as `map`, `filter` and `reduce` there as well.
As mentioned in the presentation, these two combined gives us "Collection super powers!".

****

<span class="image left"><img class="p-image" alt="Jonathan Martin" src="/img/js-conf-budapest-2017/speaker-jonathan.jpg"></span>

### Jonathan Martin: Async patterns to scale your multicore JavaScript... elegantly

You can find Jonathan on Twitter using the handle [@nybblr](https://twitter.com/nybblr).

The presentation can be found on [speakerdeck](https://speakerdeck.com/nybblr/async-patterns-to-scale-your-multicore-javascript-dot-dot-dot-elegantly).

<blockquote class="clear"><p>
INSERT SMALL TALK DESCRIPTION
</p></blockquote>

INSERT TALK SUMMARY HERE

****

<span class="image left"><img class="p-image" alt="Madeleine Neumann" src="/img/js-conf-budapest-2017/speaker-madeleine.jpg"></span>

### Madeleine Neumann: Impostor syndrome - am I suffering enough to talk about it?

Madeleine is front-developer at 9Elements. Conference organiser of RuhrJS.
You can find Madeleine on Twitter using the handle [@maggysche](https://twitter.com/maggysche).

<blockquote class="clear"><p>
The reason we struggle with insecurity is because we compare our behind the scenes with everyone else’s  highlight reel
</p></blockquote>

Madeleine wanted to share her life experience with us. While se attended secondary school, Madeleine was the creepy loner at school. 
'What's wrong with me?', 'What did I do wrong?' she asked herself on several occasions. 
'My behaviour must be wrong, I have to change'. So she decided to take up programming in high school and felt truly belonged.
After Madeleine graduated high school, she started to work as a frontend developer where she was learning a lot, very quickly! 
However she soon discovered that the speed at which she was learning gradually stagnated. 
She had mixed feelings about her profession and abilities, thinking she did not belong there and had no idea what she was doing, so she decided to work even harder. 
All of her friends and colleagues congratulated her for her effort and hard work, but Madeleine still wasn’t satisfied. Shortly after, she discovered 
“the imposter syndrome”. Here are some common signs that someone might experience, where one feels like an imposter:  
* Does everyone overestimate you?
* Do you tend to discuss yourself?
* You compare your ability to those around you and think they’re more intelligent than you are?
* Does the fear of failure freaks you out?
* Sometimes you’re afraid others will discover how much knowledge you really lack?
* You can’t understand the compliments you receive?
* You feel bad when you’re not ‘the best’ or at least ‘very special’?
* You avoid evaluations if possible and have a dread of others evaluating you?
* Do you focus more on what you haven’t done?

Madeleine discovered that her answer to all the previous questions was 'yes' and came to the conclusion she sabotaged herself. But how do you escape the 'imposter zone'?
* You aren't born to live a life of another person
* Learn to be a healthy perfectionist
* Answer on the following question 'What would I do, if I was not afraid?'
* Ask for help
* Mentor people what you're doing
* It's a good thing to know, what you don't know
* Talk about it
* Bribe your friends
* Being wrong, doesn't make you a fraud
* Focus on providing value and write it down
* Keep a file of nice things someone was saying about you 
* Stop commenting compliments
* And finally, take time for yourself

Madeleine learned that sometimes, it’s not that bad to be an imposter. 
Because you are an imposter, you are an overachiever and you can surprise people with your talent.

****


## Day 1 afternoon

<span class="image left"><img class="p-image" alt="Eirik Vullum" src="/img/js-conf-budapest-2017/speaker-eirik.jpg"></span>

### Eirik Vullum: JavaScript Metaprogramming - ES6 Proxy Use and Abuse

You can find Eirik on Twitter using the handle [@eiriklv](https://twitter.com/eiriklv).

The presentation can be found [here](http://slides.com/eiriklv/javascript-metaprogramming-with-proxies/).

<blockquote class="clear"><p>
This very interesting talk handles metaprogramming in javascript, since there is a new feature in es6 which is just 
recently supported by all major browsers that makes javascript even more exciting. 
</p></blockquote>

First of all, what is metaprogramming, according to wikipedia: 'The ability to read, generate, analyse or transform 
other programs, and even modify itself while running'. And that is clear enough in my opinion. 

In metaprogramming one can define 2 branches. The first branch could be described as macros to extend your language, 
this happens during compile/transpile time. The second branch is called reflection, which happens at runtime. There are three 
forms of reflection:
- introspection: the ability to examine itself
- self-modification: the ability to alter its structure
- intercession: the ability to alter its behaviour

In Javascript they are possible by default, let's call it a perk of this beautiful scripting language. But it seldom 
results in readable code, and you'll probably need to write a lot of code for something we can now achieve in a much 
easier way.

This talk covers some of the possibilities of proxies. Proxies couldn't yet be used until recently, because it is not
polyfillable. That is because its a feature that needs to be supported by the engine, where reflection truly happens. 
Therefor nor typescript, nor babel, nor any other javascript preprocessor could solve that for you. By the way,
preprocessors extend your language trough macros, since their magic happens at transpile time.

So what is this proxy I am so exited about? Its called a proxy after the same principle we use in networking, a proxy 
is a middleware which intercepts interaction with an interface. Therefor it has access to the communication stream and 
it needs access to the interface it's routing to.
That is very similar to how we can use proxies in javascript. We can wrap any object with a proxy an define a handler.
That handler is an object which contains traps. A trap is a function that 'mocks' a property or function from the object 
that is being proxied. The proxy then knows what actions will be done (before they are actually done) and can chose how 
to handle them. It can just do something totally different or do nothing at all.

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
The above handler will intercept all `get` and `set` calls to a proxied class. `get` and `set` methods here are so called 
traps. For which purposes can we use this? One of the main purposes is to create developer friendly interfaces. In the 
slides you'll find some nice examples of great uses. My favorite is the url builder, it's glorious in its simplicity,
[check it out here](http://slides.com/eiriklv/javascript-metaprogramming-with-proxies/#/46).

Now to wrap it up, proxies are awesome, we can create powerful abstractions, we can be lazy and write less code and add
functionality in a transparent way. Even though it might seem like magic for anyone else than yourself and there
is a small performance cost, it's still perfect if you want to create clean interfaces for others to enjoy.

****

<span class="image left"><img class="p-image" alt="Sandrina Pereira" src="/img/js-conf-budapest-2017/speaker-sandrina.jpg"></span>

### Sandrina Pereira: How can Javascript improve your CSS mixins

You can find Sandrina on Twitter using the handle [@a_sandrina_p](https://twitter.com/a_sandrina_p).

All code can be found on her [github](https://github.com/sandrina-p/css-mixins-on-javascript-with-unit-tests) page and the slides [here](https://docs.google.com/presentation/d/19v8jkgS_0F7DrGw-8SzHktzy7nkC9W9XCNDqeXzB2wg/edit#slide=id.g235012375a_0_0).

<blockquote class="clear"><p>
INSERT SMALL TALK DESCRIPTION
</p></blockquote>

INSERT TALK SUMMARY HERE

****

<span class="image left"><img class="p-image" alt="Kacper Sokołowski" src="/img/js-conf-budapest-2017/speaker-kacper.jpg"></span>

### Kacper Sokołowski: You use Content Security Policy, don't you?

You can find Kacper on Twitter using the handle [@kaapa_s](https://twitter.com/kaapa_s)

The presentation can be found [here](http://slides.com/kaapa/deck/)

<blockquote class="clear"><p>
INSERT SMALL TALK DESCRIPTION
</p></blockquote>

INSERT TALK SUMMARY HERE

****

<span class="image left"><img class="p-image" alt="Dan Callahan" src="/img/js-conf-budapest-2017/speaker-dan.jpg"></span>

### Dan Callahan: Practical WebAssembly

You can find Dan on Twitter using the handle [@callahad](https://twitter.com/callahad).
<p style="height: 300px;"></p>

Web Assembly, what is it?
Well according to <a target="_blank" href="http://webassembly.org/">http://webassembly.org/</a>:
<blockquote>"WebAssembly or wasm is a new portable, size- and load-time-efficient format suitable for compilation to the web."</blockquote>

<b>A compiler for the web:</b>
* Low-level, binary format for programs:<br>
    WebAssembly is a fast, portable, compact, cross-browser binary format for compilation to the Web.
* It's an <i>open standard<i> supported by <i>all major browsers.</i> <a href="https://caniuse.com/#feat=wasm" target="_blank">caniuse.com</a>
* Direct successor of asm.js
* general purpose virtual architecture
* It allows new types of applications and heavy 3D games to run efficiently in browsers.


<h3>Why?</h3>

##### Performance!

Web assembly is a binary format for JS.
It has 2 major benefits:
* the JS engine can skip the parsing step
* it's much more compact than the JS original source

##### Portability

At the moment of writing this blog, the two languages compile into wasm are C/C++ and Rust.
This is great for portability since code written in C works on mac, linux and windows.

### Is javascript dead?

JavaScript is alive, but it's client-side monopoly is dead.
Web Assembly doesn't replace JavaScript, but does expand the web and complements JavaScript:
<ul>
    <li>High Levels (JS) vs. Low Level (WASM)</li>
    <li>Text (JS) vs. Binary (WASM)</li>
</ul>

### Unity Support

When it comes to creating 3D games, Unity also has experimental support for Web Assembly.<br>
Check out <b><a target="_blank" href="http://webassembly.org/demo/">this demo of an in browser game</a></b>

This is a video of Epic's "Zen Garden" demo running in Firefox.
The demo is built with WebAssembly and WebGL 2, both emerging standards that enable amazing video games and applications in the browser.
<iframe width="560" height="315" src="https://www.youtube.com/embed/TwuIRcpeUWE?rel=0" frameborder="0" allowfullscreen></iframe>

### What about older browsers

Use asm.js as a fallback.

### Can I compile JS to WASM

Don't do that!
Browsers will still have native JavaScript VM along-side wasm.
There is no reason to compile JS to wasm because you would have to also include a whole javascript vm.
The resulting code would be huge and slower than the JS VM natively provided.

### What about type errors?

Like in JS, the browser coerces types.

Interesting Links:
<ul>
    <li>
        <a href="https://mbebenita.github.io/WasmExplorer/" target="_blank">Here</a> you can translate C/C++ to WebAssembly, and then see the machine code generated by the browser.
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

<blockquote class="clear"><p>
INSERT SMALL TALK DESCRIPTION
</p></blockquote>

INSERT TALK SUMMARY HERE

****

### Party feat Live:JS by SINNERSCHRADER
Join us on the roof of Corvinteto located near the venue


****


## Day 1: Conclusion






[Read our full report on day 2 of JS Conf Budapest here!](/conference/2017/10/27/JS-Conf-Budapest-day-2.html).
