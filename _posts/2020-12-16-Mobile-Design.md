---
layout: post
authors: [hannelore_verbraekel]
title: 'Mobile Design Done Right'
image: /img/2020-12-16-mobile-design-done-right/mobile-design.png
tags: [Design, UX Design, UI Design]
category: Design
comments: true
---

## Table of contents
{:.no_toc}

- TOC
{:toc}

## Mobile design

Mobile has taken over desktop when it comes to web browsing. 
Because of this, the importance of user-friendly mobile interfaces is bigger than ever. 
In this recipe, we will go from a bad design to a user-friendly design in a couple of steps. 
This will help you make better design choices when developing for a customer!

## The bad and... the ugly?

This is a design created for the fictional webshop Lux, a company that sells luxury items.
If you take a look at this design, you will notice that it's pretty clean. 
But a good-looking design doesn't always check off the criteria of a good design. 
Take a moment to think about what could be wrong.

<img alt="Lux Example: Bad design" src="{{ '/img/2020-12-16-mobile-design-done-right/Bad-design.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px;">

## Don'ts 

First, we will discuss the don'ts when creating a design for your application. 
We will take everything step by step. 
There will always be imperfections to the design, so keep thinking about what else could be wrong!

### Custom gestures
Gestures are a fun way of working with a touch screen. 
It might result in faster interactions, but keep in mind that there is a learning curve to custom gestures. 
Don't replace UI elements with them, but give the user the choice. 

In our example, to go to the wishlist page, you have to swipe left. 
Some people might not know this and never get to this page. 
However, we can solve this by adding a tab bar that contains all the pages you can go to. 
Let's combine this with the swipe gesture.

<div style="text-align: center">
    <img alt="Lux Example: Bad design" src="{{ '/img/2020-12-16-mobile-design-done-right/Bad-design.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block;">
    <img alt="Lux Example: Added tab bar" src="{{ '/img/2020-12-16-mobile-design-done-right/Gestures.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block;">
</div>

### No labels
Do you see anything wrong with the newly added tab bar?
You probably know by now that the heart means wishlist and the user icon has something to do with your account. 
These are assumptions that our brain makes when seeing those icons in this context, but it's not always that obvious to other users. 
This is why labelling preferably all icons is necessary. 
As you can see, our tab bar is way clearer now and it will gain more engagement!

<div style="text-align: center">
    <img alt="Lux Example: Added tab bar" src="{{ '/img/2020-12-16-mobile-design-done-right/Gestures.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block;">
    <img alt="Lux Example: Tab bar with labels" src="{{ '/img/2020-12-16-mobile-design-done-right/Labels.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block;">
</div>

### Hamburger menu
The first thing developers do when they have to make a website responsive is adding the hamburger menu, but this is not always the way to go. 
Let's take a look at our Lux application. 
There are only three buttons in our hamburger menu and there is plenty of space in our header. 
If you don't hide them behind a button, people will be more tempted to go to one of these pages. 
This doesn't mean that you should never use a hamburger menu, but you should try to make the most important features easily accessible.

<div style="text-align: center">
    <img alt="Lux Example: Bad design" src="{{ '/img/2020-12-16-mobile-design-done-right/Hamburger-before.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block;">
    <img alt="Lux Example: Removed hamburger icon" src="{{ '/img/2020-12-16-mobile-design-done-right/Hamburger.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block;">
</div>

### Hidden search bar
Another thing that decreases engagement, is hiding the search bar behind a button. 
If you show it all the time, you will see more users using the search functionality.

<div style="text-align: center">
    <img alt="Lux Example: Removed hamburger icon" src="{{ '/img/2020-12-16-mobile-design-done-right/Hamburger.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block;">
    <img alt="Lux Example: Added search bar" src="{{ '/img/2020-12-16-mobile-design-done-right/Search-bar.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
</div>

### Unreadable text

#### Contrast
More important than ever because of the smaller screen sizes is the readability of text. 
First of all, you need enough contrast between the text colour and background colour. 
You can use a tool like [Colour contrast](https://colourcontrast.cc/){:target="_blank" rel="noopener noreferrer"} to check the contrast between the foreground and background. 
For the Lux webshop, I used a grey colour that is too light for a white background. 
To change this, I played around with the colour contrast tool. 
I decided to go with a darker greyish-blue tone to grey out text and a dark grey colour for text that should be readable.

<div style="text-align: center">
    <img alt="Lux Example: Added search bar" src="{{ '/img/2020-12-16-mobile-design-done-right/Search-bar.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
    <img alt="Lux Example: Colour contrast of text" src="{{ '/img/2020-12-16-mobile-design-done-right/Text-contrast.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
</div>

#### Typeface
You need to choose a typeface that works well in multiple sizes and weights to maintain readability and usability. 
Test your typeface before using it and avoid typefaces that are complicated. 
In the Lux design, the typeface 'Stalemate' was used for the title of the items. 
This might look fun, but on smaller screens, it can be harder to read handwritten fonts.

<div style="text-align: center">
    <img alt="Lux Example: Colour contrast of text" src="{{ '/img/2020-12-16-mobile-design-done-right/Text-contrast.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
    <img alt="Lux Example: Readable typeface" src="{{ '/img/2020-12-16-mobile-design-done-right/Typeface.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
</div>

#### Font size
Don't use font sizes smaller than 12px. 
You might be tempted to make your font small on mobile screens, but readability always goes before design!

<div style="text-align: center">
    <img alt="Lux Example: Readable typeface" src="{{ '/img/2020-12-16-mobile-design-done-right/Typeface.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
    <img alt="Lux Example: Bigger font size" src="{{ '/img/2020-12-16-mobile-design-done-right/Font-size.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
</div>

### Clutter
We have a better design than what we started with, but it is still not perfect. 
A famous saying by Antoine de Saint-Exupéry can be applied to mobile UX design: 

> “Il semble que la perfection soit atteinte non quand il n'y a plus rien à ajouter, mais quand il n'y a plus rien à retrancher.“ 

which translates to: “Perfection is finally attained not when there is no longer anything to add, but when there is no longer anything to take away.” 
Get rid of everything you don't need. 

Especially when designing for mobile, you have to focus on what matters. 
In our example, there is a log out button. 
Logging out is not something people will often do and there is also an easily accessible account button available. 
That account page also has the log out functionality, so let's just remove the log out button from our header. 
Another thing we can remove is the informational text on the sales items. 
You can click on the item to read more, but there is no need to put this information on the overview.

<div style="text-align: center">
    <img alt="Lux Example: Bigger font size" src="{{ '/img/2020-12-16-mobile-design-done-right/Font-size.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
    <img alt="Lux Example: Removed clutter" src="{{ '/img/2020-12-16-mobile-design-done-right/Clutter.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
</div>

### Forms
When you want to sign up to Lux, you have to fill in a form. 
Since we are creating this application for mobile, we have to take a lot of things into account when creating this form.
Let's see what our form looks like right now...

<img alt="Lux Example: Bad form" src="{{ '/img/2020-12-16-mobile-design-done-right/Bad-form.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px;">

#### Typing too much
One thing that can scare off mobile users from filling in forms is having to type too much. 
There are many ways to still get the same information but make it easier for users to fill everything in. 
You can use their contact information to prefill forms and avoid them having to fill in their name, e-mail, phone number, etc. for the hundredth time. 
Next to that, you can make sure the right keyboard comes up when they click on a certain input. 
For example, when they are filling in a phone number, you show the number keyboard. 
That way, they don't have to change it themselves. This saves a lot of time. 
Also, something that a lot of apps are starting to do right now, is using the camera for input. 
We can use this here for the credit card number. 
People just have to scan their credit card with their camera and the number is automatically filled in. 
Next to that, you can change text inputs to different inputs that require less or no typing. 
Here, I added a date input for the birth date and a custom selector for the categories.

<div style="text-align: center">
    <img alt="Lux Example: Bad form" src="{{ '/img/2020-12-16-mobile-design-done-right/Bad-form.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
    <img alt="Lux Example: Less typing" src="{{ '/img/2020-12-16-mobile-design-done-right/Too-much-typing.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
</div>

#### Input labels
Imagine filling in a form and having to go get your credit card. 
When you come back, you might have forgotten what the other input fields were about. 
In our example, the labels are placeholders which disappear when you've entered something in them. 
The best practice for input labels is to show them at all times, because yes, people tend to forget what they were for.

<div style="text-align: center">
    <img alt="Lux Example: Labels not visible" src="{{ '/img/2020-12-16-mobile-design-done-right/Labels-not-visible.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
    <img alt="Lux Example: Labels always visible" src="{{ '/img/2020-12-16-mobile-design-done-right/Visible-labels.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
</div>

#### Break tasks into chunks
If you have a large form, break your tasks into chunks. 
You can create a step-by-step form. 
Do this by asking the main questions in the beginning and then asking questions that don't seem as important in the following steps. 
Make sure people always know why they are filling in certain information and make sure the info you're asking for is needed at that time. 
In the Lux example, I changed the form so that people can sign up with just an e-mail address and a password. 
I added an explanation for why we need the other information and why it benefits the user to fill in a second form. 
I added a save button so they can always fill it in later.

<img alt="Lux Example: Break tasks into chunks" src="{{ '/img/2020-12-16-mobile-design-done-right/Break-tasks.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px;">

### Too small buttons
There are two major rules when it comes to using buttons on a touchscreen. 
The first rule is that you need to create controls that measure at least 7–10 mm so they can be accurately tapped with a finger. 
Nothing is more annoying than having to tap very precisely with a smartphone. 
The buttons on our newly created form are very small and you might accidentally click on the wrong button. 

<div style="text-align: center">
    <img alt="Lux Example: Buttons too small" src="{{ '/img/2020-12-16-mobile-design-done-right/Buttons-too-small.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
    <img alt="Lux Example: Bigger buttons" src="{{ '/img/2020-12-16-mobile-design-done-right/Small-buttons.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
</div>

<div style="text-align: center">
    <img alt="Lux Example: Buttons too small" src="{{ '/img/2020-12-16-mobile-design-done-right/Buttons-too-small-2.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
    <img alt="Lux Example: Bigger buttons" src="{{ '/img/2020-12-16-mobile-design-done-right/Small-buttons-2.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
</div>

Rule number two is that you need to ensure that there is the right amount of spacing between tap targets.
Our tab bar looks alright, but I think a little more spacing between the buttons won't hurt. 

<div style="text-align: center">
    <img alt="Lux Example: Removed clutter" src="{{ '/img/2020-12-16-mobile-design-done-right/Clutter.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
    <img alt="Lux Example: More spacing between buttons" src="{{ '/img/2020-12-16-mobile-design-done-right/Button-spacing.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
</div>

### Underlined links
For desktop applications, we use a lot of underlined links. 
On mobile devices however, it's best to avoid them. 
Usually, links are replaced with buttons for mobile applications, because they are way easier to tap on with a touch device. 
And, one more plus: they grab your attention. 

<div style="text-align: center">
    <img alt="Lux Example: More spacing between buttons" src="{{ '/img/2020-12-16-mobile-design-done-right/Button-spacing.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
    <img alt="Lux Example: Buttons instead of links" src="{{ '/img/2020-12-16-mobile-design-done-right/Underlined-links.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
</div>

## Do's

### Put focus on what matters
The title says it all: put focus on what matters. 
Try to think about what you want users to do.
For our webshop, we want people to buy the Sale items.
There is no reason for the titles to be this big because we don't want the customer to interact with them.
We can make them smaller and make sure the Sale title stands out a bit more.
Now, our focus goes to the sale items instead of the two titles.

<div style="text-align: center">
    <img alt="Lux Example: Buttons instead of links" src="{{ '/img/2020-12-16-mobile-design-done-right/Underlined-links.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
    <img alt="Lux Example: Focus on what matters" src="{{ '/img/2020-12-16-mobile-design-done-right/Focus.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
</div>

### Provide feedback
Provide feedback on interactions so people know what's going on.
Take a look at what happens when someone adds something to their bag:

<img alt="Lux Example: Bad feedback" src="{{ '/img/2020-12-16-mobile-design-done-right/Bad-feedback.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px;">

You had to look very close to see there was something added to the bag, right?
Using a pop-up message here will grab your user's attention and make it clear the action was successful. 

<img alt="Lux Example: Good feedback" src="{{ '/img/2020-12-16-mobile-design-done-right/Good-feedback.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px;">

Another example for which you need to provide feedback is when a page is loading.
A small loading animation is enough, but don't let people think they're stuck on a page when things are loading.
It might annoy them and even let them leave your application!

<div style="text-align: center; margin-bottom: 1em;">
    <img alt="Loading animation" src="{{ '/img/2020-12-16-mobile-design-done-right/Loading-animation.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px;">
    Source: <a href="https://dribbble.com/shots/3162915-Shopping-Loader-GIF-Animation" target="_blank" rel="noopener noreferrer">LePraveen Tewatia on Dribbble</a>
</div>

### Thumb position

<div style="text-align: center; margin-bottom: 1em;">
    <img alt="Thumb position with zone chart" src="{{ '/img/2020-12-16-mobile-design-done-right/Thumb-position.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 600px;">
    Source: <a href="https://dribbble.com/shots/6869746-Twitter-Search" target="_blank" rel="noopener noreferrer">Ranjith Manoharan on Dribbble</a>
</div>

Always keep the thumb position in mind.
Know what spaces on your screen are more easily accessible with the right thumb and use them for your advantage.
What buttons do you want people to click on? As you can see on the thumb zone-chart, our bag is in the red zone.
We want people to buy stuff, so we might have to swap the places of the account and the bag button. 

<div style="text-align: center">
    <img alt="Lux Example: Focus on what matters" src="{{ '/img/2020-12-16-mobile-design-done-right/Focus.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
    <img alt="Lux Example: Thumb position" src="{{ '/img/2020-12-16-mobile-design-done-right/Thumb-position.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px; display: inline-block">
</div>

## Tips

Our Lux design is finished. Nothing is ever perfect, but we should always strive for perfection.
Here are a few more tips to help you with designing an interface for mobile!

### Test your design
In our example, we swapped the bag and account icon because we want people to easily go to the checkout.
According to our thumb zone-chart, this is the right positioning for our goal, but in practice, this might not work.
This is why you should always test your design. The numbers are what counts. 
You might have done everything by the rules and still not have the engagement you aimed for. 

### Optimizing flow
A user flow is a sequence of actions a user has to perform to acquire different functionalities in your app, such as set up, purchasing an item, ... 
Users might find the perfect app but still delete it because there is friction in one of the flows.
You can use the [Page flows website](https://pageflows.com/){:target="_blank" rel="noopener noreferrer"} to learn from proven products! 

<div style="text-align: center; margin-bottom: 1em;">
    <img alt="Flow chart" src="{{ '/img/2020-12-16-mobile-design-done-right/UX-flow-chart.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">
    Source: <a href="https://www.leanplum.com/blog/user-flow/" target="_blank" rel="noopener noreferrer">Leanplum</a>
</div>

### Onboarding
Good onboarding is essential and shows the value of your application.
A very effective way of onboarding is having an interactive tour of your app.
This is a fun and easy way for people to get the hang of using your application.
One thing to keep in mind is that your onboarding doesn't make up for the fact that some things just may not be clear to your users.
The app should still be easy to use, even when you've skipped the tutorial.

<div style="text-align: center; margin-bottom: 1em;">
    <img alt="Onboarding example" src="{{ '/img/2020-12-16-mobile-design-done-right/Onboarding.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 800px;">
    Source: <a href="https://www.habitify.me/" target="_blank" rel="noopener noreferrer">Habitify app</a>
</div>

### Response time
One thing that is especially important to keep in mind for us developers is the response time.
As technology progresses, people get more impatient and they might leave your app if they have to wait longer than 2 seconds for something to load.
We directly influence the response time, and we should continuously improve the quality of our code.
It's also interesting to take a look at your target audience.
We are used to fast internet connections in Western Europe but other countries might not have that privilege.

<div style="text-align: center; margin-bottom: 1em;">
    <img alt="Bounce time" src="{{ '/img/2020-12-16-mobile-design-done-right/Bounce-time.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px;">
    Source: Google/SOASTA Research, 2017
</div>

### Prioritize features
You can pack your app with thousands of interesting features to make it more attractive to potential users.
While you might have a lot of traffic going to your application, a lot of users will be scared off by the overload of features.
The rule is to prioritize the features your application needs and omit the nice-to-haves.

### Asking for permissions
Your app might need permission for using the user's location at some point.
Don't ask for this the moment they open your application.
The user might not get why they have to give you permission and will decline the request.
That would mean they have to go back into their settings later.
Instead, ask for it whenever they are starting to use the feature that needs location and provide a clear message as to why you need this permission.

<div style="text-align: center; margin-bottom: 1em;">
    <img alt="Approach for asking for permissions" src="{{ '/img/2020-12-16-mobile-design-done-right/Location-permission.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 600px;">
    Source: <a href="https://www.plotprojects.com/blog/how-to-ask-for-location-permissions-in-ios11-recommended-approaches-10-examples/" target="_blank" rel="noopener noreferrer">PlotProjects</a>
</div>

### Tooltips
Tooltips display information when a user hovers, focus on or taps on an element. 
Most commonly, a tooltip is shown on hover, but there is no such thing as hover on a mobile device.
You can show it on long press, but people might not even know it's there.

<div style="text-align: center; margin-bottom: 1em;">
    <img alt="Approach for tooltips on mobile" src="{{ '/img/2020-12-16-mobile-design-done-right/Tooltips.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 600px;">
    Source: <a href="https://material.io/components/tooltips#placement" target="_blank" rel="noopener noreferrer">Material Design</a>
</div>

Ask yourself the question: do I really need to hide this tooltip?
You can show the tooltip by default or conveniently place it alongside the element you would hover over.
While on large screens a tooltip might look really small, it will draw the attention on smaller devices.
Another good practice for mobile is to hide it behind a hint icon. 
By using hints like a question mark or info icon, you can make it clear that tapping on this icon could open a tooltip.

## Trends of 2020

### Advanced animation
Animation can give the user feedback on their actions and add some rhythm to interactions.
Advanced animations are animations that are used as part of the branding of a company.
It can help you express your brand and build loyalty.

*Note: A lot of people get motion sickness because of animations. There should always be a way to turn off or minimize animations in your application.*

<div style="text-align: center; margin-bottom: 1em;">
    <img alt="Advanced animation" src="{{ '/img/2020-12-16-mobile-design-done-right/Advanced-animation.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 600px;">
    Source: <a href="https://dribbble.com/shots/6832505-Food-Menu" target="_blank" rel="noopener noreferrer">Asha Rajput on Dribbble</a>
</div>

### Personalizations
Artificial Intelligence is rapidly gaining popularity and is being used in everyday applications.
Apps like Spotify and Netflix use AI to recommend certain songs or movies.
This way of personalization can add value to your application and might make it easier for users to find what they are looking for.

<div style="text-align: center; margin-bottom: 1em;">
    <img alt="Discover Weekly on Spotify" src="{{ '/img/2020-12-16-mobile-design-done-right/Discover-Spotify.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 500px;">
    Source: <a href="https://medium.com/the-sound-of-ai/spotifys-discover-weekly-explained-breaking-from-your-music-bubble-or-maybe-not-b506da144123" target="_blank" rel="noopener noreferrer">Medium</a>
</div>

### Password-less login
As I already mentioned in the part about forms, mobile users don't like to type.
Because of that, new ways of logging in are coming to the surface.
Popular alternatives for passwords are: facial or fingerprint recognition, sign-in links via mail or text and using key generators. 

<div style="text-align: center; margin-bottom: 1em;">
    <img alt="Password-less login" src="{{ '/img/2020-12-16-mobile-design-done-right/Passwordless.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 500px;">
    Source: <a href="https://dribbble.com/shots/2260567-Password-less-login" target="_blank" rel="noopener noreferrer">Jason Zimdars on Dribbble</a>
</div>

### Dark themes
Dark themes have two essential advantages: they use less battery power and reduce eye strain.
A lot of popular apps give you the choice to swap between a light or dark theme or automatically swap between those two during the day or night.
Others just go all the way and embrace the dark theme!

<div style="text-align: center; margin-bottom: 1em;">
    <img alt="Dark vs. light theme" src="{{ '/img/2020-12-16-mobile-design-done-right/Dark-light-theme.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 600px;">
    Source: <a href="https://blog.smartlauncher.net/designing-a-dark-theme-on-android-2dd9a1da16db" target="_blank" rel="noopener noreferrer">Giovanni Piemontese on SmartLauncher</a>
</div>

### Skeleton screens
People don't like waiting and you might have done everything to have a fast load time, but it still doesn't feel like enough.
Skeleton screens are being used by big companies like Facebook to give you a feeling of fast loading.
Skeleton screens give you a general idea of what the page is going to look like in a wireframe-like design. 

<div style="text-align: center; margin-bottom: 1em;">
    <img alt="Skeleton screen Facebook" src="{{ '/img/2020-12-16-mobile-design-done-right/Skeleton-screen.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px;">
    Source: <a href="https://medium.com/the-aesthetic-programmer/facebook-loading-labels-animation-simple-approach-for-skeleton-view-in-swift-4-4fcdfeffd121" target="_blank" rel="noopener noreferrer">Medium</a>
</div>

## Are we done yet?
We will never be done redesigning our website for mobile. 
There's always something we could do better.
You can find many more tips and tricks for mobile design online, 
but these key points will always help you:

- People are lazy, literally! People don't grab their phone to write out monologues, but just type some emojis and get it over with.
- Mobile screens are really small, don't pack everything on them and keep removing everything you don't need.
- Have you ever heard anyone say "I've got fat fingers" except for when they are using a smartphone? Make your tap targets big enough!

User testing is one of the most important things to do when improving your user experience.
There is always more to learn about mobile design and it is definitely worth looking more into user testing.
If you're looking for UI/UX experts to help you tackle these issues, don't hesitate to contact my colleagues at [ClockWork](http://www.cw.be/){:target="_blank" rel="noopener noreferrer"}!

*Icons on Lux prototype made by <a href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry" target="_blank" rel="noopener noreferrer">Kiranshastry</a> from <a href="https://www.flaticon.com/" title="Flaticon" target="_blank" rel="noopener noreferrer">www.flaticon.com</a>*
