---
layout: post
authors: [michael_dewree]
title: 'Scaling CSS with BEM'
image: /img/2020-08-06-kubernetes-clients-comparison/banner.jpg
tags: [BEM, CSS]
category: Frontend
comments: true
---

# Table of Contents

* [What is Bem](#what-is-bem)

# What is BEM?

<blockquote class="clear">
<p>
BEM is a methodology that helps you to create reusable components and code sharing in front-end development.
<p>
</blockquote>

BEM is an abbreviation of the key elements of the methodology: Block, Element and Modifier.

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

## What do we need it for?

<blockquote>
<p>
BEM is a highly useful, powerful, and simple naming convention that makes your front-end code easier to read and understand, easier to work with, easier to scale, more robust and explicit, and a lot more strict.
</p>
</blockquote>
