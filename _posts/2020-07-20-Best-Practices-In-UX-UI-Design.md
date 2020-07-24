---
layout: post
authors: [derya_duru]
title: '10 Best Practices in UX and UI Design'
image: /img/2020-07-20-Best-Practices-In-UX-UI-Design/design-banner.jpg
tags: [Design, UX Design, UI Design]
category: Design
comments: true
---

> UX and UI design principles often lead to people thinking 'well duh!', until they actually have to try and create a user-friendly website or app. 
> The basic gist of creating a user-friendly design is making sure the user doesn't have to think twice about doing something. 
> The longer is takes for a user to be able to execute an action, the more annoyed he or she will get. 
> The usability of your website or app can already be improved with just a few tweaks. Below is an overview of 10 ways to make your users happy.

# Table of contents
* [Company logo placement and usage](#1-company-logo-placement-and-usage)
* [Make clickable elements obvious](#2-make-clickable-elements-obvious)
* [Clearly show which elements on a page belong together](#3-clearly-show-which-elements-on-a-page-belong-together)
* [Be honest](#4-be-honest)
* [Accessibility](#5-accessibility)
* [Stick to conventions](#6-stick-to-conventions)
* [Breadcrumbs](#7-breadcrumbs)
* [Less clicks = better](#8-less-clicks--better)
* [Dropdown lists](#9-dropdown-lists)
* [Include visual indicators of length and size](#10-include-visual-indicators-of-length-and-size)

## 1. Company logo placement and usage
First things first. Your user always needs to find its way back to the homepage in a heartbeat. 
Providing a 'Home' link in your menu is not enough. 
It's surprising how often users click on the company logo on the top of your page so make sure it's visible from every page and provide a link behind it to the homepage.
The company logo is typically placed in the top left corner (on sites designed for left-to-right reading).

<img alt="Logo of Goodsreads is placed in the top left corner and is clickable" src="{{ '/img/2020-07-20-Best-Practices-In-UX-UI-Design/logo-placement.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 1000px;">

## 2. Make clickable elements obvious
### Buttons
CTA ([Call To Action](https://en.wikipedia.org/wiki/Call_to_action_(marketing)){:target="_blank" rel="noopener noreferrer"}) buttons need to stand out from the rest of the page so it immediately draws the user's attention.
Adding a shadow effect to the buttons lets the user know it's clickable and they can interact with it.
Notice the difference between the following examples:

<div style="display: flex; margin-bottom: 2rem">
    <img alt="Clear CTA button" src="{{ '/img/2020-07-20-Best-Practices-In-UX-UI-Design/CTA-colored.png' | prepend: site.baseurl }}" class="image" style="margin:0px auto; max-width: 300px;"> <img alt="Unclear CTA button" src="{{ '/img/2020-07-20-Best-Practices-In-UX-UI-Design/CTA-bland.png' | prepend: site.baseurl }}" class="image" style="margin:0px auto; max-width: 300px;">
</div>

Since in the example on the right, the label to save the form is still concise and clear, users should still be able to eventually save the data, but it takes a moment longer to register which button to click to make this happen. 
Remember, the user wants to spend as little time as possible determining the next course of action. 

Let's also discuss the 'Cancel' and 'OK' (or other confirming actions such as 'Save', 'Yes', 'Submit', etc) buttons. 
So-called secondary actions like 'Cancel' should look the least appealing of the options because it usually isn't the next action the user wants to take.
Making them the least appealing minimizes the chance of misclicks and nudges the user further towards a successful ending, such as a purchase.

In Windows apps, the 'OK' button should come first and the 'Cancel' button second. On Apple machines however, 'Cancel' will come first and 'OK' second.
When designing for the web, it's best to choose whichever convention is used by most of your users, so based on their operating system.

<div style="display: flex; margin-bottom: 2rem">
    <img alt="Order of OK and Cancel on Apple machines" src="{{ '/img/2020-07-20-Best-Practices-In-UX-UI-Design/OkCancelApple.png' | prepend: site.baseurl }}" class="image" style="margin:0px auto; max-width: 450px;"> <img alt="Unclear CTA button" src="{{ '/img/2020-07-20-Best-Practices-In-UX-UI-Design/OkCancelWindows.png' | prepend: site.baseurl }}" class="image" style="margin:0px auto; max-width: 450px;">
</div>

### Hyperlinks
Words on a web page that can be clicked are best underlined and shown in a different color than the rest of the text. 
Using solely a different color might be interpreted as an emphasis on that word and another problem that this presents is that colorblind people will have issues finding the clickable links in your text.
Just underlining a word is already a good visual indicator that it's clickable, but your best bet is to make sure that the link 'pops'.
By going for a combination of coloring the text and underlining it, you're making sure there's no doubt in the user's mind that the word is clickable.  

<img alt="Hyperlinks are best colored and underlined" src="{{ '/img/2020-07-20-Best-Practices-In-UX-UI-Design/hyperlinks.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 700px;">

To be clear, the same goes for the other way around as well. Underlining words that aren't clickable might cause confusion. 
If you want to emphasise certain parts of the text, you can for example use an italic font for that.

As a side note, sometimes the location of the links already provides the user with the knowledge that they're clickable, for example your menu items or links in your footer.

## 3. Clearly show which elements on a page belong together
### Titles and subtitles
Titles and subtitles are a must-have when your website needs to convey any sort of information to your user.
Walls of text are very hard to get through and will not, I repeat, will not keep your user's attention. 
Split your text in sections and be sure to use consistent font sizes for the titles. If they aren't used consistently, there's no way to know which sections belong together. 
Take a look at the following example:

<img alt="Use titles and subtitles consistently" src="{{ '/img/2020-07-20-Best-Practices-In-UX-UI-Design/titles-and-subtitles.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 700px;"> 

It's clear from this example that 'Subtitle 1' and 'Subtitle 2' both are part of the 'Title' section.
The following text is much more confusing:

<img alt="Use titles and subtitles consistently - example with inconsistent subtitles" src="{{ '/img/2020-07-20-Best-Practices-In-UX-UI-Design/titles-and-subtitles-confusing.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 700px;">

What is supposed to be communicated here? 'Subtitle 2' using the same coloring as 'Subtitle 1' but it's just as large as 'Title'. 
So does the author mean it's still part of the 'Title' section or did he or she mean to create a whole separate section with a different 'Title'? Instructions unclear.

Next to font size, the location of the (sub)titles is also important.

## 4. Be honest
Shipping costs, fees, shipping time, etc

## 5. Accessibility
Low hanging fruit p.180

## 6. Stick to conventions
The rule regarding icon usage and link labeling is pretty simple: stick to conventions! 
The icons for search, shopping cart, profile, etc.. are well-known and you shouldn't try and reinvent the wheel by using 'innovative' icons.

<img alt="Use well-known icons" src="{{ '/img/2020-07-20-Best-Practices-In-UX-UI-Design/icons.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 300px;">

How you label your links and buttons is important as well. When users are looking for job opportunities on your website, typical keywords are 'Careers' or 'Jobs'.
By using for example 'Employment', users might not be able to find your career page (as easily). 

## 7. Breadcrumbs

## 8. Less clicks = better
p.170

## 9. Dropdown lists

## 10. Include visual indicators of length and size
-> '18 minute read'
-> Bolletjes bij invullen formulier 