---
layout: post
authors: [pieter_vincken]
title: '5 Reasons not to go to the cloud'
image: /img/2021-08-01-5-reasons-not-to-go-to-the-cloud/intro.jpeg
tags: [cloud, technical leadership, architecture]
category: Leadership
comments: true
---

You were triggered by the title, weren't you. 
You came here to look at the stupid arguments I wrote for defending legacy solutions.
Unfortunatly, I have to disappoint you already.
The title was indeed to trigger you interest.
This article will however provide you with some battle tested answers to common resources "not to go to the cloud".
It will provide you with a strategy to counter common incorrect ideas for why the cloud "isn't right for this project". 

So if you're working on a project and think you might benefit from moving to the cloud, but are hitting walls of reasons not to do it, hang on tight because you might get some comebacks to counter the arguments.

This blog will discuss the following 5 common scenarios which are proposed as reasons not to go to the cloud: 

We can't use the cloud because audit said we can't.
We can't use the cloud because it's too expensive
We can't use the cloud because it's not secure
We can't use the cloud because we're not the size of Netflix
We can't use the cloud because it's just a hype. We've got everything we need and are fast and flexible on our current solution.

## We can't use the cloud because audit said we can't

This is probably one of the most common reasons heared in the wild. 
You want to move some workload into a public cloud provider, but someone claims you can't "because audit said we can't".

This is a common misconception in a lot of projects. 
IT audits aren't designed to prevent solutions from being created nor prevent the usage of any existing solution.
They impose a set of requirements that need to be fulfilled in order to comply with external regulations or internal rules.
Simply stating that "public cloud isn't allowed by audit" is therefore a gross overstatement in a lot of cases. 

### How to tackle this scenario

As with most issue in companies, talking to the right people is paramount to getting something approved or resolved. 
This case is no different. 
Before moving workloads or spinning up resources in the cloud, ask (internal) audit about their requirements. 
Ask questions like the following: 

- What roles and rights would they like to have?
- What reporting information do you need to provide?
- Who is allowed to perform which actions and even more important which roles separation needs to exist.
- Which controls need to be in place and how they would like to seem them implemented.

Make sure to include them in your journey towards the cloud and ask them about what they require additionally while you are moving workloads.
Having them onboard from the get go makes it a lot easier to have them buy-in into the solution instead of disapproving certain things afterwards.


## We can't use the cloud because it's too expensive

This one actually originates from a lot of horror stories about companies moving to the cloud and forgetting about the cloud bill at the end of the month. 
Or some hacker got access to the account and started spinning up expensive machines to mine bitcoins.

To get started, the cloud isn't for free, eventhough a lot of provider will give you some "free" resources every month.
It's still a service that you're using and there will be a bill for it at the end of the month. 
But it's not a reason to stay away from the cloud, quite the opposite. 

## How to tackle this scenario

The approach here differs somewhat compared to your starting scenario.

The easiest way to counter this blocker is of course to show that the public cloud is less expensive as the current platform. 
This can however be quite challenging because you need to have a platform already and the cost of that platform needs to be clear.
All major public cloud providers have an online calculator to estimate your costs based on your usage patterns. 
So if you're in the position to input this information, this should provide you with a good estimate of the actual cost.
Being able to calculate the cost of the current platform is probably the harder part.
If you have internal cost centers, using those might be a good start if they reflect the real cost.
In some companies the cost of the platform might actually be paid for by some central IT budget and isn't really available to the different projects. 
If this is the case, try to ask the central deparement to provide you with some rough numbers or make a best effort estimation yourself based on the budget, headcount and your own footprint in the platform. 
Make sure to include the head count in the calculation of the platform as this is often forgotten when making these comparisons. 
And finally, if you're in this situation and your are looking at a cloud provider, don't forget to take the opportunity to look at replatforming or re-architecting your solution. 
It might seem obvious, but costs could be heavily reduced by looking into managed solutions for existing components and since you're changing anyway, you might as well invest in optimizing the solution. 

A second scenario is when there is not application yet.
This makes it harder to estimate how much resources you'll need ofcourse.
On the other hand, it will allow you to create solutions which use more integrated solutions from the public cloud provider.
These solutions often are more tightly integrated, but can also save you a lot of money because they are easier to operate and faster to build compared to other solutions. 
As most companies only have bare metal machines, a VM or container platform on-premise, the more high levels solutions can provide better operational abstractions and a lower cost of operating them.

In both scenarios, the key to success in comparing public cloud against other options is to look at the so called Total Cost of Ownership (TCO). 
This means you don't only include the actual bill at the end of the month but also the cost of managing, operating and developing solutions on the platform you choose. 

Another way to safeguard your cloud cost is to actively monitor them. 
Every major cloud provider allows you to set specific alerts for consumption. 
They even provide you with recommendations about sizing of resources and getting discounts based on sustained usage of example.

## We can't use the cloud because it's not secure

This is one of my favorite ones, because it can be both very valid and a totally bogus reason not to use the cloud.
To get the easy stuff out first, don't use public cloud if you have the following requirements: 

- You need to be air-gapped

And that's about all the valid reasons, security wise.

It's a common misconceptions of the public cloud is that it's not as secure as your own datacenter.
It's commonly told that it's more secure to run software applications behind the firewall within an organisation as that's more secure. 
And in most cases this is indeed valid. 
But that doesn't mean that public cloud cannot be made as secure as the on-premise solution, just because it doesn't run in your datacenter.

As with the audit requirements, talking to your security people up front is key here. 
Make sure that you understand their concerns and see how you can provide the right level of trust in the public cloud solution. 
I'd personally argue that most cloud providers are an order of magnitude more secure than most on-premise datacenters. 
All major cloud providers are certified according to industry standards.
For every security role in your organisation, they probably have dozens. 

Due to the level of automation that's possible on the cloud and the integration options between the different solutions there are quite a lot of scenarios where the public cloud is actually more secure than an on-premise solution. 

## We can't use the cloud because we're not the size of Netflix

This reason actually covers more than the title might lead you to believe. 
Some companies argue that the public cloud is not for them as they only need some small applications. 
One could actually argue that the opposite is true.
For many of the large "internet age" companies, it makes more sense to invest in their own infrastructure instead of paying public cloud providers literal millions per month to host their applications. 

Important to note is that cloud providers offer way more services than just plain compute capabilities aka VMs. 
They offer a magnitude of managed services most of them targetted at reducing the operational overhead and therefor cost, of their customers. 
Even if your requirement is to have plain vanilla VMs with some software you're licensing, chances are high that a managed or packaged version is available on the cloud providers marketplace.

So public cloud actually makes a lot of sense for a very wide range of customers. 
If you're a small SME that basically needs some compute resources to run some licensed software, they have got you covered.
If you're a startup looking to leverage ready to use building blocks and focus as much as possible on your added value, they've got you covered.
If you're a large coorperation that wants to reduce their TCO of owning, managing and operating their on-premise solutions, they've got you covered.

I'd actually argue that the size of the organisation doesn't really dictate if you can move to the cloud, it's the culture and people.
Using the public cloud requires a slightly different and less silod mindset. 
Most of the time, you'll get end-to-end responsibility and access to the components that you need in the cloud. 
This provides you with the flexibility to create the solution that fits you best, but it also means that there is no other team that will maintain or operate the resources you're using.
Almost always, this freedome heavily outways the additional "management" of the resources and if it's too much management, you probably need to look into one of the managed solutions offered by your cloud provider as a replacement for the resources you're using. 

## It works fine, why bother?

<!-- We can't use the cloud because it's just a hype. We've got everything we need and are fast and flexible on our current solution. -->


## Conclusion

- Talk to people
- Find project / efforts in your company that have already moved to tried to
- Don't accept NO as a valid response, ask what needs to be in place to allow it

Reasons
- You need to be air-gapped
- You have very specialised hardware requirements
- You have extremely low latency on-premise interactions

<!-- 





As a software engineer, I really enjoy creating applications and solving complex technical problems.
But some years ago, there it suddenly was: I was no longer only a "do-er" but an "oversee-er" as well.
At that point I had received very little formal managerial training, so learning on the job or from mentors was crucial to be successful.
The soft skills I needed for my new role turned out to be more difficult than I initially thought.
One of those difficult soft skills for me was (and often still is) the ability to influence people.
Influencing others is not just about getting them to agree with your point of view or manipulating them to get your way, nor does it involve forcing others to change by using power and control.
It's about noticing what motivates others and using that knowledge to leverage performance and positive results.

Taking up the technical team lead role is not always an easy one.
Often the skills necessary to be a great developer don't translate easily to the role of a technical team lead.
In this post, I will give some tips on how to be an influential technical team lead.

## Have a clear vision
A vision is a clear image of how you see the future.
It’s something that keeps you motivated and excited to do what you do.
A technical team lead must be able to both zoom in and zoom out on a project.
On one hand, you need to be able to look in detail into a technical requirement.
On the other hand, you also need to keep the bigger picture in mind and how the requirement fits into the greater vision.
If you're a technical team lead that has no vision and isn't going anywhere, then how can you expect your team will follow you?
In order to create a vision you can ask yourself questions like "What do you want to achieve?, "Which (tangible) output do you want when achieving your goal?", "How would that output change the way things are done now?", ...
Setting specific goals together with your team that move towards your vision will help you to achieve it.

Once you have that vision and goals, being predictable is key.
By doing so, everybody knows what you're trying to achieve.
The Don’t-Repeat-Yourself principle, which is a key principle for each software engineer, does not apply when working with people.
Communicate your vision and goals over and over again: repetition and predictability are key.

## Be collaborative
A top-down approach where nobody has a say in the process and where both vision and goals are pushed downwards, is very easy for team members to reject.
A different and more sustainable approach is to be a collaborative technical team lead.
This means that you regularly seek out a diversity of opinions and ideas amongst teammates to solve problems.
Involve your team in creating a shared vision, and identify the behaviours necessary to accomplish it.
It's all about getting the team to think through these difficulties themselves instead of telling them what to do all the time.
As a result they are more engaged, feel trusted, and are more likely to take ownership of their work.
Building meaningful relationships is one of the key responsibilities of a technical team lead.

## Practice active listening
We often think about influence as being what we say or how we say it, but improving your listening skills is key to gaining your team's trust and creating psychological safety.
As technical team leads we're often pulled in many directions throughout the day. 
The most common pitfall is that we listen to reply, not to understand.
It's easy to be a passive listener by multitasking and only listening to the highlights. 
While it may seem like you don't have time, making the time to really listen to your team can increase your leadership capacity significantly.
Active listening is the ability to focus completely on your team, understand their message, comprehend the information and respond thoughtfully in a relevant way.
This also includes not only capturing the message, but paying attention to subtle hints and non-verbal communication such as tone, emphasis, facial expressions and body language.
Keep in mind that a true servant leader only speaks about 20 to 30% of the time, the rest should be spent on listening.

When your team members know that they will be heard, they are more likely to openly share their ideas and provide honest feedback.
Knowing how and when to gather knowledge of your team members is important, since you can then synthesize it into a better solution before deciding the course forward.

## Influence others
At a basic level, influence is about compliance.
It is about getting someone to do what you want them to do, it allows you to get things done and achieve desired outcomes.
However, this can never be accomplished by power and control, but only by genuine commitment of other people.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2021-07-06-Influential-tech-lead/planned-behaviour.png' | prepend: site.baseurl }}" alt="Planned Behaviour" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

This simplified diagram is based on "The theory of planned behaviour" by Icek Ajzen, a social psychologist and professor emeritus at the University of Massachusetts Amherst.
His theory assumes that before every Behaviour, there is an Intention.

A simple practical example: you notice a specific behaviour from a software engineer on your team, namely that he/she refuses to write unit tests.
As a technical team lead, you are interested in why he/she formed the intention not to write these unit tests because you're convinced that unit tests have a variety of benefits such as improving of code quality, finding bugs early and facilitating change.

There are three elements that can help us trying to understand why your colleague formed this intention:

- **Attitude a.k.a "Is the behaviour good and is it right?"**:  We're deciding if the behaviour is in our own best interest or if it is the right thing to do. So if we have a positive attitude towards the behaviour, it is more likely that we will perform the behaviour. 
- **Subjective norm a.k.a "What's everyone else doing?"**: We're asking ourselves what others think of the behaviour and how they judge it. If we think that others consider the behaviour to be normal or good, it is more likely that we will perform the behaviour. 
- **Perceived behavioural control a.k.a "Can I do it?"**: When we believe that behaviour is easy to perform, we are more likely to perform the behaviour.

So when you're asking the software engineer on your team to write unit tests, the three elements listed above will cross his mind and he/she will ask himself questions like: "Is it a good thing to write unit tests?", "Is it in my own interest to write unit tests?", "Does everyone write unit tests or is it just me?", "Do I know how to write unit tests and do I have enough information/time to write them?", ...
Targeting each and every one of these elements is the key to success when you want your colleague to start writing unit tests.

So what can you do to influence the other person's thinking?

- **"Is the behaviour good and is it right?"**: Identify what the other person cares about, what he/she thinks is good and what he/she thinks is the right thing to do. For example, your colleague might think it's super important to finish his user story as quickly as possible. The key thing to do here as a technical team lead is not to be manipulative or dishonest, but to genuinely align your goals with his motivations and things he/she already cares about. Writing unit tests facilitates change, provides documentation, and ultimately saves time.
- **"What's everyone else doing?"**: You can present that writing unit tests is an industry standard and not some kind of crazy idea you've just come up with.
Presenting it as a good practice and being able to demonstrate why other successful teams or companies do it, is a good way to help your colleague see that what you're asking him to do is normal in the industry.
- **"Can I do it?"**: If your colleague thinks it is too difficult, he/she will never start writing unit tests. Therefore, present it as a clear and small change, and make it easy for him to do. Offer your support and show examples of good and successful unit tests so he/she gains confidence and knows he/she can do it.

> "The key to successful leadership is influence, not authority." – Ken Blanchard -->
