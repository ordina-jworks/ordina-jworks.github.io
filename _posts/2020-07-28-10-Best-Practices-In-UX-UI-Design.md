---
layout: post
authors: [derya_duru]
title: '10 Best Practices in UX and UI Design'
image: /img/2020-07-28-Best-Practices-In-UX-UI-Design/design-banner.jpg
tags: [Design, UX Design, UI Design]
category: Design
comments: true
---

> UX and UI design principles often lead to people thinking 'well duh!', until they actually have to try and create a user-friendly website or app. 
> The basic gist of creating a user-friendly design is making sure the user doesn't have to think twice about doing something. 
> The longer it takes for a user to be able to execute an action, the more annoyed they will get. 
> The usability of your website or app can already be improved with just a few tweaks. Below is an overview of ten ways to make your users happy.
>
> As I'm just taking my first steps in the UX/UI design world, I still have lots to learn. Feedback is greatly appreciated!

# Table of contents
1. [Company logo placement and usage](#1-company-logo-placement-and-usage)
2. [Make clickable elements obvious](#2-make-clickable-elements-obvious)
3. [Clearly show which elements on a page belong together](#3-clearly-show-which-elements-on-a-page-belong-together)
4. [Be honest](#4-be-honest)
5. [Accessibility](#5-accessibility)
6. [Stick to conventions](#6-stick-to-conventions)
7. [Breadcrumbs](#7-breadcrumbs)
8. [Less clicks = better](#8-less-clicks--better)
9. [Dropdown lists](#9-dropdown-lists)
10. [Include visual indicators of length and size](#10-include-visual-indicators-of-length-and-size)

## 1. Company logo placement and usage
First things first. Your user always needs to find their way back to the homepage in a heartbeat. 
Providing a 'Home' link in your menu is not enough. 
It's surprising how often users click on the company logo on the top of your page so make sure it's visible from every page and provide a link behind it to the homepage.
The company logo is typically placed in the top left corner (on sites designed for left-to-right reading).

<img alt="Logo of Goodreads is placed in the top left corner and is clickable" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/logo-placement.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 1000px;">

## 2. Make clickable elements obvious
### Buttons
Confirmation buttons need to stand out from the rest of the page so it immediately draws the user's attention.
Adding a shadow effect to the buttons lets the user know it's clickable and they can interact with it.
Notice the difference between the following examples:

Example 1:
<img alt="Clear confirmation button" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/CTA-colored.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 300px;"> 

Example 2:
<img alt="Unclear confirmation button" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/CTA-bland.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 300px;">

In the bottom example the label to save the form is still concise and clear, users should thus still be able to eventually save the data, but it takes a moment longer to register which button to click to make this happen. 
Remember, the user wants to spend as little time as possible determining the next course of action. 

So-called secondary actions like 'Cancel' should look the least appealing of the options because it usually isn't the next action the user wants to take.
Making them the least appealing minimizes the chance of misclicks and nudges the user further towards a successful ending, such as a purchase.

Let's also discuss the location and order of the 'Cancel' and 'OK' (or other confirmation actions such as 'Save', 'Yes', 'Submit', etc) buttons. 

In Windows apps, the 'OK' button should come first and the 'Cancel' button second. 
This implementation follows the 'natural reading order' (again, on sites designed for left-to-right reading).
Additionally, keyboard users will also reach the 'OK' button sooner.

<img alt="Unclear confirmation button" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/OkCancelWindows.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 450px;">

On Apple machines however, 'Cancel' will come first and 'OK' second.
The idea here is that the flow feels more natural since the 'OK' button closes that section and the next step ('OK') is placed most right, whilst the previous step ('Cancel') is placed left.

<img alt="Order of OK and Cancel on Apple machines" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/OkCancelApple.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 450px;">

When designing for the web, we usually opt to put the buttons on the left-side of the screen, with the confirmation button first. 
'Example 1' in this section illustrates this as well:

<img alt="Clear confirmation button" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/CTA-colored.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 300px;"> 

### Hyperlinks
Clickable words on a web page are best underlined and shown in a different color than the rest of the text. 
Using solely a different color might be interpreted as an emphasis on that word and another problem that this presents is that colorblind people will have issues finding the clickable links in your text.
Just underlining a word is already a good visual indicator that it's clickable, but your best bet is to make sure that the link 'pops'.
By going for a combination of coloring the text and underlining it, you're making sure there's no doubt in the user's mind that the word is clickable.  

<img alt="Hyperlinks are best colored and underlined" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/hyperlinks.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 700px;">

To be clear, the same goes for the other way around as well. Underlining words that aren't clickable might cause confusion. 
If you want to emphasise certain parts of the text, you can for example use an italic font for that.

As a side note, sometimes the location of the links already provides the user with the knowledge that they're clickable, for example your menu items or links in your footer.

## 3. Clearly show which elements on a page belong together
### Titles and subtitles
Titles and subtitles are a must-have when your website needs to convey any sort of information to your user.
Walls of text are very hard to get through and will not, I repeat, will not keep your user's attention. 
Split your text in sections and be sure to use consistent font sizes for the titles. 
If they aren't used consistently, there's no way to know which sections belong together. 
Take a look at the following example:

<img alt="Use titles and subtitles consistently" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/titles-and-subtitles.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 700px;"> 

It's clear from this example that 'Subtitle 1' and 'Subtitle 2' both are part of the 'Title' section.
The following text is much more confusing:

<img alt="Use titles and subtitles consistently - example with inconsistent subtitles" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/titles-and-subtitles-confusing.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 700px;">

What is supposed to be communicated here? 'Subtitle 2' using the same coloring as 'Subtitle 1' but it's just as large as 'Title'. 
So does the author mean it's still part of the 'Title' section or did he or she mean to create a whole separate section with a different 'Title'? Instructions unclear.

For screen readers (and other assistive technologies), it's best to show titles by using the different title tags that are available in HTML, such as <h1>, <h2>, etc. 
This way, the screen reader is aware that that specific text is a (sub)title and can communicate this information to the user.

## 4. Be honest
One of the biggest irks of customers is being presented with crucial information and extra costs late in the ordering process. 
Customers want to be able to make an informed decision about your product as soon as possible, preferably on the product page itself. 
Once they make the decision to order, the last thing they want to encounter is new information later on that might give the perception that they have been deceived.
For their sake, and the company's, it's vital to show the shipping costs, any fees, delivery moment, etc as early as possible. 

Take a look at how Coolblue handles this:

<img alt="Coolblue showing stock indicator and delivery moment and costs" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/coolblue.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 500px;">

Bookdepository handles this similarly with a link to extra information on delivery since they're providing worldwide shipping:

<img alt="Bookdepository showing stock indicator, delivery moments and costs" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/bookdepository.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 300px;">

In the above examples, shipping costs are free. 
If your shipping costs depend on the items in the shopping cart or other factors, the customer should to be able to view the costs when viewing the cart.
Coliro shows this in the next example where you can select your country to determine the shipping costs:

<img alt="Coliro shows the shipping costs per country on the cart page" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/coliro.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 500px;">

## 5. Accessibility
Accessibility is a whole different and separate topic to discuss. We'll cover this in a future blog post, but for now, let's focus on some *low-hanging fruit*.
Websites should preferably be designed for impaired persons as well, whether it's a temporary impairment (like a broken arm) or a permanent one (like blindness).
It's practically impossible to please everyone, but we can at least try to make everyone's lives a little easier by making our website and apps as accessible as possible.
* Colors: Provide a strong color contrast between the text and the background. This will make the text more readable for visually impaired persons.
* Keyboard use on websites: Users should be able to navigate through the website using only the keyboard so that the use of a mouse isn't necessary.
* Text size: It should be easy for the user to increase and decrease the size of the text so visually impaired persons can select their optimal text size.
* Alt text: Provide alt text to every image that screen readers should read out loud.
* Captions on videos: Hearing impaired persons benefit greatly from subtitles and captions on videos.

## 6. Stick to conventions
The rule regarding icon usage and link labeling is pretty simple: stick to conventions! 
The icons for search, shopping cart, profile, etc.. are well-known and you shouldn't try and reinvent the wheel by using 'innovative' icons.

<img alt="Use well-known icons" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/icons.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 300px;">

Also, unless you're using icons that are well-known and absolutely clear on their purpose, like the icons above, it's always a good idea to add labels to your icons.
If you're unsure about the use of labels, user testing will tell you whether users are experiencing issues with your icons without labels or not.

How you label your links and buttons is important as well. When users are looking for job opportunities on your website, typical keywords are 'Careers' or 'Jobs'.
By using for example 'Employment', users might not be able to find your career page (as easily). 

## 7. Breadcrumbs
Like Hansel and Gretel, we all need to find our way back sometimes. 
Breadcrumbs, and in our case meant specifically online, help us to do so, if done right.
Take a look at the following example from ASOS:

<img alt="ASOS uses very clear breadcrumbs" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/asos.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px;">

With breadcrumbs, users can see in the blink of an eye in which (sub)category the current page belongs. 
This is interesting for your users who ended up on a specific product page through a Google search. 
By using breadcrumbs, your users are able to quickly understand where they are situated within your website.
Being able to actually click on a (sub)category in the breadcrumbs will help your users to easily retrieve an overview of similar products. 

Even when you're just mindlessly browsing a website and you clicked on twenty different items within a category, you don't want to click the back button twenty-one times to go back to the actual results within the current category.
Breadcrumbs make sure that your user can browse your website more easily, which creates less frustration for your user, which hopefully creates a higher conversion. 

## 8. Less clicks = better
Usually.

Try to save the user clicks as much as possible. 
Like Steve Krug describes in his [*Don't Make Me Think*](http://sensible.com/dmmt.html){:target="_blank" rel="noopener noreferrer"}, instead of only providing a tracking number for a shipment, you can add a link to the e-mail that opens the carrier's website with the tracking number already filled in.
Another example would be to provide a Google Maps preview on the contact page instead of just providing the address.

When possible, also try to mention any form errors while the user is entering the data. 
Whether it be the phone number format or a password that is too short, anything that can be detected client-side should immediately be communicated to the user instead of waiting until the user clicks 'Submit'. 

Now, I said *'usually'* at the beginning of this section. 
There are of course a few exceptions. 
One of them is the FAQ page.
If you want to provide quite some questions and answers, it's best not to throw it all into one big overview.
A good idea here would be to provide all the possible questions in a list and make these questions clickable.
The answer should then only show up after the user has clicked on the question. 
This will provide a clean, clear, concise and easy to browse FAQ page for your user, even though there are a few more clicks involved.  

## 9. Dropdown lists
Dropdown lists are simple to implement and easy to use so they are present on countless websites.
The key here is to only start using dropdown lists when we're talking about five or more options. 
When there are less options present, radio buttons might be a better choice for you so the user can see all the available options immediately.

## 10. Include visual indicators of length and size
Always assume that users are in a rush. 
What users will typically do when encountering a web page that contains a lot of text, is to check how long that text actually is before starting to read it. 
They need an idea of length or time to know if it's worth to start reading at all. 
Medium.com does this by adding the number of minutes it takes to read their articles:

<img alt="Medium.com showing how long an article will take to read" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/medium.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 250px;">

Providing a progress indicator also helps the customer complete the order. 
It shows where the user is in the process and what information still needs to be entered before the order can be completed.
Users quickly lose their interest if they don't have an idea how much longer the process will take. 
Progress bars are essential and adding detailed information like Coolblue does in the below example will keep your user's focus towards the end goal (in this case completing the purchase).

<img alt="Coolblue shows the progress while ordering" src="{{ '/img/2020-07-28-Best-Practices-In-UX-UI-Design/coolblue-order.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 600px;"> 

The same also goes for questionnaires by the way. 
How often do you complete an online questionnaire if there isn't any information available on how long it might take to fill in?
Exactly.

## Conclusion
As said before in this blog post, it's practically impossible to please everyone with your design.
What's aesthetically pleasing to one person might not be so for the next one.
But user experience is more than the look, the layout, the colors used. 
We're also talking about flow here, about creating an experience for each user, regardless of impairment, that helps them reach their goal flawlessly, without frustration, with little nudges in the right direction.

If you're looking for some UX/UI design experts to help with your projects, don't hesitate to contact my colleagues at [Clockwork](http://cw.be/){:target="_blank" rel="noopener noreferrer"}!