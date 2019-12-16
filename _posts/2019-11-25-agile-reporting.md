---
layout: post
authors: [wouter_nivelle]
title: 'Agile And Reporting - 101'
image: /img/2019-11-20-agile-reporting/agile-reporting.png
tags: [Agile, Reporting]
category: Agile
comments: true
---

> Thoughts and ideas about reporting for agile projects.

# Table of contents

* [Introduction](#introduction)
  * [My situation](#my-situation)
  * [Context](#context)
* [Forecasting](#forecasting)
  * [What](#what)
  * [Throughput Forecasting](#throughput-forecasting)
* [Metrics](#metrics)
  * [Velocity](#velocity)
  * [Team Happiness](#team-happiness)
  * [Sprint Spread](#sprint-spread)
  * [Cumulative Flow Diagram](#cumulative-flow-diagram)
* [Conclusion](#conclusion)

# Introduction

## My situation

Three years ago, Ordina presented me the opportunity to start with a new team for a new project, as team lead.  
Up until then, I was a programmer who participated in Scrum teams.  
Of course, I accepted the proposition and at the time of writing this article, our project is entering its last phase and approaching the production deadline.

<img alt="The Team" src="{{ '/img/2019-11-20-agile-reporting/reporting-team.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

Over the course of these three years, I've learned a lot:
* Managing a team
* Coaching
* Handling discussions
* Making decisions
* Reporting

While the first four have been a challenge, the last one, reporting, remains a big challenge up to today.  
Which is exactly why I'm writing this, in the hopes that someone might learn from it.

Another reason why I'm writing this is because I've recently been to the eXperience Agile conference in Lisbon, Portugal.  
I went to a talk of [Doc Norton](http://docondev.com/){:target="_blank" rel="noopener noreferrer"} that was called [Escape velocity](https://www.leanpub.com/escapevelocity){:target="_blank" rel="noopener noreferrer"}. 
The talk was essentially about how and why velocity is incorrectly used as a forecasting and diagnostics tool.
The day after, I also followed his workshop about the subject and so you'll see references to his talk throughout this blogpost.

## Context

The project started as an agile project, so the whole Scrum framework was used. 
But in hindsight, there were a few problems:
* It would replace an existing product.
* It could not go into production until the functionalities of the old product were implemented.
* It had an enormous backlog of around 2.500 story points.

This blocked a major feature of Scrum, being able to quickly release a product and gather valuable feedback from the end-users.  
We estimated the entire backlog to give management a rough estimation, 1.5 years of work with five developers and two analysts.

<span class="image left"><img class="p-image" alt="This is fine" src="{{ '/img/2019-11-20-agile-reporting/reporting-this-is-fine.png' | prepend: site.baseurl }}"></span>

Now, for those reading this and having done such an estimation before, you know that the 1.5 years was probably wrong. 
And it was.  
After about a year of development, we had to re-estimate the entire backlog which resulted in doubling the amount of story points to 5000. 
And right now, we're at 6000.  
The backlog keeps growing, which is normal as we continue to learn about the business and the requirements.

# Forecasting

## What

So during the course of the project, I've had to report the progress to management.  
For this, I used the velocity of the team to generate a burnup chart so that they could see by what date we would arrive at the end. 
That's called forecasting.  

<span class="image left"><img class="p-image" alt="Timeline" src="{{ '/img/2019-11-20-agile-reporting/reporting-timeline.png' | prepend: site.baseurl }}"></span>

But there's immediately a problem there, velocity is a **lagging indicator**.  
It shows long-term patterns and can confirm such patterns - for example every December, the velocity would drop due to team members going on holidays.
It is difficult to use velocity as a planning tool since you can't see in the future. 
And it's based on estimations of a backlog, which are subject to change.

So the end date I had to report to management would typically move forward each meeting.  
Needless to say, they weren't happy with that. 
Every single time, I had to explain the fundamentals of Scrum, the backlog, refinements, story splitting, etc...

## Throughput Forecasting

A useful tool I learned with Doc Norton's talk is the [throughput forecasting tool](https://github.com/FocusedObjective/FocusedObjective.Resources/raw/master/Spreadsheets/Throughput%20Forecaster.xlsx){:target="_blank" rel="noopener noreferrer"}.  
It's an Excel file where you can enter the following data:
* The min/max backlog/feature size.
* The % of story splitting (hard to calculate, not required).
* The start date (typically today).
* The duration of your sprints.
* The min/max velocity.
* With an estimate.
* Or with actual data from your project.

The tool then runs 500 simulations where it randomly picks numbers between the minimum and maximum you provided. 
Those simulations are then used to give you a probability chance of reaching a certain date.

The past few meetings I've started to use this tool and it helped me to provide a better, probable end date of the features.

Let's take an example. 
In our backlog, we have three features waiting, a total of 150 story points. 
Now, you have to estimate how many sprints it would take to finish and by what date.

Assume we start 01-01-2019 and work with sprints of two weeks. 
The past five velocities were 60, 55, 40, 45, 51, averaging in 50. Three sprints, great!  
Estimated end date = 01-01-2019 + six weeks = 12-02-2019
Now, let's put that in the tool.

<img alt="Throughput Tool Input" src="{{ '/img/2019-11-20-agile-reporting/reporting-throughput-input.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

The result:

<img alt="Throughput Tool Result" src="{{ '/img/2019-11-20-agile-reporting/reporting-throughput-results.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

So there's a 55% probability that the features will be done in three sprints.  
However, there's a 100% probability that it will be done in four sprints. And that's just for three features worth of 150 story points.

# Metrics

During my role as team lead, I've also had to measure the performance and happiness of the team. 
To do so, it helps to have raw data to analyse. 

## Velocity

The tool we use for managing our scrum process is Jira. 
It contains various reports that can be generated based on your agile board.  
But mostly,  I used the export to spreadsheet functionality.
This provided me with a spreadsheet file with all the raw data of the entire backlog in Jira.

With that spreadsheet, it's just a matter of using the various functions to analyse the data. 
This gave me results such as the image below.

<img alt="Raw Velocity" src="{{ '/img/2019-11-20-agile-reporting/reporting-velocity-raw.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

I also asked all team members to enter their hours per sprint in another spreadsheet. 
Which resulted in the following:

<img alt="Hours Per Sprint" src="{{ '/img/2019-11-20-agile-reporting/reporting-hours-input.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

All that data can then be combined into a chart.

<img alt="Velocity Chart" src="{{ '/img/2019-11-20-agile-reporting/reporting-velocities-chart.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

As always with velocity, it tells us what happened in the past. 
But what does the chart above tell us?
* The story points done per sprint are rising.
* The last 2 sprints, the team did a very good estimation as they reached or surpassed their forecasted story points.
* The relative velocity (what the team could have done if everyone was present) is always much higher
  * This could for example indicate that team members are often absent, which explains the difference between the velocity and the relative velocity.

What you do with this data is, as always, up to your team. 
It can for example help to determine the impact of certain decisions in the past.

## Team Happiness

<span class="image left"><img class="p-image" alt="Happy Team" src="{{ '/img/2019-11-20-agile-reporting/reporting-team-happy.png' | prepend: site.baseurl }}"></span>

For measuring the happiness of the team, I used five questions with a score of 1 (not great) - 5 (great) and used that data in another spreadsheet.  
Every sprint, the team had to fill it in and I gathered the data. 

As with velocity, this is a lagging indicator so you can see what happened in the past, but it can't predict the future.

But it's useful to see patterns.  
For example, you can see happiness peaks in sprints where team activities were done. 
Difficult sprints create happiness lows, due to stress and pressure.

The questions I used were:
* **Quality of meetings**
  * Did we have too many meetings? Not enough? Were the ones we had meaningful?
* **Team collaboration**
  * How did the team members work together? Were there any problems?
* **Correct focus**
  * Did the team focus on the correct backlog items? Or did they do useless items?
* **Team flexibility**
  * How well did the team respond to change?
* **Velocity team**
  * Did the team achieve what they forecasted during the planning?
* **Created value**
  * Did the team have the feeling that they produced extra value?

When you put all this data in a chart, it could look like the chart below for the last few sprints. 

<img alt="Short-term Team Happiness" src="{{ '/img/2019-11-20-agile-reporting/reporting-happiness-short.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

If you use the last five sprints, it can help to locate problems in the team. 
The chart below shows that the team wasn't happy about the achieved velocity. 
So it could help to find out why and avoid that problem in future sprints.

If you do it for a longer period, it could look like this:

<img alt="Long-term Team Happiness" src="{{ '/img/2019-11-20-agile-reporting/reporting-happiness-long.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

It shows that sprint 7 was a very bad sprint, together with 13.  
The longer we worked together, the more stable the chart gets. 
Which is a normal evolution as everyone needs to get used to each other in the beginning.

## Sprint Spread

A chart that I started to use in the last few months is the spread of the various types of backlog items in sprints.  
The extracted data from Jira can be used to filter on types and then combine it in a chart.

<img alt="Sprint Spread" src="{{ '/img/2019-11-20-agile-reporting/reporting-sprint-spread.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

What does the image above tell?
* Sprint 56
  * No bugs, but a lot of stories and a few tasks, as well as some stories that were rejected by the business
* Sprint 57
  * Quite a few bugs and stories, mixed with some tasks and few rejected stories
* Sprint 58
  * We did a lot of tasks due to a technical refactoring, with less stories and some bugs
* And so on

I find this very interesting to report to management, as it clearly shows that the team did a lot of work, even if that doesn't translate in raw velocity.

## Cumulative Flow Diagram

During the workshop with Doc Norton in Lisbon, I also learned of the cumulative flow diagram.  
This is a diagram that can be automatically generated in most Scrum tools, such as Jira.

Unfortunately, I've not been able to generate a readable diagram for my project due to Jira malfunctioning, but for completeness, I will include it here as well. 

So, what does the diagram look like? (Information taken from [Zepel](https://zepel.io/agile/reports/cumulative-flow-diagram/){:target="_blank" rel="noopener noreferrer"})

<img alt="Cumulative Flow Diagram Example" src="{{ '/img/2019-11-20-agile-reporting/reporting-flow-example.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

It basically shows you the process of an item from backlog to completed.  
And more importantly, it can tell you when there are problems in that process. 
The image above shows lines that go up evenly, with no drastic changes.

The image below however, shows that the development line is straightening out, which means no new stories are picked up for development from the backlog. 
This could be due to a number of reasons, such as impediments or unforeseen complexity and generates a bottleneck. 
This creates hiccups in the value flow, and a lower flow rate in the next statuses, such as QA and Deployed.

<img alt="Blocking Cumulative Flow Diagram" src="{{ '/img/2019-11-20-agile-reporting/reporting-flow-blocking.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 750px;">

The chart does not explain how to fix it, but it does tell that there's a problem.
And so the Cumulative Flow Diagram is therefor a perfect tool for a scrum master to start a good discussion with the team, about flow, blockages and dependencies. 
Eventually this will most definitely lead to better flow management, more t-shaping, an optimized WIP limit... and a happier team!

# Conclusion

Reporting in an agile environment remains difficult. 
There are a lot of possible options, but it always depends on your specific situation.  
In more traditional, waterfall projects, reporting is a bit easier as everything should be known beforehand (although that produces other problems...).  
In this blogpost, I have given some examples of metrics and tools that I use to report progress and performance of my project, which work for me. 

<span class="image left"><img class="p-image" alt="Great Success" src="{{ '/img/2019-11-20-agile-reporting/reporting-great-success.png' | prepend: site.baseurl }}"></span>

**As with all things agile, they might or might not work for your situation, but at the least, it might have given you some ideas!**
