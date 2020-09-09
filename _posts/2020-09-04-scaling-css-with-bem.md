---
layout: post
authors: [michael_dewree]
title: 'Scaling CSS with BEM'
image: /img/2020-08-06-kubernetes-clients-comparison/banner.jpg
tags: [BEM, CSS, DESIGN, FRONTEND, CDD]
category: Frontend
comments: true
---

# Table of Contents

* [What is BEM?](#what-is-bem)
* [BEM combined with SASS](#bem-combined-with-sass)
* [Component Driven Development and BEM](#component-driven-development-and-bem)
* [Resources and interesting reads](#resources-and-interesting-reads)

# What is BEM?


[BEM](https://getbem.com/){:target="_blank" rel="noopener noreferrer"} is a methodology that helps developers to create reusable components and code sharing in front-end development.


## What does it stand for?
[BEM](https://getbem.com/){:target="_blank" rel="noopener noreferrer"} is an abbreviation as you could have guessed.
It stands for the three core elements of the methodology: Block, Element and Modifier.

Blocks are standalone entities that are meaningful on its own.
For example: 
{% highlight html %}
header, container, menu, checkbox, input
{% endhighlight %}

Elements are a part of a block that has no standalone meaning and are semantically tied to its block.
For example: 
{% highlight html %}
menu item, list item, header title
{% endhighlight %}

Modifiers are a flag on a block or element.
They are meant to change appearance or behavior.
For example: 
{% highlight html %}
disabled, highlighted, color yellow, size big, fixed
{% endhighlight %}

## BEM is a naming convention

BEM is in short a highly useful, powerful, and simple [naming convention](https://getbem.com/naming){:target="_blank" rel="noopener noreferrer"}.

It makes your front-end code easier to read and understand.
Which makes it also easier to work with and easier to scale, more robust and explicit, and a lot more strict.

Namings of BEM are as followed:
| BEM | Naming | HTML | CSS |
| :-: | :-: | :-: | :-: |
| Block | .block | `<div class="block"></div>` | `.block {...}` |
| Element | .block__element | `<div class="block__element"></div>` | `.block__element {...}`
| Block Modifier | .block--modifier | `<div class="block block--modifier></div>`   | `.block--modifier {...}` |
| Element Modifier | .block__element--modifier | `<div class="block__element block__element--modifier></div>` | `.block__element--modifier {...}` |

For example:
You have 2 images.
One on it's own as a 'block' and the other is an 'element' inside a profile section which is another 'block' to keep it simple.

This is how the HTML would look like:
```html
    <img class="image"/>
    <div class="profile">
        <img class="profile__image"/>
    </div>
```
The CSS would look like this:
```CSS
    .image {...}
    .profile {...}
    .profile__image {...}
```

If you want to add different versions, states or 'modifiers', for example a rounded or smaller image. 
Your code would look like this:

```html
    <img class="image image--rounded"/>
    <div class="profile">
        <img class="profile__image profile__image--small"/>
    </div>
```
```CSS
    .image {...}
    .image--rounded {...}
    .profile {...}
    .profile__image {...}
    .profile__image--small {...}
```

The modifier class should only be added to blocks or elements you want to modify and you should always keep the original class.

## When should you not use BEM?
You should always question yourself if it is really necessary to use BEM notation for a certain CSS class.

If we would add two buttons to the example above like so:
```html
    <img class="image"/>
    <button class="button">Default button</button>
    <div class="profile">
        <img class="profile__image"/>
        <button class="profile__button">Default button</button>
    </div>
```
Should the second button be styled differently because it lives inside the profile block you should use BEM notation.
Otherwise if it should be styled the same as the other button and it just happens to live in profile you definitely do not need BEM notation there.

```CSS
.underline { text-decoration: underline; }
```
This CSS would never fall into any BEM category, as it is merely a standalone rule.

# BEM combined with SASS
Is the BEM methodology easy to combine with preprocessors like [SASS](https://sass-lang.com){:target="_blank" rel="noopener noreferrer"}?
The answer is: 'Yes, absolutely!'

With the help of SASS and its ['parent selector'](https://sass-lang.com/documentation/style-rules/parent-selector){:target="_blank" rel="noopener noreferrer"} we could transform the above CSS to the following code:

```CSS
    .image {
        &--rounded {...}
    }
    .profile {
        &__image {
            &--small {...}
        }
    }
```

The parent selector of SASS makes it easy to add suffixes to the outer selector resulting in cleaner style sheets.

# Resources and interesting reads
BEM
Why BEM in a nutshell
SASS
BEM and SASS a perfect match
...
