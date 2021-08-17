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
You came here to look at the stupid arguments I wrote for defending legacy and on-premise solutions.
Unfortunatly, I have to disappoint you already.
The title was indeed to trigger your interest.
This article will however provide you with some battle tested answers to common reasons "not to go to the cloud".
It will provide you with a strategy to counter common misconceptions for why the cloud "isn't right for this project". 

So if you're working on a project and think you might benefit from moving to the cloud, but are hitting walls of reasons not to do it, hang on tight because you might get some comebacks to counter the arguments.

This blog will discuss the following 5 common scenarios which are used as reasons not to go to the cloud: 

We can't use the cloud because audit said we can't.
We can't use the cloud because it's too expensive
We can't use the cloud because it's not secure
We can't use the cloud because we're not the size of Netflix
This works fine, why bother?

## We can't use the cloud because audit said we can't

This is probably one of the most common reasons in the wild. 
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
- Who is allowed to perform which actions and even more important which roles separation needs to exist?
- Which controls need to be in place and how they would like to seem them implemented?
- What measures need to be in place to prevent which scenarios?
- Which public cloud services meet the requirements out-of-the-box and which need additional measures?

Make sure to include them in your journey towards the cloud and ask them about what they require additionally while you are moving workloads.
Having them onboard from the get go makes it a lot easier to have them buy-in into the solution instead of disapproving certain things afterwards.

It also helps to get people with extensive knowledge about your cloud provider to talk to the auditors.
They have an overview of what features are already available in the services and even which features are on the roadmap to be implemented.

As an example, infrastructure changes need to be logged, audited and stored in a non-changeable way. 
On Microsoft Azure, this is already available through the Activity Logs which are provided out of the box.

## We can't use the cloud because it's too expensive

This one actually originates from a lot of horror stories about companies moving to the cloud and forgetting about the cloud bill at the end of the month. 
Or some hacker got access to the account and started spinning up expensive machines to mine bitcoins.
There are multiple examples small and not so small companies having experienced this: [Tesla](https://arstechnica.com/information-technology/2018/02/tesla-cloud-resources-are-hacked-to-run-cryptocurrency-mining-malware/), [Announce](https://blog.tomilkieway.com/72k-1/) and [Adobe](https://www.teampay.co/insights/manage-cloud-costs/)

To get started, the cloud isn't for free, eventhough a lot of provider will give you some `free` resources every month.
It's still a service that you're using and there will be a bill for it at the end of the month. 
But it's not a reason to stay away from the cloud, quite the opposite. 

## How to tackle this scenario

The approach here differs somewhat compared to your starting scenario.

The easiest way to counter this argument is of course to show that the public cloud is less expensive than the current platform. 
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

A second scenario is when there isn't an application yet or it's not `live` yet. 
This makes it harder to estimate how much resources you'll need ofcourse.
On the other hand, it will allow you to create solutions which use more integrated solutions from the public cloud provider.
These solutions are often more tightly integrated, but can also save you a lot of money because they are easier to operate and faster to build compared to traditional solutions. 
As most companies only have bare metal machines, a VM or container platform on-premise, the higher level solutions can provide better operational abstractions and a lower cost of operating them.
Especially when you have a fully managed runtime like Google Cloud Run, AWS Lambda or Azure Functions.
With these solutions you only provide the running code and the cloud provider actually operates the application.

In both scenarios, the key to success in comparing public cloud against other options is to look at the so called Total Cost of Ownership (TCO). 
This means you don't only include the actual bill at the end of the month but also the cost of managing, operating and developing solutions on the platform you choose, including the headcount of the solutions. 

Another important practise to safeguard your cloud cost is to actively monitor them. 
Every major cloud provider allows you to set specific alerts for consumption. 
They even provide you with recommendations about sizing of resources and getting discounts based on sustained usage of example.
Setting these thresholds based on expected or budgetted amounts and acting when they are breached, should provide you with a good method to managing your cloud spends and prevent unexpected costly bills at the end of the month.

## We can't use the cloud because it's not secure

This is one of my favorite ones, because it can be both very valid and a totally bogus reason not to use the cloud.
To get the easy stuff out first, don't use public cloud if you have the following requirements: 

- You need to be air-gapped 

And that's about all the valid reasons, security wise.

It's a common misconceptions that the public cloud isn't as secure as your own datacenter.
It's commonly told that it's more secure to run software applications behind the firewall within an organisation because the organisation owns all the moving parts.
Looking at the multitude of security certifications that all mayor cloud providers have, it's a pretty bold statement to claim that an organisation would be more secure compared to public cloud. ([Azure compliance](https://docs.microsoft.com/en-us/azure/compliance/), [AWS](https://aws.amazon.com/compliance/programs/), [Google](https://cloud.google.com/security/compliance/offerings))
I'd personally argue that most cloud providers are an order of magnitude more secure than most on-premise datacenters. 
For every security role in your organisation, they probably have dozens. 
Just because it doesn't run in your datacenter, doesn't mean that it's less secure. 

As with the audit requirements, talking to your security people up front is key here. 
Make sure that you understand their concerns and see how you can provide the right level of trust in the public cloud solution. 
Ask them which security requirements you need to fulfill and check if and how the cloud provider fulfills them. 
If you're already live with an on-premise solution, make sure to make the comparison with the current solution. 
You'll often find that the cloud provides more secure features and that especially auditability of these features is a lot easier compared to the on-premise solutions. 

Lastly, create a set of known good configurations for the services you want to use. 
For example, if your organisation requires data at rest is encrypted with your own key, create automation scripts or runbooks on how to configure that service in a way that is compliant with the security requirements. 
Creating governance policies (E.g. on [Azure](https://docs.microsoft.com/en-us/azure/governance/policy/overview)) which are validated on the entire platform might help with proving that you're in fact working securily. 
Due to the level of automation that's possible on the cloud and the integration options between the different solutions there are quite a lot of scenarios where the public cloud is actually more secure than an on-premise solution. 

## We can't use the cloud because we're not the size of Netflix

This reason actually covers more than the title might lead you to believe. 
Some companies argue that the public cloud is not for them as they only need some small applications. 
One could actually argue that the opposite is true.
For many of the large "internet age" companies, it makes more sense to invest in their own infrastructure instead of paying public cloud providers literal millions each month to host their applications. 

Important to note is that cloud providers offer way more services than just plain compute capabilities also known as Virtual Machines (VMs). 
They offer a magnitude of managed services, most of them targetted at reducing the operational overhead and therefor cost, for their customers. 
Even if your requirement is to have plain vanilla VMs with some software you're licensing, chances are high that a managed or packaged version is available on the cloud providers marketplace.

So public cloud actually makes a lot of sense for a very wide range of customers. 
If you're a small SME that basically needs some compute resources to run some licensed software, they have got you covered.
If you're a startup looking to leverage ready to use building blocks and focus as much as possible on your added value and not on operational complexity, they've got you covered.
If you're a large coorperation that wants to reduce their TCO of owning, managing and operating their on-premise solutions, they've got you covered.

I'd actually argue that the size of the organisation doesn't really dictate if you can move to the cloud, it's the culture and people.
Using the public cloud requires a slightly different and less silod mindset in the organisation. 
Most of the time, you'll get end-to-end responsibility and access to the components that you need in the cloud. 
This provides you with the flexibility to create the solution that fits you best, but it also means that there is no other team that will maintain or operate the resources you're using.
Almost always, this freedome heavily outways the additional "management" of the resources and if it's too much management, you probably need to look into one of the managed solutions offered by your cloud provider as a replacement for the resources you're using. 

## This works fine, why bother?


<!-- We can't use the cloud because it's just a hype. We've got everything we need and are fast and flexible on our current solution. -->


## Conclusion

- Talk to people
- Find project / efforts in your company that have already moved to tried to
- Don't accept NO as a valid response, ask what needs to be in place to allow it

Reasons
- You need to be air-gapped
- You have very specialised hardware requirements
- You have extremely low latency on-premise interactions