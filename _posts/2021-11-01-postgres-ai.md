---
layout: post
authors: [pieter_vincken]
title: 'Testing with production data made easy'
image: /img/20211101-postgres-ai/db-lab.png
tags: [cloud, automation, testing]
category: Cloud
comments: true
---

- What's the problem?
- What is postgres ai / dblab
- How does it work?
- Why should I use it?

## What's the problem?

Testing software is a whole dicipline in it's own. 
Writing automated tests has been a best practise for long enough now that we can assume it to be everywhere.
Writing good automated tests is hard, writing software that's testable is even harder. 
Properly combining the two is a challenge for every company and project. 

A trade-off has to be made between investing in writing test code and time. 
As we all know and have seen time and time again, finding this balance is a hard challenge. 
Spending too much time on testing eats into your feature development.
But spending too little time on testing creates more bugs, which leads to incidents which, you guessed it, eats into your feature development budget.

So the ideal world is the one where we can write tests in order to maintain high enough code quality to prevent bugs, but also not writing so many that feature development completely halts. 

Testing data migrations is one of the cases where investing in good testing is crucial but it's really hard to cover all the scenarios and it can be very time consuming to write test code for all of the scenarios you need to cover.
Moreover, if the data quality of your production system isn't a 100% it's very easy to miss a few scenarios in the analysis, which leads to missed migration scenarios which leads to bugs / incidents. 

## What is DBLab?

DBLab is software the allows you to easily and quickly create thin clones of databases.
At the time of writing it only support PostgreSQL databases.
It has been created by Postgres.ai which was founded by Nikolay Samokhvalov.
They are specialised in creating solutions to assist with database management. #TODO

The software exists in 3 parts, their engine, their CLI and a SaaS platform.
This post will mostly discuss the DBLab Engine(DLE). 

### End user interaction

Let's start with what DBLab can ultimately bring you. 

Let's say a developer, Neal, needs a clone of a specific database to perform some testing. 
Performing an export and import from one database to another isn't that hard, especially in PostgreSQL.
You run `pg_dumpall` on the exporting database and just run a `pqsl` with the dump on the importing one and you're done. 
Now imagine that the dataset he's using is not just a few megabytes in size, but consists of 100s of 1000s of rows across a multitude of tables. 
That import is going to take a while, more that just a coffee break, let's say 30 minutes. 
After the import completes, since he's working on a data migration, he run his migration script and we developers aren't perfect, he finds a bug half way through his migration. 
He fixes the bug and wants to run the migration again. 
In order to do that, he needs to re-run the import (provided he kept the export) and restart he's migration.
Again 30 minutes plus his migration time, lost.

This is a scenario where DBLab provides a very nice end-user experience. 
Let's say Neal's company has a DBLab setup for the database he wants to use. 
The same scenario would look like this: 

Neal requests a DBLab clone: `dblab clone create neals-special-clone --username neal --password nealisawesome`. 
This takes seconds to complete. 
Later in this post, we'll discuss how that's possible with so much data.
Next, Neal runs his migration script, as before, it fails halfway through and he needs to fix a bug. 
After the fix, he wants to reset his clone to the original pre-migration state. 
To do this, he simply runs `dblab clone reset neals-special-clone` and it will be resetted to the original state, before the failed migration was executed.
Again just taking seconds to complete. 

## Behind the curtains

The scenario described earlier almost sounds to good to be true, doesn't it. 
In this section we'll discuss how DBLab can achieve this and where the magic happens. 

The magic is mostly done by the use of a [ZFS](https://en.wikipedia.org/wiki/ZFS) filesystem underneath the PostgreSQL instances used by DBLab. 
Specifically the copy-on-write and snapshotting feature are primarily used. 
This is combined with running the instances themselves in Docker containers, which allows multiple PostgreSQL instances to easily exist on a single system. 
More info on the details can be found [here](https://postgres.ai/docs/database-lab#database-lab-engine)

DBLab Engine has 2 operating modes for enabling clones: physical or logical. 

With the physical mode, a replica of the source PostgreSQL database is created and managed by DBLab. 
This database is treated as the `sync instance` from which all copies are created.
The replication can be setup just like any other PostgreSQL replication.

In logical mode, the copy of the original data is achieved by a regular dump (`pg_dumpall`) from the source PostgreSQL instance. 
This dump is `restored` onto a local PostgreSQL install and from there snapshots can be created. 

When a main copy of the source instance is created and managed by DBLab Engine, clone can be created. 
These clones are created by snapshotting the filesystem underneath the main copy. 
Next, a Docker container with a modified PostgreSQL instance is used in combination with a volume bind of the previously created snapshot. 

This results in a seemingly regular PostgreSQL instance running in Docker with some data preloaded in it. 
When executing changes on the database, the copy-on-write feature of ZFS makes sure that the new changes are only made to the snapshot volume that's attached to the clone. 

When a reset is requested on a clone, the snapshot is simply restored to it's original state by ZFS and the PostgreSQL instance is restarted. 

## How to setup

The setup process is actually highly dependant on your starting situation. 
The first choice you'd need to make is if you want to use a physical or logical setup. 

The physical setup has the advantage of being an always online solution. 
This means that the DBLab Engine manages a live (async replication) copy of the source instance you want to clone.
The downside of this approach is that you need to be able to change some configuration on your source instance to setup the replication and that you need to be able to actually create a replicated instance from your source instance. 
For managed PostgreSQL databases provided by cloud providers, this might be an issue. 

Luckily there is a secondary approach available: the logical mode.
In this mode an initial clone is created by dumping the original database to the DBLab instance and restoring it locally onto a main clone instance. 
The advantage here is that you don't need additional configuration on the source instance. 
Unfortunately, due to the nature of the point-in-time copy of the dump, it's not possible to have a really live clone available. 
It also means that the refresh of the clones has a certain downtime associated with it. 

For the example we'll show here, we'll use the logical mode as we're copying from an Azure Database for PostgreSQL managed database. 
All code for the example is available [here](/DEMO CODE #TODO)

## The cool bonus

// Anomization

## Why should I use it?

If you're in a project where access to productive systems is not available and/or testing migration scenarios is very time consuming, this might be a good tool for you to investigate, provided of course that you're using PostgreSQL databases.
It provides an easy, scalable and safe way to provide copies of large databases without having to wait hours or days to copy over data from one database to the next in order to test something. 

The software is opensourced on [Gitlab](https://gitlab.com/postgres-ai) and the community on [Slack](https://slack.postgres.ai/) is very helpful and response if you have any questions or issues with the software.

### Links

- [Postgres AI website](https://postgres.ai/
- [Source code](https://gitlab.com/postgres-ai)
- [SaaS offering](https://postgres.ai/docs/platform)
- [Anomization setup](https://postgres.ai/docs/database-lab/masking)

Feel free to reach out to [me](https://www.linkedin.com/in/pieter-vincken-a94b5153/){:target="_blank" rel="noopener noreferrer"} or directly to lovely people of Postgres.ai if you want to look into this solution. 

----------------


- [We can't use the cloud because audit said we can't.](#we-cant-use-the-cloud-because-audit-said-we-cant)
- [We can't use the cloud because it's too expensive](#we-cant-use-the-cloud-because-its-too-expensive)
- [We can't use the cloud because it's not secure](#we-cant-use-the-cloud-because-its-not-secure)
- [We can't use the cloud because we're not the size of Netflix](#we-cant-use-the-cloud-because-were-not-the-size-of-netflix)
- [This works fine, why bother?](#this-works-fine-why-bother)

## We can't use the cloud because audit said we can't

This is probably one of the most common reasons in the wild. 
You want to move some workload into a public cloud provider, but someone claims you can't "because audit said we can't".

This is a common misconception in a lot of projects. 
IT audits aren't designed to prevent solutions from being created nor prevent the usage of any existing solution.
They impose a set of requirements that need to be fulfilled to comply with external regulations or internal rules.
Simply stating that "public cloud isn't allowed by audit" is, therefore, a gross overstatement in a lot of cases. 

### How to tackle this scenario

As with most issues in companies, talking to the right people is paramount to getting something approved or resolved. 
This case is no different. 
Before moving workloads or spinning up resources in the cloud, ask (internal) audit about their requirements. 
Ask questions like the following: 

- What reporting information do you need to provide?
- Who is allowed to perform which actions, and even more important, which roles separation needs to exist?
- Which scenarios need to be covered by controls?
- What measures need to be in place to prevent which scenarios?
- Which public cloud services meet the requirements out-of-the-box and which need additional measures?

Make sure to include them in your journey towards the cloud and ask them about what they require additionally while you are moving workloads.
Having them on board from the get-go makes it a lot easier to have their buy-in into the solution instead of disapproving certain things afterwards.

It also helps to get people with extensive knowledge about your cloud provider to talk to the auditors.
They have an overview of what features are already available in the services and even which features are on the roadmap to be implemented.

As an example, infrastructure changes need to be logged, audited, and stored in a non-changeable way. 
On Microsoft Azure, this is already available through the Activity Logs which are provided out of the box.

## We can't use the cloud because it's too expensive

This one actually originates from a lot of horror stories about companies moving to the cloud and forgetting about the cloud bill at the end of the month. 
Or some hacker got access to the account and started spinning up expensive machines to mine bitcoins.
There are multiple examples small and not so small companies having experienced this: [Tesla](https://arstechnica.com/information-technology/2018/02/tesla-cloud-resources-are-hacked-to-run-cryptocurrency-mining-malware/){:target="_blank" rel="noopener noreferrer"}, [Announce](https://blog.tomilkieway.com/72k-1/){:target="_blank" rel="noopener noreferrer"} and [Adobe](https://www.teampay.co/insights/manage-cloud-costs/){:target="_blank" rel="noopener noreferrer"}.

To get started, the cloud isn't for free, even though a lot of providers will give you some `free` resources every month.
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
In some companies, the cost of the platform might actually be paid for by some central IT budget and isn't really available to the different projects. 
If this is the case, try to ask the central department to provide you with some rough numbers or make a best-effort estimation yourself based on the budget, headcount and your own footprint in the platform. 
Make sure to include the headcount in the calculation of the platform as this is often forgotten when making these comparisons. 
And finally, if you're in this situation and you are looking at a cloud provider, don't forget to take the opportunity to look at re-platforming or re-architecting your solution. 
It might seem obvious, but costs could be heavily reduced by looking into managed solutions for existing components and since you're changing anyway, you might as well invest in optimizing the solution. 

A second scenario is when there isn't an application yet or it's not live yet. 
This makes it harder to estimate how many resources you'll need of course.
On the other hand, it will allow you to create solutions that use more integrated solutions from the public cloud provider.
These solutions are often more tightly integrated, but can also save you a lot of money because they are easier to operate and faster to build compared to traditional solutions. 
As most companies only have bare metal machines, a VM or container platform on-premise, the higher-level solutions can provide better operational abstractions and a lower cost of operating them.
Especially when you have a fully managed runtime like Google Cloud Run, AWS Lambda or Azure Functions.
With these solutions, you only provide the running code and the cloud provider actually operates the application.

In both scenarios, the key to success in comparing public cloud against other options is to look at the so-called Total Cost of Ownership (TCO). 
This means you don't only include the actual bill at the end of the month but also the cost of managing, operating and developing solutions on the platform you choose, including the headcount of the solutions. 

Another important practice to safeguard your cloud cost is to actively monitor them. 
Every major cloud provider allows you to set specific alerts for consumption. 
They even provide you with recommendations about sizing of resources and getting discounts based on sustained usage for example.
Setting these thresholds based on expected or budgeted amounts and acting when they are breached, should provide you with a good method to managing your cloud spends and prevent unexpected costly bills at the end of the month.

## We can't use the cloud because it's not secure

This is one of my favourite ones because it can be both very valid and a totally bogus reason not to use the cloud.
To get the easy stuff out first, don't use the public cloud if you have the following requirements: 

- You need to be air-gapped 

And that's about all the valid reasons, security-wise.

It's a common misconception that the public cloud isn't as secure as your own data center.
It's commonly told that it's more secure to run software applications behind the firewall within an organisation because the organisation owns all the moving parts.
Looking at the multitude of security certifications that all major cloud providers have, it's a pretty bold statement to claim that an organisation would be more secure compared to public cloud ([Azure compliance](https://docs.microsoft.com/en-us/azure/compliance/){:target="_blank" rel="noopener noreferrer"}, [AWS](https://aws.amazon.com/compliance/programs/){:target="_blank" rel="noopener noreferrer"}, [Google](https://cloud.google.com/security/compliance/offerings){:target="_blank" rel="noopener noreferrer"}).
I'd personally argue that most cloud providers are an order of magnitude more secure than most on-premise datacenters. 
For every security role in your organisation, they probably have dozens. 
Just because it doesn't run in your data center, doesn't mean that it's less secure. 

As with the audit requirements, talking to your security people upfront is key here. 
Make sure that you understand their concerns and see how you can provide the right level of trust in the public cloud solution. 
Ask them which security requirements you need to fulfil and check if and how the cloud provider fulfils them. 
If you're already live with an on-premise solution, make sure to make the comparison with the current solution. 
You'll often find that the cloud provides more security features and that especially auditability of these features is a lot easier compared to the on-premise solutions. 

Lastly, create a set of known good configurations for the services you want to use. 
For example, if your organisation requires data-at-rest to be encrypted with your own key, create automation scripts or runbooks on how to configure that service in a way that is compliant with the security requirements. 
Creating governance policies (E.g. on [Azure](https://docs.microsoft.com/en-us/azure/governance/policy/overview){:target="_blank" rel="noopener noreferrer"}) which are validated on the entire platform might help with proving that you're in fact working securely. 
Due to the level of automation that's possible on the cloud and the integration options between the different solutions, there are quite a lot of scenarios where the public cloud is actually more secure than an on-premise solution. 

## We can't use the cloud because we're not the size of Netflix

This reason actually covers more than the title might lead you to believe. 
Some companies argue that the public cloud is not for them as they only need some small applications. 
One could actually argue that the opposite is true.
For many of the large "internet age" companies, it makes more sense to invest in their own infrastructure instead of paying public cloud providers literal millions each month to host their applications. 

Important to note is that cloud providers offer way more services than just plain compute capabilities also known as Virtual Machines (VMs). 
They offer a magnitude of managed services, most of them targetted at reducing the operational overhead and therefore cost, for their customers. 
Even if your requirement is to have plain vanilla VMs with some software you're licensing, chances are high that a managed or packaged version is available on the cloud providers marketplace.

So public cloud actually makes a lot of sense for a very wide range of customers. 
If you're a small SME that basically needs some compute resources to run some licensed software, they have got you covered.
If you're a startup looking to leverage ready to use building blocks and focus as much as possible on your added value and not on operational complexity, they've got you covered.
If you're a large corporation that wants to reduce their TCO of owning, managing and operating their on-premise solutions, they've got you covered.

I'd actually argue that the size of the organisation doesn't really dictate if you can move to the cloud, it's the culture and people.
Using the public cloud requires a slightly different and less siloed mindset in the organisation. 
Most of the time, you'll get end-to-end responsibility and access to the components that you need in the cloud. 
This provides you with the flexibility to create the solution that fits you best, but it also means that there is no other team that will maintain or operate the resources you're using.
Almost always, this freedom heavily outweighs the additional "management" of the resources and if it's too much management, you probably need to look into one of the managed solutions offered by your cloud provider as a replacement for the resources you're using. 

## This works fine, why bother?

This question should actually be the first one that should be asked by every manager when a potential move to anywhere (not just the public cloud) comes up.
"What's in it for me?"
This question can be answered with all of the above arguments we already discussed, but we'll highlight a couple of opportunities additionally here. 

### Reducing time to market

Being able to react to quickly changing markets and circumstances from a business standpoint is already important today, but it will only become more important in the future. 
Building software solutions that take months or even years before they see the first real usage, isn't the best strategy in 2021 and it will be a terrible strategy soon. 
Companies that can respond quickly to changes and can validate new business ideas quickly will win the markets. 
The public cloud can help here as well. 
Since it offers a lot of managed solutions that can grow over time, it facilitates this testing and validating strategy. 
A simple application can be put live in a matter of days or even hours to validate a business idea. 
When the time comes to scale out the solution, it becomes as easy as allowing your application to scale to the required size and picking up the bill at the end of the month.

### Attracting talent

The public cloud is a hot topic within the software engineering community and there are a lot of people interested in it.
A nice advantage of using the public cloud is that you'll have an easier time attracting highly skilled talent to work on the project.
On-premise solutions are often considered legacy and aren't as attractive to new hires.
The cloud also provides a lot of certification and specialisation tracks, allowing you to effectively find people that have a proper record for using the solutions.

## Conclusion

The key takeaway of this post should be to talk to people.
Ask them why they are opposed to moving to the public cloud. 
Ask them what is needed to be allowed to move, which requirements you need to fulfil and why these requirements are relevant.
Don't accept a plain NO without valid reasoning. 
Try to look for similar projects within your organisation and find out if there are examples of projects that have moved to the public cloud already.
Failing that, look at others like the [Deutsche Boerse](https://deutsche-boerse.com/dbg-en/media/press-releases/Deutsche-B-rse-and-Microsoft-reach-a-significant-milestone-for-cloud-adoption-in-the-financial-services-industry-1540058){:target="_blank" rel="noopener noreferrer"} or [Alphabet International Gmbh](https://www.youtube.com/watch?v=uz4bs9EQA0E){:target="_blank" rel="noopener noreferrer"} that have adopted public cloud as well. 

Feel free to reach out to [me](https://www.linkedin.com/in/pieter-vincken-a94b5153/){:target="_blank" rel="noopener noreferrer"} or any other Ordina colleagues if you want help with starting to adopt the cloud. 