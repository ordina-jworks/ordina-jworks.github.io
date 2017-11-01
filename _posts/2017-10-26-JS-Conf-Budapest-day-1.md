---
layout: post
authors: [frederic_ghijselinck, orjan_de_smet, stefanie_geldof, martijn_willekens, yannick_vergeylen]
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
copy of the software. 'Copyright (c) <year> <copyright holders>'

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

You can find Madeleine on Twitter using the handle [@maggysche](https://twitter.com/maggysche).

<blockquote class="clear"><p>
INSERT SMALL TALK DESCRIPTION
</p></blockquote>

INSERT TALK SUMMARY HERE

****


## Day 1 afternoon

<span class="image left"><img class="p-image" alt="Eirik Vullum" src="/img/js-conf-budapest-2017/speaker-eirik.jpg"></span>

### Eirik Vullum: JavaScript Metaprogramming - ES6 Proxy Use and Abuse

You can find Eirik on Twitter using the handle [@eiriklv](https://twitter.com/eiriklv).

The presentation can be found [here](http://slides.com/eiriklv/javascript-metaprogramming-with-proxies/).

<blockquote class="clear"><p>
INSERT SMALL TALK DESCRIPTION
</p></blockquote>

INSERT TALK SUMMARY HERE

****

<span class="image left"><img class="p-image" alt="Sandrina Pereira" src="/img/js-conf-budapest-2017/speaker-sandrina.jpg"></span>

### Sandrina Pereira: How can Javascript improve your CSS mixins

You can find Sandrina on Twitter using the handle [@a_sandrina_p](https://twitter.com/a_sandrina_p).

All code can be found on her [github](https://github.com/sandrina-p/css-mixins-on-javascript-with-unit-tests) page.

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

<blockquote class="clear"><p>
INSERT SMALL TALK DESCRIPTION
</p></blockquote>

INSERT TALK SUMMARY HERE

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
