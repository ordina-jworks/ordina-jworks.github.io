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

TODO vul talk aan

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

**They are aiming at the wrong target!**

#### Wrong target: Cost accounting!
People tend to look at costs & profits.
Local performance targets are viewed as extremely valuable, such as keeping head count as low as possible.
#### Right target: Throughput accounting!
The whole business creates value. Identify and resolve bottlenecks. Check lead time and throughput. TODO!

How can we reach the right target?

> "Agile will save us!" - Everyone

The two people still waiting for Godot might help you with this one.
*Agile is no holy grail* and people desperately holding on to the agile transformation will realize this soon enough.

Q: How do we always end up at, "Whatever we did was okay, but somehow it stopped working"?

A: Some things are just inevitable:
* Degradation
* Dysfunction
* Expiry

However, these also stimulate positive change: Degradation stimulates maintaining, transforming TODO check
dysfunction stimulates innovating, challenging and expiry stimulates creating, starting over.

Why?

* Change drives the need to adapt
* Interdependency drives the need to collaborate
* Imperfection drives the need to iterate

These are the drivers of Agile and Lean methods!

What are our options?

SWARM!

**S**caling
**W**ithout
**A**
**R**eligious
**M**ethodology

> religion (n): The structures, constraints and rituals we humans accrete around a kernel of faith because we crave answers and we fear uncertainty. - Dan North

The table stakes are:

* Education
* Practice
* Time: 3-5 years to have an impact
* Investment
* Influence: we need to reach up and down in the organization. *Everybody* needs to participate.
* Communication
* External help: both Amazon Prime and Netflix run on AWS. They don't block each other, they learn from each other.
* Leadership: consistent, invested, resilient

These are based on simple principles:
* People are basically good. "Everyone is trying to help". Assume this is always true.
* Sustainable flow of value is the goal. We need to learn new metrics and techniques.
* Theory of Constraints: one constraint at a time.

1) Visualize -> stabilize -> optimize!
2) Start small, get data
3) Learn from mistakes, iterate
=> This is all of it

### Summing it up
* Don't be fooled! It's easy to believe that this time will be different.
* You can't defeat the universe. Mastery is understanding how to work within the grain. That means adapting, iterating and combining techniques for your context and the changes around you.
* There is no magic formula!
* ... TODO check

## Seven (plus/minus two) ways your brain screws you up - Joseph Pelrine & Jasmine Zahno

<span class="image left"><img class="p-image" alt="Joseph Pelrine" src="/img/craft-conf-2018/Joseph-Pelrine.png"></span>
<span class="image left"><img class="p-image" alt="Jasmine Zahno" src="/img/craft-conf-2018/Jasmine-Zahno.jpg"></span>
[Joseph Pelrine](https://twitter.com/josephpelrine){:target="_blank"} is a senior certified Scrum Master Practitioner and Trainer as well as one of Europe's leading experts on eXtreme Programming.<br><br>
[Jasmine Zahno](https://twitter.com/jasminezahno){:target="_blank"} is an agile coach who is passionate about the people side of product development. Her master’s degree in organisational psychology uniquely qualifies her to deal with the human issues that arise when the agile paradigm collides with traditional organisational structures.

Men find women who were red to be more attractive. Men actually don't realize this.
A woman in red also triggers an exceptional reaction in other women.
These women tend to react more aggressive towards women who wear red.
Also, men who carry a guitar are found more attractive than men who carry a tennis racket.

FACT: We use *more* than 10% of our brain. Even when we sleep, we use more.

### What is willpower?
It's the ability to resist short-term temptation in order to meet long-term goals.
Each day, we make 227 choices. These are all chances to follow your long-term goals.
This has absolutely nothing to do with your academic abilities and everything with willpower.

*Willpower determines academic successes over intelligence.*

#### Willpower deteriorates!
After multiple choices that required willpower, your willpower will start deteriorating and you will start making worse decisions.
This is actually something that supermarkets use.
The fruit and vegetables aisles are always presented to you first whilst you pass the sugary items right before checkout, when your willpower is at its lowest.

#### How to boost your and your team's willpower?
* Establish motivation - for example, align the action items in a retrospective to the team's motivations
* Focus on one goal at a time
* Be authentic
* Express your emotions - hiding your emotions deteriorates your willpower
* Physical exercise - for example during a retrospective
* Eat regularly - for example, foresee fruit instead of Snickers to keep up the willpower
* Mindfulness practices

### Relative estimating =/= estimating!
Social compliance is very important during planning poker.
See the example of the five subjects to say which lines are the same length.
Among these five people there is one actual test subject while the other 4 are deliberately giving the wrong answer.

### Seven plus/minus two
Google! TODO

The way the Product Owner formulates the story has a big impact on how it is estimated.
Let's say for example that a car had an accident.
The following five words that were used in the experiment gave a different result:
* Collided - 2
* Bumped - 3
* Contacted - 5
* Hit - 4
* Smashed - 1

### We are not good psychologists
The Monty Hall problem!
The Dunning-Kruger effect: the less intelligent a student was, the smarter they thought they actually were.

#### Working in teams
We have the tendency to overemphasize personal characteristics and ignore situational factors when judging others' behaviour.
* When we are late, it's because we have a good excuse
* When a team member is late, he was probably just lazy

#### IKEA effect
We have the tendency to overvalue the things we build ourselves.
One example here is using pancake mix. These mixes didn't sell properly until people were actually required to add their own set of eggs to the mix.

Tuchman model?? TODO

## Designing a high-performing team - Alison Coward

<span class="image left"><img class="p-image" alt="Alison Coward" src="/img/craft-conf-2018/Alison-Coward.jpeg"></span>
[Alison Coward](https://twitter.com/alisoncoward){:target="_blank"} is the founder of Bracket and author of “A Pocket Guide to Effective Workshops”. She is a strategist, trainer and workshop facilitator. With over 15 years of experience of working in, leading and facilitating creative teams, Alison is passionate about finding the perfect balance between creativity and productivity.

Team work today is cross-functional and self-organizing.
AirBnB for example has core teams and expand the team with the necessary expertise when necessary.

A team is made up of multiple individuals which creates a new team culture when putting these teams together.
-- TODO insert image
The team's dynamics also tend to change on the projects.

### Three principles for creating High Performance Teams
1) Can your team learn to work together?
With a fixed mindset you believe that talent is fixed.
However, with a growth mindset, you believe that anyone can improve with practice and persistence. See the value of continuous learning.
These teams were more successful and perform much better.
They challenge each other and learn together. -> Can ??? TODO

2) What new way (??) of working can be created to work together?
Design approach. Designing a way of working that works for that team!

3) How will you and your team start to work differently?
Behaviour change and building new team habits.

### Two factors for effective teams
1) Communication
2) Trust

How you work together is more important than what you're working on and who you are working with.

#### MIT Human Dynamics Lab
The most effective teams:
* Communicate frequently
* Talk and listen in equal measure
* Engage in frequent informal communication
* The conversations are dynamic

#### Google's project Aristotle
* Impact of work
* Meaning of work
* Structure and clarity
* Dependability
* Psychological safety

#### Self-awareness
95% of us think we are self-aware, while actually only 10-15% is!

Self-awareness exercise:
* What time do you naturally wake up?
* When are your most productive hours?
* When do you get your best ideas?
* What does your ideal work day look like?

Project kickoff
1) Share team expertise
2) Clarify the roles
3) Talk about how you will work together

### Organize better meetings and workshops
Make your meetings count!
* What is the purpose of the meeting?
* What is the best format of the meeting? How long do we need? Do we need to split up the meeting?
* Set meeting rhythms

See Amazon's two pizza teams:
If a team is too large to be fed by two pizza's, then the team is just too large.

Google Ventures Anxiety Parties TODO

Asana's no meeting Wednesdays TODO

#### Take inspiration from workshops
Great workshops have the following in common:
* Collaboration
* Creativity
* Equal contribution
* Good content
* Clarity (on what needs to be done)
* Motivation

Paperclip exercise:
First question: what can you do with a paperclip?
Second question: which idea would make a good business proposition?

Ideas -> Decisions TODO afbeelding
Divergent thinking & convergent thinking

Productive conflict and avoid group thinking! Make sure everybody gets heard!

Pixar's braintrust TODO

Equal contributions are very important! Introverts & extroverts

Don't forget about check-in rounds! Use the first five minutes of a meeting to ask a personal question.

Balance individual working and collaboration!

### Team habits
How do you change behaviour?
* Start small!
One step at a time. For example putting on gym clothes on a regular basis.
* "Implementation intention": make a plan!

Design -> Test -> Iterate -> Repeat TODO image

### Starting a new High Performance Team
* Determine how you meet
* Determine how you share ideas - see Etsy's sharing mistakes - culture of trust!
* Social times - for example FIKA
* Alone time

### Summary
* Team work is changing
* Growth mindset, design approach and behaviour change
* Make your meetings count
* Build a 'workshop culture'
* Create better team habits

## Estimates or NoEstimates: Let's explore the possibilities - Woody Zuill

<span class="image left"><img class="p-image" alt="Woody Zuill" src="/img/craft-conf-2018/Woody-Zuill.png"></span>
[Woody Zuill](https://twitter.com/woodyzuill){:target="_blank"} has been programming for 30+ years and works as an Agile Coach and Application Development Manager. He and his team are the originators of the Mob Programming approach to teamwork in software development and he is considered one of the founders of the "#NoEstimates" discussion.

The first part of Woody's talk is about his own personal experiences.
He was involved in a project that included over 200 developers.
He concluded that the same 'lesson learned' kept popping up after each iteration: 'Our estimates need to be better!'
It was always the same lesson learned, there was never any improvement.

Woody's suggestion was very simple: how about working with no estimates?

The tweet that started it all in 2012:
TODO screenshot of tweet

What is an estimate?
Working definition: a guess of an amount of time ... TODO

We use estimates to help us make decisions and spark a conversation (to ultimately make a decision).

Why is it that we want control and certainty over time and cost?
We don't need help to make decisions, we need help to make *good* decisions.

Is 'on time' and 'on budget' a good measure of the results of our decision?

> Fear of losing control is a great barrier for change.

> "Alternative to estimates: do the most important thing until it ships or until it is no longer the most important thing." - Kent Beck

> "" - Martin Fowler

> "" - Michele McCarthy

"Estimates presuppose a solution" PANCHAL?

Most of the things that can't be measured are the most important ... ? TODO

What our project really is:
TODO Jackson Pollock image
Edges are blurry and project is messy

Rather than size and smallness, look for the following qualities:
* Potentially valuable
* Understandable
* Cohesive chunk of stuff
* Distinct
-> These don't require estimates!

The Twelve Calculations example:
* 80% of the use of the app comes from 20% of the features
* 80% of the use of a feature comes from 20% of the .. ? TODO

Let's try to have small, inexpensive attempts at delivering value.
This is what being agile is all about!

The object isn't to make art ... TODO

Let's learn to control our urge to control things.

