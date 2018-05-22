---
layout: post
authors: [derya_duru]
title: 'Craft Conf 2018'
image: /img/craft-conf-2018/Craft-Conf-2018.png
tags: [Craft Conf, Agile, Scrum, Coaching, Core Protocols, High Performance Teams, Perceived Performance, Estimations, Scaling]
category: Conference
comments: true
---

> [Craft Conf](https://craft-conf.com/){:target="_blank"} is a two day conference in Budapest, aimed at talks surrounding the 'Software as a craftsmanship' idea.
JWorks was present this year on 10 and 11 May and we would love to give you an overview of some of the talks we attended.

<div class="the-toc">

  <h1 class="the-toc__heading">Table Of Contents</h1>
    <li><a href="#power-games-for-high-performance-team-culture-psychological-safety-and-ei---richard-kasperowski" title="Power Games for High-performance Team Culture, Psychological Safety, and EI - Richard Kasperowski">Power Games for High-performance Team Culture, Psychological Safety, and EI - Richard Kasperowski</a></li>
    <li><a href="#perceived-performance-the-only-kind-that-really-matters---eli-fitch" title="Perceived performance: The only kind that really matters - Eli Fitch">Perceived performance: The only kind that really matters - Eli Fitch</a></li>
    <li><a href="#swarming-scaling-without-a-religious-methodology---dan-north" title="SWARMing: Scaling Without A Religious Methodology - Dan North">SWARMing: Scaling Without A Religious Methodology - Dan North</a></li>
    <li><a href="#seven-plusminus-two-ways-your-brain-screws-you-up---joseph-pelrine--jasmine-zahno" title="Seven (plus/minus two) ways your brain screws you up - Joseph Pelrine & Jasmine Zahno">Seven (plus/minus two) ways your brain screws you up - Joseph Pelrine & Jasmine Zahno</a></li>
    <li><a href="#designing-a-high-performing-team---alison-coward" title="Designing a high-performing team - Alison Coward">Designing a high-performing team - Alison Coward</a></li>
    <li><a href="#estimates-or-noestimates-lets-explore-the-possibilities---woody-zuill" title="Estimates or NoEstimates: Let's explore the possibilities - Woody Zuill">Estimates or NoEstimates: Let's explore the possibilities - Woody Zuill</a></li>
  <ol class="the-toc__list">
  </ol>
</div>

****

## Power Games for High-performance Team Culture, Psychological Safety, and EI - Richard Kasperowski

<span class="image left"><img class="p-image" alt="Richard Kasperowski" src="/img/craft-conf-2018/Richard-Kasperowski.jpeg"></span>
[Richard Kasperowski](https://twitter.com/rkasper){:target="_blank"} is a speaker, trainer, coach, and author focused on high-performance teams. Richard is the author of The Core Protocols: A Guide to Greatness. He leads clients in building great teams that get great results using the Core Protocols, Agile, and Open Space Technology.

During this talk, Richard provides an overview of some of the conditions that need to be met for the team to become a high performance team.
In order for this to happen, it's very important that companies realize that they need to focus on getting the right people together instead of focusing on achievements.

A company needs to achieve the best possible team culture. But what does this mean?

### What is culture?

> The collective programming of the mind which distinguishes the members of one group or category of people from another. - Geert Hofstede

Richard talks about 6 different culture dimensions:
* Power distance
* Individualism
* Masculinity
* Uncertainty avoidance
* Long term orientation
* Indulgence

The talk focuses specifically on the power distance dimension.

Power distance entails hierarchy, the gaps between people in the company.
A lot of power distance means a lot of hierarchy.

Next, we did some exercises during the talk with a partner of our choice where one of us was the 'leader'
and the other was the mirror. Naturally, the mirror had to imitate everything the leader did.
For the next exercise one of the two persons was again the leader, but now the other person had to keep
his or her nose at a distance of 10 centimeters from the palm of the hand of the leader at all times.

The last exercise was with a few volunteers from the audience where one person played the CEO, a few people
played the SVPs and some people played the VPs. The CEO stood in the middle of the room and directed the
SVPs, the SVPs directed the VPs. The people who were being directed were again said to keep their noses
at a distance of 10 centimeters from the palm of the hand of the person that directed them.
This was a very interesting exercises and shows that having too much hierarchy and people who direct
other people can lead to chaos when the leaders for example move too fast to be able to follow the directions.

At the core, there are 6 building blocks for high performance teams:
* Positive bias
* Freedom
* Self awareness
* Connection
* Productivity
* Error handling

The Core Protocols provide the functionality to achieve all six building blocks. Hierarchy and power culture erode high performance so
when setting up and trying to maintain a high performance teams, these building blocks are essential.

// TODO vul aan

More info on the Core Protocols can be found [here](https://www.greatnessguild.org/tcp/){:target="_blank"}.



## Perceived performance: The only kind that really matters - Eli Fitch

<span class="image left"><img class="p-image" alt="Eli Fitch" src="/img/craft-conf-2018/Eli-Fitch.jpeg"></span>
[Eli Fitch](https://twitter.com/EliFitch){:target="_blank"} is a frontend developer with a passion for web performance, animation and all things 3D.

When talking about performance, we need to account for both objective time and subjective time.
Usually, we tend to optimize for objective time by using tools like lazy loading.
But how feasible is this?

Even a 20% increase in objective speed is unnoticeable to the user. So we have to aim for an increase of 30% or even more.
Of course this is not easy at all, especially when taking into account that when working with multiple teams (possibly over different time zones),
all the teams have to align on this.

So how do we get the user to perceive an increase on performance?
**We focus on the subjective time!**

### Active vs passive phase:

What does a passive phase entail? Our passive phase kicks in when we are waiting for something to happen,
say for our water to boil. Time spent in passive phases feels ~36% slower!

There are two ways to prevent users from getting bored during a passive phase and keeping them interested
enough to wait:

* Keep users in an active state
* Make passive states feel faster

#### How do we keep users in an active state?
We can implement an optimistic UI. 99% of requests succeed so why not take advantage of this by *first* updating
the UI and only then doing the actual request.

We can also do our best to react as soon as the user signals intent.
For example, why use the onclick event when the onmousedown event exists as it shows intent much earlier?
This will provide you with a nice 100-150 millisecond head start. This is also usable on touch devices.

Using :active animations also buy you more time. An animation that lasts ~200 milliseconds will provide
you with 50 milliseconds extra time keeping the user in an active state.

#### Onto topic two: how to 'unsuck' passive states.
A wait of 1-4 seconds is long enough to lose people's interest.
There are three ways of preventive loss of interest:
* Use the right loading animation
* Adapt the loading scheme to the user
* Use shiny objects!

Uncertain waits feel longer so make sure to use progress bars and loading animations.
For example bands with accelerating bars feel 12% faster!

What about spinners?
> "Meh" - Eli Fitch

* Less than ~1 second wait: Don't indicate loading
* More than ~2 second wait: Use progress bars!

Spinners are only useful between a 1 second and 2 second wait.

Don't forget that most progress bars are fake! This is due to the connection differences between the user's
connection and the backend.
However, we can use adaptive loading. Measure the actual requests done! You do need baseline times to know how
long to *expect* it to run. Of course this needs to be normalized for the resource or payload that needs to load.
Again, adapt the loading scheme to the user that is requesting data. For example, you can check the user's
connection to give him a personally optimized experience.

We can also learn a lot from game developers. Remember FIFA who made you play a mini football game while loading the
game in the background?

### Predictive preloading:
What if we could predict the user's intent?
One easy to setup option is to start loading the app and data in the background when a user has just started entering credentials in a login form.
This quick win will give you a 4 second head start!

Another option is to exploit behavioural quirks:
1) People tend to watch hover animations: Fancy hovers buy you ±600ms extra time
2) People slow down when approaching the target: Load on mouse deceleration!

When combining above two techniques (hover animations + futurelink) we can get a ± 1.5 second head start.
But: **Use predictive preloading wisely!** You *will* get it wrong some of the time. Do some dry runs first and try to mitigate risk by using metrics to improve.

### A quick summary

* Perceived performance is low hanging fruit. You can provide the user with immediate feedback.
* Tailor to individual users
* React at intent
* Introduce predictive loading bit by bit

> At the end of the day, it matters how it *feels*.

Eli also covers this talk on his [website](http://assets.eli.wtf/talks/perceived-perf-talk/){:target="_blank"}.


## SWARMing: Scaling Without A Religious Methodology - Dan North

<span class="image left"><img class="p-image" alt="Dan North" src="/img/craft-conf-2018/Dan-North.jpg"></span>
[Dan North](https://twitter.com/tastapod){:target="_blank"} has been coaching, coding and consulting for over 25 years, with a focus on applying systems thinking and simple technology to solve complex business problems.

Business stakeholders, developers, infrastructure, the project management office and change groups don't understand each other. What are they doing wrong?

> They are aiming at the wrong target!

#### Wrong target: Cost accounting!
#### Right target: Throughput accounting!

## Seven (plus/minus two) ways your brain screws you up - Joseph Pelrine & Jasmine Zahno

<span class="image left"><img class="p-image" alt="Joseph Pelrine" src="/img/craft-conf-2018/Joseph-Pelrine.png"></span>
<span class="image left"><img class="p-image" alt="Jasmine Zahno" src="/img/craft-conf-2018/Jasmine-Zahno.jpg"></span>
[Joseph Pelrine](https://twitter.com/josephpelrine){:target="_blank"} is a senior certified Scrum Master Practitioner and Trainer as well as one of Europe's leading experts on eXtreme Programming. He has had a successful career as software developer, project manager and consultant. His work focuses on social complexity science and its application to Agile processes.<br><br>
[Jasmine Zahno](https://twitter.com/jasminezahno){:target="_blank"} is an agile coach who is passionate about the people side of product development. Her master’s degree in organisational psychology uniquely qualifies her to deal with the human issues that arise when the agile paradigm collides with traditional organisational structures. A firm believer in “inspect and adapt”, she has made it her goal to help organisations create productive and motivating environments that encourage and inspire employees to do their best work.

## Designing a high-performing team - Alison Coward

<span class="image left"><img class="p-image" alt="Alison Coward" src="/img/craft-conf-2018/Alison-Coward.jpeg"></span>
[Alison Coward](https://twitter.com/alisoncoward){:target="_blank"} is the founder of Bracket and author of “A Pocket Guide to Effective Workshops”. She is a strategist, trainer and workshop facilitator. With over 15 years of experience of working in, leading and facilitating creative teams, Alison is passionate about finding the perfect balance between creativity and productivity.

## Estimates or NoEstimates: Let's explore the possibilities - Woody Zuill

<span class="image left"><img class="p-image" alt="Woody Zuill" src="/img/craft-conf-2018/Woody-Zuill.png"></span>
[Woody Zuill](https://twitter.com/woodyzuill){:target="_blank"} has been programming for 30+ years, and works as an Agile Coach and Application Development Manager. He and his team are the originators of the Mob Programming approach to teamwork in software development and he is considered one of the founders of the "#NoEstimates" discussion.