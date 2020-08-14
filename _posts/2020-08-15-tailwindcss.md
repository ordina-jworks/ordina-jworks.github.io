---
layout: post
authors: [frederic_ghijselinck]
title: "Using Tailwind CSS as a base for a Design System"
image: /img/2020-08-15-tailwindcss/tailwind-500-293.jpg
tags: [CSS, JavaScript, Design Systems, Design, Tailwind]
category: Frontend
comments: true
---

> In the beginning of the year we had the opportunity to build a design system for a large customer.
> So how did we start?
> Well, putting together designers and developers to find the correct tools and frameworks to get it done.

# Table of Contents

* [Choosing the correct CSS strategy](#choosing-the-correct-css-strategy)
* [Evaluating Tailwind CSS](#evaluating-tailwind-css)
* [Conclusion](#conclusion)

# Choosing the correct CSS strategy

When we (developers) talked to the designers, they wanted a clean CSS sheet without unnecessary classes.
This means we only need to foresee the classes they wanted to be available in the design system, nothing more.

* Building the CSS from the ground up was the first idea.
That way we could only write classes we actually needed.
Since we didn't had all the time to write so much CSS classes we decided we couldn't do this.

* CSS libraries like [Bootstrap](https://getbootstrap.com/){:target="_blank" rel="noopener noreferrer"}, [Foundation](https://get.foundation/){:target="_blank" rel="noopener noreferrer"}, [Materialise](https://materializecss.com/){:target="_blank" rel="noopener noreferrer"}, ... have too much classes by default.
 As a side note, we looked for ways to disable certain classes, but those libraries are too complicated to customise.

* Another solution could be the use of 'utility-first' CSS frameworks.
We liked the idea of [Tailwind CSS](https://tailwindcss.com/){:target="_blank" rel="noopener noreferrer"} to use a single config file and generate all the necessary classes.

# Evaluating Tailwind CSS

When we had a closer look at Tailwind we saw a lot of positive points, but some negative as well.
Below you can find some valuable points we like to share:

### Configurable in JavaScript

We're JavaScript engineers, so we love the fact we can just write our config in JSON.
We used constants to define the various configurations and then put it in the module exports:

```javascript
// tailwind.config.js
const colors = {
    error: {
        100: '#fce9ea',
        500: '#e72f3c',
        700: '#971e26',
    },
    success: {
        100: '#e7f5ed',
        500: '#34ab66',
        700: '#226f42',
    },
};

const fontSize = {
    s1: '0.75rem',
    s2: '0.875rem',
    s3: '1.125rem',
    m1: '1.25rem',
    m2: '1.5rem',
    m3: '1.75rem',
    l1: '2.25rem',
};

const fontWeight = {
    regular: '400',
    bold: '700',
};

const screens = {
    sm: { max: '640px' },
    md: { min: '641px', max: '960px' },
    lg: { min: '961px', max: '1280px' },
    xl: { min: '1281px' },
};

module.exports = {
    theme: {
        colors,
        fontSize,
        fontWeight,
        screens,
    },
};
```
As you can see this is very customisable.
You can use your own namings for almost everything like colors, fonts, screens, ...

More info can be found in the [configuration documentation](https://tailwindcss.com/docs/configuration/){:target="_blank" rel="noopener noreferrer"}.

### Responsive

You can completely customise your responsive breakpoints in the config file.
By default, Tailwind's breakpoints only include a min-width and don't include a max-width, which means any utilities you add at a smaller breakpoint will also be applied at larger breakpoints.
If you'd like to apply a utility at one breakpoint only, the solution is to undo that utility at larger sizes by adding another utility that counteracts it.
Or you simply overwrite the defaults, so they include a min and max value.

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'tablet': { max: '640px' },
      // => @media (max-width: 640px) { ... }

      'laptop': { min: '641px', max: '1024px' },
      // => @media (min-width: 641px) and (max-width: 1024px) { ... }

      'desktop': { min: '1015px'},
      // => @media (min-width: 1025px) { ... }
    },
  }
}
```

Once you configured the screens, you can use the screen prefix everywhere so your design can be responsive.

```html
<div class="bg-error-500 tablet:bg-error-100">
    Error message
</div>
```

### Component classes can be extracted

While you can do a lot with just utility classes, as a project grows it can be useful to codify common patterns into higher level abstractions.
Keeping a long list of utility classes in sync across many component instances can quickly become a real maintenance burden, so when you start running into painful duplication like this, it's a good idea to extract a component.

```html
<!-- Repeating these classes for every button can be painful -->
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Button
</button>
```

For small components like buttons and form elements, you can use Tailwind's `@apply` directive to easily extract common utility patterns to CSS component classes.

Here's what a `.btn-blue` class might look like using `@apply` to compose it from existing utilities:

```css
.btn-blue {
  @apply bg-blue-500 text-white font-bold py-2 px-4 rounded;
}
.btn-blue:hover {
  @apply bg-blue-700;
}
```

### Usable with preprocessors like Sass

Since Tailwind is a PostCSS plugin, there's nothing stopping you from using it with Sass, Less, or other preprocessors, just like you can with other PostCSS plugins like Autoprefixer.

The most important thing to understand about using Tailwind with a preprocessor is that preprocessors like Sass run separately, before Tailwind.
This means that you can't feed output from Tailwind's theme() function into a Sass color function for example, because the theme() function isn't actually evaluated until your Sass has been compiled to CSS and fed into PostCSS.

### Readability

A negative point could be the readability.
Sometimes a list of classes can grow big and is unable to be understand properly.
The need to extract a component class can be a solution (as mentioned above), but this is not always possible.

```html
// example of a big class-list
<div class="grid sm:col-span-2 md:col-span-3 lg:col-span-3 xl:col-span-3 w-full bg-blue-500 text-white font-bold h-20 py-2 px-4 my-5 mt-4 rounded"></div>
```

### Custom Tailwind plugins

Although we could do everything with Tailwind, we needed to have some Sass variables separately available to use in our web components.
Therefor we used a plugin to generate Sass variables based on your Tailwind config.

More information to write and use your own plugins can be found on [Tailwind's documentation website](https://tailwindcss.com/docs/plugins/){:target="_blank" rel="noopener noreferrer"}.

```javascript
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    require('tailwind-scss-variables')(
        ['theme.colors', 'theme.screens'],
        './src/scss/partials/_tailwind-variables.scss',
    ),
  ]
}
```

# Conclusion

After using Tailwind CSS for almost 6 months now.
We still find we made the correct choice.
Given the fact we still don't have the time to write css ourselves, finding the correct utility class is fairly easy using the documentation, or even on a (printed) [cheat sheet](https://nerdcave.com/tailwind-cheat-sheet/){:target="_blank" rel="noopener noreferrer"}.
