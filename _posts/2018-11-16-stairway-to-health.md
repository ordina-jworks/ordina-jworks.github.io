---
layout: post
authors: [gert-jan_schokkaert]
title: "Visualising IoT data with tableau"
image: /img/2018-11-16-stairway-to-health/stairway-to-health.png
tags: [Development,Translations,Angular,i18n,Crowdin]
category: Development
comments: true
---

# VisionWorks meets JWorks: StairwayToHealth
We, from [VisionWorks][], were asked to rebuild the visualisation dashboard [JWorks][]{:target="_blank" rel="noopener noreferrer"} used in the [application][]{:target="_blank" rel="noopener noreferrer"} they built as a result of the internal Stairway to Health project (you can find more information about that project [here][]{:target="_blank" rel="noopener noreferrer"}). 
We decided to use [Tableau][]{:target="_blank" rel="noopener noreferrer"}, a popular BI Visualisation tool we largely use at our clients.
We developed the dashboard working around some key questions while keeping the appearance of the dashboard in line with the dashboard JWorks developed.

In the following section we will explain how the dashboard is currently set up and how to use it properly.
Next we will go over the features we can add in future releases to allow the user to go even deeper in their analysis.

# Dashboard overview

The dashboard is built to answer **the following questions**:

1. What is the percentage of people taking the stair/elevator at Ordina **today**?
2. How is the same metric on weekly, monthly or yearly basis? What is it in absolute numbers?
3. How does it evolve over time based on each day, week, month or year?
4. Are people taking the stairs more this week compared to last week?

The dashboard will try to provide answers to these questions using the following **three main parts**.
We will go over these parts and highlight which question(s) they try to answer.

## Part one: the Title

The title is what the user sees first and answers the first question.
By using the colors in the title, the dashboard shows the user - in a subtle way - what the colors in the next visuals represent.
There is also an option to select another day as illustrated below.

![PartOne](/img/2018-11-16-stairway-to-health/PartOne.gif)

## Part two: the horizontal bar comparison

In part two the user can find an answer to questions two and three.
The visual uses the selected day to show the division between people taking the stair / elevator on a daily / weekly / monthly and yearly basis.
When the user hovers over the chart he can also see the evolution of people taking the stair / elevator within that day / week / month / year.
Next to the chart, the total absolute number of all the observations measured is reported per period.

![PartTwo](/img/2018-11-16-stairway-to-health/PartTwo.gif)

## Part three: the more detailed area chart

The third part visualises how the division stair / elevator is evolving over time expressed in daily, weekly, monthly or yearly basis.
This gives the user the possibility to look at trends and to see how the situation of today compares itself to past situations.

In the title the user has the option to change the appearance of the data (absolute or shares).
The amount of periods shown (starting from the most recent period) can also be changed.

![PartThreeOne](/img/2018-11-16-stairway-to-health/PartThreeOne.gif)

When the user hovers over the chart the same horizontal bar comparison can be seen. 
Comparisons can be made with the period selected above.

![PartThreeTwo](/img/2018-11-16-stairway-to-health/PartThreeTwo.gif)

Last feature to discuss here is how the user can change which period the chart is showing.
This can be done by clicking the chart above.
When you click on the day bar on the top chart the bottom chart is expressed on a day level.
This also applies to the other period bases in the chart.

![PartThreeThree](/img/2018-11-16-stairway-to-health/PartThreeThree.gif)

# What can we do next?

While this dashboard already gives an answer to the most important questions and gives the user the possibility to explore the data over time, there are still some extra things that can be developed.

The dashboard is currently built within a Tableau workbook which is using the data of the [MongoDb][] database JWorks set up as an extract.
This means we don't have a live connection to the actual database JWorks has in their app.
This brings us to the first thing we can still explore: **deployment**.
In order to integrate the dashboard in the original application, we could publish the dashboard on the [Tableau server][]{:target="_blank" rel="noopener noreferrer"} of Ordina which is running on [Microsoft Azure][]{:target="_blank" rel="noopener noreferrer"}.
Running this instance is not free so when taking a decision we should also take the user relevance in consideration: does the user really need to have a live connection to the data or does a nightly update cover the load?

Secondly we can still do a lot on the **analysis part**. What are the reasons why some patterns in the data exist? Do people take the stairs less when it is hot outside?
JWorks recently tracked on which floor the observation is measured, allowing us to look into difference by floor. Do people take the elevator more when they need to go from floor 1 to floor 3?

We will keep you posted on further progress related to Stairway to Health. Thank you for reading and don't forget: always take the stairs!

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
