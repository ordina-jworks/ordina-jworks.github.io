---
layout: post
authors: [michael_dewree]
title: 'Scaling CSS with BEM'
image: /img/BEM.jpeg
tags: [BEM, CSS, DESIGN, FRONTEND, CDD, FRONTEND ARCHITECTURE]
category: Frontend
comments: true
---

# Table of Contents

* [What is BEM?](#what-is-bem)
* [BEM combined with SASS](#bem-combined-with-sass)
* [Is BEM still viable in the era of web components?](#is-bem-still-viable-in-the-era-of-web-components)
* [Conclusion](#conclusion)
* [Resources and interesting reads](#resources-and-interesting-reads)

# What is BEM?
[BEM](https://getbem.com/){:target="_blank" rel="noopener noreferrer"} is a methodology that helps developers to create reusable components and code sharing in front-end development.

BEM is an abbreviation as you could have guessed.
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

## BEM: a naming convention
BEM is in short a highly useful, powerful, and simple [naming convention](https://getbem.com/naming){:target="_blank" rel="noopener noreferrer"}.

It makes your front end code easier to scale, more robust and explicit, and a lot more strict.
Which makes it easier to read and understand and also easier to work with.

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

The modifier class should only be added to blocks or elements you want to modify and you should keep the original class.

## Why use BEM?

As stated above, BEM makes your code easier to read, understand, work with et cetera.
But how does it achieve that?

First of all, BEM avoids inheritance and provides some sort of scope by using unique CSS classes per element (like .profile__image).
It reduces style conflicts by keeping CSS specificity to a minimum level.
It avoids the use of element type selectors like `div > ul > li` and keeps your CSS loose coupled from your HTML.
BEM avoids nesting and keeps your CSS flat (even with preprocessors).


## When not to use BEM?
You should always question yourself if it is really necessary to use BEM notation for a certain CSS class.

If we would add two buttons to the example above like so:
```html
<img class="image"/>
<button class="button">Default button</button>
<div class="profile">
    <img class="profile__image"/>
    <button class="profile__button">Profile button</button>
</div>
```
If the second button should be styled differently because it lives inside the profile block you SHOULD use BEM notation.
Otherwise if it should be styled the same as the other button and it just happens to live in profile you definitely DO NOT need BEM notation there.

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

The parent selector of SASS makes it easy to add suffixes to the outer selector resulting in an improvement of readability and cleaner style sheets.

All while the resulting CSS stays flat.
The above SASS compiles to:

```CSS
.image {...}
.image--rounded {...}
.profile {...}
.profile__image {...}
.profile__image--small {...}
```

As you can see it is the same CSS as above.
You want to be avoiding CSS combinators like this:

```CSS
.profile .profile__image .profile__image--small {...}
``` 

# Is BEM still viable in the era of web components?
Yes and no.

First of all BEM was created to make large scale style sheets easier to scale, read et cetera.
It avoids class name collisions and the quick fixes with '!important'.

When you are working component based, you can make use of Shadow DOM to make the styles encapsulated in that component.
This prevents them from affecting outer elements.
Angular, Vue or React use similar approaches, either using Shadow DOM or appending unique attributes to the class names.
This ensures that the styles are scoped to that certain component.

Since this makes class name collisions no issue anymore you could consider BEM obsolete.

BEM helps you create reusable components.
But that is also no longer necessary here, because we are already using seperate components.

Although, I still believe BEM could be useful as a developer.
Take our profile component for example.
With the traditional approach, profile would be seen as the Block and we would end up with following classes:

```CSS
.profile {...}
.profile__header {...}
.profile__header__title {...}
.profile__header__title--short {...}
.profile__header__name {...}
.profile__bio {...}
.profile__image {...}
.profile__image--small {...}
.profile__image-description {...}
```

By encapsulating the styles, we could drop the profile part as we already are inside the profile component.
We do not need to worry about class name collisions, so we can shorten our class names and keep them meaningful:

```CSS
.profile {...}
.header {...}
.header__title {...}
.header__title--short {...}
.header__name {...}
.bio {...}
.image {...}
.image--small {...}
.image-description {...}
```
Now the responsibility of each class is much clearer just by looking at it.
It is easier to split the component later if needed, and overall it is much easier to read.

So is BEM still necessary in component driven development?
No, not at all, but I do recommend using a convention, be it BEM or anything else.
The most important part is that the team agrees on it and follows it.
Consistency is 'mucho importante' to keep the code base lean and clean.

# Conclusion
BEM is a useful class naming convention to keep gigantic style sheets organisable and readable and to avoid class name collisions.

It is easy to use with preprocessors as SASS which makes your code even cleaner.

In CDD (component driven development) BEM might be considered obsolete, but a naming convention is still recommended.
This counts for any language, including CSS.

# Resources and interesting reads
[BEM](https://getbem.com/){:target="_blank" rel="noopener noreferrer"}

[SASS](https://sass-lang.com){:target="_blank" rel="noopener noreferrer"}

[BEM and SASS a perfect match](https://medium.com/@andrew_barnes/bem-and-sass-a-perfect-match-5e48d9bc3894){:target="_blank" rel="noopener noreferrer"}

[What is the Shadow DOM](https://bitsofco.de/what-is-the-shadow-dom/){:target="_blank" rel="noopener noreferrer"}

[CDD (Component Driven Development)](https://www.componentdriven.org/){:target="_blank" rel="noopener noreferrer"}