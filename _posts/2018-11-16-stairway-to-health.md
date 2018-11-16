---
layout: post
authors: [gert-jan_schokkaert]
title: "VisionWorks meets JWorks: StairwayToHealth"
image: /img/2018-11-16-stairway-to-health/stairway-to-health.png
tags: [Development,Translations,Angular,i18n,Crowdin]
category: Development
comments: true
---

# VisionWorks meets JWorks: StairwayToHealth
We from [VisionWorks][] were asked to rebuild the visualisation dashboard [JWorks][] used in the [application][] they build as a result of the internal Stairwaytohealth project (more information about that project you can find [here][]). We decided to use [Tableau][] , a popular BI Visualisation tool we largely use at our clients. We developed the dashboard working around some key questions while keeping the appearance of the dashboard in line with the dashboard JWorks developed.

In the following section I will explain how the dashboard is currently build up and how to use it properly. Next I will go over the features we can add in the future to allow the user to even go deeper in their analysis.

# Dashboard overview

The dashboard is build around **the following main questions** the user wants information on:
1. What is today the percentage of people taking the stair/elevator at Ordina?
2. How is the same metric on week/month/year basis? How is this in absolute numbers?
3. Within each day/week/month/year base how does it evolve over time?
4. And accoss days/weeks/months/years? Are people taking more the stairs this week compared to last week?

To allow the user to find an answer to this questions as easy as possible, the dashboard is build up out of **three main parts**. I will go over these parts and highlight which question(s) the part tries to answer.

## Part one: the title

Part one, the title, is the first thing the user sees and so gives an answer to the first and main question. By using the colours in the title the dashboard shows the user in a subtle way what the colours in the next visuals represent. There is also an option to select another day as illustrated below.

![PartOne](/img/2018-11-16-stairway-to-health/PartOne.gif)

## Part two: the horizontal bar comparison

In part two the user can find an answer to questions two and three. The visual uses the day the user selects to show the division between people taking the stair/elevator on a daily/weekly/monthly and yearly basis. If the user hovers over the chart he or she can also see the evolution of people taking the stair/elevator within that day/week/month/year he or she is hovering over. Next to the chart the total absolute number of all the observations measured is reported per period.

![PartTwo](/img/2018-11-16-stairway-to-health/PartTwo.gif)

## Part three: the more detailed area chart

The third part visualizes how the division stair/elevator is evolving over time expressed in day/week/month or year basis. This gives the user the possibility to look at trends and to see how the situation of today compares itself to past situations. 

In the title the user has the option to change the appearance of the data (absolute or shares). He has also the option to change how many periods are visualised starting from the most recent period.

![PartThreeOne](/img/2018-11-16-stairway-to-health/PartThreeOne.gif)

When the user hovers over the chart he can see the same horizontal bar comparison as in part two allowing he or she to compare the selected period above with the period he or she is hovering over in the chart.

![PartThreeTwo](/img/2018-11-16-stairway-to-health/PartThreeTwo.gif)

Last feature to discuss here is how the user can change which period base the chart is showing. This can be done by clicking on the chart above. If you click on the day bar on the top chart the bottom chart is expressed on a day level. This applies also to the other period bases in the chart.

![PartThreeThree](/img/2018-11-16-stairway-to-health/PartThreeThree.gif)

# What can we do next?

While this dashboard already gives an answer to the most important questions and also gives the user the possibility to explore the data over time there are still some extra things that we can develop.

The dashboard is now built within a tableau workbook which is using the data of the [MongoDb][] database JWorks setup as an extract. This means no live connection as JWorks does have in their online application. This brings us to the first thing we can still further explore: **deployment**. In order to put the dashboard in the website they developed we could publish the dashboard on the [Tableau server][] of Ordina which is running on an [Microsoft Azure][]. Running this instance is not free so when taking a decision in this we also should take the user relevance in consideration: does the user really needs to have a live connection to the data or does an update overnight also accomplish his needs?

Secondly when can still do a lot on the **analysis part**. What are the reasons why some patterns in the data exist? Do people take less the stairs when it is hot outside? 
JWorks recently tracked on which floor the observation is measured allowing us to look into difference by floor. Do people take more the elevator when they need to go from floor 1 to floor 3?

We will keep you posted about further progress on the things described above. Thank you for reading and don't forget: always take the stair!



Gert-Jan Schokkaert   
Data Visualisation Consultant   
VisionWorks


[Tableau]: https://www.tableau.com/
[application]: https://stairwayto.health/dashboard
[Microsoft Azure]: https://azure.microsoft.com/en-us/
[Tableau server]: https://www.tableau.com/trial/tableau-server
[VisionWorks]: https://www.ordina.be/vakgebieden/bi-analytics/
[JWorks]: https://ordina-jworks.github.io/
[here]: https://ordina-jworks.github.io/iot/2018/03/14/Stairway-To-Health-2.html
[MongoDb]: https://www.mongodb.com/