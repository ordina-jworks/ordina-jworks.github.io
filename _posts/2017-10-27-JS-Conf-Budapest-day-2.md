---
layout: post
authors: [frederic_ghijselinck, orjan_de_smet, stefanie_geldof, martijn_willekens, dimitri_de_kerf]
title: 'JS Conf Budapest 2017 Day 2'
image: /img/js-conf-budapest-2017/js-conf-budapest-2017.png
tags: [JS Conf Budapest,JavaScript,Conference]
category: Conference
comments: true
---

## From JS Conf Budapest with love

This year's edition of JS Conf Budapest returned to the first venue at [Urania National Movie theater](http://www.urania-nf.hu/).

> Uránia Cinema in the middle of the city, near the party-district.
> Designed by Henrik Schmahl in the late 1890's, the interior is characterized by the ornamental motifs of the Venetian Gothic and Moor styles.
> The place is listed as the world's 3rd most beautiful cinema on Bored Panda, and many tech conferences were hosted here recently, like TEDx, and Strech Conference, because of the unique atmosphere.

JS Conf Budapest 2017 is hosted by [Glen Maddern](https://twitter.com/glenmaddern) and [Charlie Gleason](https://twitter.com/superhighfives).
At 10:00 the second day of the conference started. Enough time to drink great coffee and enjoy the breakfast.

****

## Day 2: Talks

* [Don Burks: MVC - What a web app and a Mozart Violin Concerto have in common](#don-burks-mvc---what-a-web-app-and-a-mozart-violin-concerto-have-in-common)
* [Opher Vishnia: Web Animation: from Disney to SASS](#opher-vishnia-web-animation-from-disney-to-sass)
* [Imad Elyafi: Migrating Pinterest profiles to React](#imad-elyafi-migrating-pinterest-profiles-to-react)
* [Laura Carvajal: YES, your site can (and should) be accessible too. Lessons learned in building FT.com](#laura-carvajal-yes-your-site-can-and-should-be-accessible-too-lessons-learned-in-building-ftcom)
* [Nikita Baksalyar: Exploring the P2P world with WebRTC & JavaScript](#nikita-baksalyar-exploring-the-p2p-world-with-webrtc--javascript)
* [Vaidehi Joshi: Goldilocks And The Three Code Reviews](#vaidehi-joshi-goldilocks-and-the-three-code-reviews)
* [Anna Migas: Make your animations perform well](#anna-migas-make-your-animations-perform-well)
* [Trent Willis: Caring For Your Fellow Developers](#trent-willis-caring-for-your-fellow-developers)

****

## Day 2: Morning

<span class="image left"><img class="p-image" alt="Don Burks" src="/img/js-conf-budapest-2017/speaker-don.jpg"></span>


### Don Burks: MVC - What a web app and a Mozart Violin Concerto have in common

You can find him on Twitter using the handle [@don_burks](https://twitter.com/don_burks).

The presentation can be found [here](https://donburks.com/2017-10-27-jsconfbp-presentation/).

<blockquote class="clear"><p>
INSERT SMALL TALK DESCRIPTION
</p></blockquote>

INSERT TALK SUMMARY HERE

****

### Opher Vishnia: Web Animation: from Disney to SASS

<span class="image left"><img class="p-image" alt="Opher Vishnia" src="/img/js-conf-budapest-2017/speaker-opher.jpg"></span>

You can find Opher on Twitter using the handle [@opherv](https://twitter.com/opherv).

The presentation can be found [here](http://slides.com/opherv/jsconfbp2017/).

<blockquote class="clear"><p>
Opher is a designer and developer. In his talk, Opher shared his vision on how animations come to live.
</p></blockquote>

After we got introduced to Opher’s cute dog named Blizzard, which grew up to a direwolf that can be casted directly in a TV show about dragons and an upcoming winter, Opher started his talk with some child nostalgia from Disney. He shared his amazement about the animations used in old animated movies such as The Lion King, especially since they were hand drawn, and how these animation bring the characters and surroundings to life.
 
But how do animations come to life? Two of the influencing factors are Follow Through and Overlapping Actions, which are part of the 12 basic principles of animation. The Follow Through principle defines that not every part of a moving entity moves the same way and stops the same way. Rather when one part of an entity stops, the other parts will follow through and come back. To illustrate this, Opher showed us an animation of a moving carrot that stopped suddenly, causing the leaves to go further before they stopped moving as well.
 
The Overlapping Action principle means that when an entity is moving, its looser parts start moving later. The animation of the moving carrot clearly showed that the carrot itself moved in a smooth way, while the leaves were being dragged behind the carrot.
 
These animation principles are applied by design specifications of huge companies such as the Material Design specs of Google. By taking these principles into account, you can give components and also the flow of your application more realism, for example when responding to events such as user input.
 
Now, how can we implement these animations in our app? Opher discussed three implementations with us by means of an animation he has been working on:
* CSS
* GSAP, GreenSock Animation Platform
* WAAPI, Web Animation API
 
#### CSS
With the CSS implementation, Opher’s animation performed well across different devices and was directly understood by the browser. However, he stumbled upon the limitations of CSS, which made it tricky to implement complex animations and dynamic animations were even a complete no-go. Besides that, debugging was not a joy.
 
#### GSAP
GSAP provides a great, robust API to implement animations and even dynamic animations. It also deals with inconsistencies of browsers, which makes the life of a developer easier. Unfortunately, there are some downsides too. One of them is that you depend on an extra lib. Additionally, the JavaScript where GSAP is based on is implementation-sensitive and more advanced features of GSAP are not free.
 
#### WAAPI
WAAPI provides a native JavaScript API for animations. Basically you query for the desired elements in JS and call the animation function of those elements where you configure the animation. The animate function accepts two parameters: the keyframes and the duration of the animation. The keyframes should be an array of objects, where each object defines the state of the object at a certain time. The second parameter can also be replaced by an options object which enables you to configure the animation way better, such as adding delays or repeating the animation infinitely. The downside is that WAAPI is not supported by many browsers, but there is nothing a good polyfill cannot fix.
 
So, which one should you use in your next project? As for most situations, this depends on your specific requirements and your expertise with the different implementations. It is recommended to keep these principles in mind when implementing animations in the future. With a little effort you can bring your own app to life, just like the animators of Disney did in their fairy tales.

****

### Imad Elyafi: Migrating Pinterest profiles to React

<span class="image left"><img class="p-image" alt="Imad Elyafi" src="/img/js-conf-budapest-2017/speaker-imad.jpg"></span>

You can find Imad on Twitter using the handle [@eelyafi](https://twitter.com/eelyafi).

The presentation can be found [here](). SEARCH FOR PRESENTATION !!!

<blockquote class="clear"><p>
INSERT SMALL TALK DESCRIPTION
</p></blockquote>

INSERT TALK SUMMARY HERE

****

### Laura Carvajal: YES, your site can (and should) be accessible too. Lessons learned in building FT.com

<span class="image left"><img class="p-image" alt="Laura Carvajal" src="/img/js-conf-budapest-2017/speaker-laura.jpg"></span>

You can find Laura on Twitter using the handle [@lc512k](https://twitter.com/lc512k).

The presentation can be found [here](https://speakerdeck.com/lc512k/yes-your-site-can-and-should-be-accessible).

<blockquote class="clear"><p>
Laura Carvajali works at the Financial Times. 
She's responsible for the accessibility of their website so that even blind people are able to use it.
In her talk, she explained how to achieve this.
</p></blockquote>

Accessibility doesn't happen by accident, you have to make it happen yourself.
A good starting point is to install pa11y (with npm).
It checks your HTML and points out where you can improve.
Color contrast issues, no or bad alt text for images and no related label for input fields are very common issue pa11y reports on.
Pa11y-ci can be used to integrate it with your CI and can break the build when there are errors.

With that done, there are some extra steps that can be taken.
First, you can get an external audit to get more feedback.
They have people that test with voice control, keyboard only mode, text to speech and other tools.
Next, you could do customer research and user testing with users with various disabilities.
Another option is to learn to use the tools for people with disabilities yourself and test with them.
The first option is the most expensive one, the second one is already less expensive while the last one is the cheapest.
A MacBook for example already has a lot of tools built in for people with disabilities if you want to test yourself.

****


## Day 2 afternoon

### Nikita Baksalyar: Exploring the P2P world with WebRTC & JavaScript

<span class="image left"><img class="p-image" alt="Nikita Baksalyar" src="/img/js-conf-budapest-2017/speaker-nikita.jpg"></span>

You can find Nikita on Twitter using the handle [@nbaksalyar](https://twitter.com/nbaksalyar).
The presentation can be found [here](). SEARCH FOR PRESENTATION !!!

<blockquote class="clear"><p>
INSERT SMALL TALK DESCRIPTION
</p></blockquote>

INSERT TALK SUMMARY HERE

****

### Vaidehi Joshi: Goldilocks And The Three Code Reviews

<span class="image left"><img class="p-image" alt="Vaidehi Joshi" src="/img/js-conf-budapest-2017/speaker-vaidehi.jpg"></span>

You can find Vaidehi on Twitter using the handle [@vaidehijoshi](https://twitter.com/vaidehijoshi).
The presentation can be found [here](http://slides.com/vaidehijoshi/better-code-reviews/).

<blockquote class="clear"><p>
INSERT SMALL TALK DESCRIPTION
</p></blockquote>

INSERT TALK SUMMARY HERE

****

### Anna Migas: Make your animations perform well

<span class="image left"><img class="p-image" alt="Anna Migas" src="/img/js-conf-budapest-2017/speaker-anna.jpg"></span>

You can find Anna on Twitter using the handle [@szynszyliszys](https://twitter.com/szynszyliszys).
The presentation can be found [here](https://www.slideshare.net/AnnaMigas1/make-your-animations-perform-well-js-conf-budapest-2017).

<blockquote class="clear"><p>
INSERT SMALL TALK DESCRIPTION
</p></blockquote>

INSERT TALK SUMMARY HERE

****

### Trent Willis: Caring For Your Fellow Developers

<span class="image left"><img class="p-image" alt="Trent Willis" src="/img/js-conf-budapest-2017/speaker-trent.jpg"></span>

You can find Trent on Twitter using the handle [@trentmwillis](https://twitter.com/trentmwillis).
The presentation can be found [here](). SEARCH FOR PRESENTATION !!!

<blockquote class="clear"><p>
INSERT SMALL TALK DESCRIPTION
</p></blockquote>

INSERT TALK SUMMARY HERE

****



****

### Afterparty at EXTRA Budapest by EPAM

EPAM invites everyone to chill, have some drinks and games at the EXTRA ruinpub after JSConf Budapest. Beer and a selection of soft drinks and juices are on the house.

****


## Day 2: Conclusion





## After Movie
<div class="responsive-video">
    <iframe src="https://www.youtube.com/embed/fysiFabvGnQ" frameborder="0" gesture="media" allowfullscreen></iframe>
</div>

****

[Read our full report on day 1 of JS Conf Budapest 2017 here!](/conference/2017/10/26/JS-Conf-Budapest-day-1.html).
