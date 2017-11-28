---
layout: post
authors: [frederic_ghijselinck, orjan_de_smet, stefanie_geldof, martijn_willekens, dimitri_de_kerf, dries_gijssels]
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

The presentation can be found [here](https://assets.contentful.com/nn534z2fqr9f/3RwYa1gv9SyQqsyscwws0A/be3e79ee3073cb973038395648bd249a/Imad_Elyafi_How_We_Migrated_Pinterest_Profiles_to_React.pdf).

A similar presentation was recorded on PolyConf 2017 and can be found on [YouTube](https://www.youtube.com/watch?v=OtEsmImvYeo).
A detailed write-out of that presentation can be found on [Medium](https://medium.com/@Pinterest_Engineering/migrating-pinterest-profiles-to-react-479f4f7306aa)

<blockquote class="clear"><p>
Imad Elyafi is a software engineer at Pinterest. 
In this talk Imad tells you the story of how Pinterest migrated to React, explaining the techniques they tried and challenges they faced.
</p></blockquote>

With the current availability of fantastic modern frameworks, Pinterest decided to migrate from their outdated Denzel framework to React.

##### Why React?
Imad started off by saying they had a list of requirements for the new framework.
1. Large developer community
2. Design patterns that are compatible with the existing stack to make the migration easier
3. Isomorphic rendering, therefore being able to reuse templates on server- and client-side
4. Performance
5. Developer Experience

##### Road to React
Rewriting the whole app from scratch would be risky and expensive.
Also, Pinterest did not want to freeze code and stop shipping new features.
So they had to migrate a service that is constantly changing. 
A very complicated challenge Imad compares to changing the engines of an airplane while mid-flight.

The solution was to rewrite the app piece by piece. 
That resulted in creating a so called hybrid app where two frameworks can exist together for the time it takes to migrate from the old framework to the new one.

The very first step they had to take to make this hybrid app was to change their infrastructure and enable server-side JavaScript rendering.
Before they used the _Jinja_ templating engine for server-side rendering in Python and the JavaScript equivalent _Nunjucks_ for client-side rendering.
By also enabling Nunjucks rendering on a stand-alone NodeJS server, they now achieved pure isomorphic rendering with JavaScript on the server and on the client.

Secondly, Pinterest had to render React components in their old Denzel framework. 
So they added React-specific bindings to Nunjucks’ templating language with a new keyword (component), to represent the “bridge” between Denzel and React.

An example of a Nunjucks template with a React-Denzel bridge: 
{% raw %}
```
{% if in_react %}
  {{ component('MyReactComponent', {pinId: '123'}) }}
{% else %}
  {{ module('MyDenzelComponent', pinId='123') }}
{% endif %}
```
{% endraw %}

Lastly, they had to create adapters for the old data resources. 
To do so, they used a technique called High-Order Components (HOC).
A HOC is a function that takes a component and returns another component.

This technique allowed them to compose components with a resource.
When the component is added to the DOM, it will create the resource and send a request to the API.
A callback function will update its state and trigger the rendering of the given component. 
With this approach, you can keep your components and data in sync all the time.

You can read more about HOCs [here](https://reactjs.org/docs/higher-order-components.html)


##### UI experiments
Imad explained that they used an A/B testing framework to measure the impact of the migration.
By doing this they managed to see consistent performance and engagement improvements, both of these metrics have improved by 20 percent.

Last but not least migrating to React was also great for the developers: less duplicated code, 
a single language on client and server and a large developer community Imad was definitely happy to be a part of.


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
Color contrast issues, no or bad alt text for images and no related label for input fields are very common issues pa11y reports on.
Pa11y-ci can be used to integrate it with your CI and can break the build when there are errors.

Next, there are some extra steps that can be taken.
The most expensive one is getting an external audit to get more feedback.
They have people that test with voice control, keyboard only mode, text to speech and other tools.
A cheaper option is to do customer research and user testing with users with various disabilities.
Instead of having other people doing the testing, you could learn how to use the tools for people with disabilities yourself.
This is of course the cheapest option.
A MacBook for example already has a lot of tools built in for people with disabilities!

****


## Day 2 afternoon

### Nikita Baksalyar: Exploring the P2P world with WebRTC & JavaScript

<span class="image left"><img class="p-image" alt="Nikita Baksalyar" src="/img/js-conf-budapest-2017/speaker-nikita.jpg"></span>

You can find Nikita on Twitter using the handle [@nbaksalyar](https://twitter.com/nbaksalyar).
A similar presentation as the one given at JSConf can be found [here](https://www.slideshare.net/nbaksalyar/exploring-decentralized-networks-with-webrtc).


<blockquote class="clear"><p>
Nikita Baksalyar is a Software Engineer at MaidSafe. During his talk he explained how we could use newer and not so new technologies to decentralize the web to its former state.
</p></blockquote>

The Web becomes increasingly centralized. We trust our private data to be stored in data centers despite news about data leaks. We exchange our messages and they are handled to three-letter agencies without you knowing about it. Can we do better and return the Web to its decentralized roots? A combination of proven and emerging technologies like WebRTC can help us.

##### What is WebRTC?

Whenever you visit a webpage, you'd typically enter a web address or click a link to view a page. A request is made to the server and that server responds provides the webpage you've requested. The key here is that you make an HTTP request to a locatable server and get a response back. 
Let's say that you want to do a video chat with mom. Mom's computer is probably not a webserver, so how will she receive my audio and video data? Enter WebRTC.

WebRTC stands for web real-time communications. It is a very exciting, powerful, and highly disruptive cutting-edge technology and standard. WebRTC leverages a set of plugin-free APIs that can be used in both desktop and mobile browsers, and is progressively becoming supported by all major modern browser vendors.

The primary benefit of WebRTC is real-time peer-to-peer audio and video communication. In order to communicate with another person (i.e., peer) via a web browser, each person’s web browser must agree to begin communication, know how to locate one another, bypass security and firewall protections, and transmit all multimedia communications in real-time.

##### Decentralized networks

When you think of networks you immediatly start thinking of network providers, hubs and the likes. We are moving away from the initial idea of the internet, which was supposed to be a decentralized network. Now what is a decentralized network? A good example of a decentralized network is BitCoin. Data is shared over multiple nodes and those nodes get updated by sending update events.

#### The way forward

The Internet started as a way to have data spread across the world to make sure that in case of a disaster, natural or human made, data would be preserved.
Peer 2 Peer communication is key in both a decentralized and the internet of old. We are making moves towards this redecentralization with the power of WebRTC and other more commonly known technologies such as BitTorrent for filesharing, Distributed git for code, etc.

****

### Vaidehi Joshi: Goldilocks And The Three Code Reviews

<span class="image left"><img class="p-image" alt="Vaidehi Joshi" src="/img/js-conf-budapest-2017/speaker-vaidehi.jpg"></span>

You can find Vaidehi on Twitter using the handle [@vaidehijoshi](https://twitter.com/vaidehijoshi).
The presentation can be found [here](http://slides.com/vaidehijoshi/better-code-reviews/).

A similar presentation was recorded on RailsConf 2017 and can be found on [YouTube](https://www.youtube.com/watch?v=-6EzycFNwzY).
A detailed write-out of that presentation can be found on [Medium](https://medium.com/@vaidehijoshi/crafting-better-code-reviews-1a5fc00a9312).

<blockquote class="clear"><p>
The original intent behind code reviews was that they would help us take collective ownership in the creation of our software.
In other words, we’d each be stakeholders in our development process by having a hand in controlling the quality of our products.
</p></blockquote>

While code reviews are generally understood as being a necessity to catch problems at the "lowest-value" stages (the time at which the least investment has been made and at which the cost to correct the problem is the lowest), Vaidehi Joshi asks whether they actually work and, if not, how can we try to improve upon the process.
Based on Code Complete by Steve McConnell, she identified 3 major formats of code review:

##### 1. Inspections

Inspections are longer, deeper code reviews that typically catch about 60% of defects in a program.

##### 2. Walkthroughs

A walkthrough is shorter and is usually intended to provide teaching opportunities for senior developers to newer programmers, while giving junior developers the chance to change old methodologies.
Typically, they catch about 20 to 40% of the defects in a program.

##### 3. Short code reviews

Short reviews are faster, but still in-depth. They focus on small changes, including single-line changes, that tend to be the most error-prone.

McConnell’s research uncovered the following about shorter code review:

<blockquote class="clear">
An organization that introduced reviews for one-line changes found that its error rate went from 55 percent before reviews to 2 percent afterward.
A telecommunications organization in the late 80’s went from 86 percent correct before reviewing code changes to 99.6 percent afterward.
</blockquote>

#### But what do developers think of code reviews?

To know this, Vaidehi did a [survey on Twitter](https://twitter.com/vaidehijoshi/status/835597499813494788) and got about 500 responses.
The survey had questions with a scale of 1 to 10, where 1 was strongly disagree and 10 was strongly agree.
These are the stats:

##### The quantitive data

The question "Code reviews are beneficial to my team" had a clear answer.
The average score was around 9 for most languages, with the top 3 containing Swift at an average of 9.46, Ruby at an average of 9.19 and JavaScript at an average of 9.1.
<p class="image"><img src="/img/2017-10-27-js-conf-budapest-day-2/vaidehi-joshi-beneficial.jpeg" alt="Code reviews are beneficial to my team" width="100%"></p>

Another question was "How many pull requests are reviewed", on which the majority answered that all pull request were reviewed.
However, about 10% of the answers indicated that pull requests where only reviewed when someone was explicitly requested to review.
<p class="image"><img src="/img/2017-10-27-js-conf-budapest-day-2/vaidehi-joshi-how-many-pull-request-reviews.jpeg" alt="How many pull requests are reviewed" width="100%"></p>

##### The qualitative data

So, most developers think code reviews are needed and state that all code is being reviewed.
But what do they think of the quality of code reviews?

<blockquote class="clear"><p>
Ultimately, what seemed to make or break a code review experience depended upon two things: how much energy was spent during the review process and how much substance the review itself had.
</p></blockquote>

A code review was bad (and left a bad taste in the reviewer’s and reviewee’s mouth) if there wasn’t enough energy spent on the review, or if it lacked substance.
On the other hand, if a code review process was thorough and time was spent reviewing aspects of the code in a substantive way, it left a much more positive impression overall on both the reviewer and the reviewee.

###### ENERGY

On the question "Who all is doing the review and how much time are they spending on it?", a lot of things could be learned.

* A developer blindly thumbs-up everything or the second or third reviewer is more likely to agree when already seeing an approval.
This makes the code review a formality, which doesn't carry any weight.
* A review is performed different depending on who submits.
Seniors get no feedback, while juniors are picked to death.
The reviews are unfair and can break confidence.
* Commits are too big, which cause long review time, which in turn has a bad effect on future branches/PRs/merges.
Long review times take too much energy, which causes them to be postponed.

###### SUBSTANCE

The question "What exactly is someone saying, doing, or making another person feel while they review their code?" brought these answers.

* A reviewee taking all feedback at face value, having a mentality of "see red squiggle, fix red squiggle".
They just change the code without second thought, as long as it makes the reviewer happy.
* A reviewer's comment is not clearly explained.
The reviewee just has to change their code to the reviewers vision.
* A reviewer is unable to distinguish between stylistic preference and functional difference, which causes nitpicking at syntax.
Multiple reviewers might even have conflicting visions.
* Words matter, an unkind review might break confidence.

#### How can one do better?

<blockquote class="clear"><p>
A bad code review almost made me leave the company. A great code review leaves me feeling better equipped to tackle future projects.
</p></blockquote>

* Use PR templates.
Github provides some default templates for a PR, in which a couple of questions need to be answered short and clearly.
* Include screenshots/gifs, providing more context on what is changed and why.
* Use linters to eliminate style and syntax nitpicking.
* Encapsulating PR's into small packages, aiming for small commits.
* Assign specific reviewers, so they may provide valuable input and/or teach or learn something.

#### But even more important

* Review everyone: it's a good horse that never stumbles.
A senior developer is not infallible and might even be overconfident.
* Develop empathy: call out the good stuff, too.
Make people feel less vulnerable, push for a culture that values vulnerability — both in actions and in words.
* Most importantly, iterate: start a conversation when feeling that the code review flow doesn't work well.
Give everyone the chance to propose their suggestions.

This survey answer summarized the importance of the last part perfectly:

<blockquote class="clear"><p>
I love code reviews in theory. In practice, they are only as good as the group that’s responsible for conducting them in the right manner.
</p></blockquote>

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
