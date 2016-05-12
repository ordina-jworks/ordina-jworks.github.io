---
layout: post
authors: [jan_de_wilde]
title: 'Adding TypeScript to Ionic Framework'
image: /img/ionic-and-typescript.jpg
tags: [TypeScript,Ionic]
category: Ionic
comments: true
---

### Ionic and TypeScript sitting in a tree

So, [TypeScript](http://www.typescriptlang.org/) is the all new thing that allows you to use features from ES6 (or ES2015), ES7 and beyond.
Say goodbye to loosely typed variables and say hello to modules, classes, interfaces and so much more.

In order to use TypeScript in an Ionic Framework project there are a few small things you need to do to get things running.

## 1. Install and configure the gulp package

* Install the **gulp-tsc package** and save it to the development dependencies in `package.json`

   {% highlight text %}npm install gulp-tsc --save-dev{% endhighlight %}

* Next, require the package in your **gulpfile.js** like so

   {% highlight text %}var typescript = require('gulp-tsc');{% endhighlight %}

* Add the following line to the paths object: `ts: ['./src/*.ts', './src/**/*.ts']`.
You may have noticed two things here: All my TypeScript files are in a **src folder** which means I'm **not using the www folder** that Ionic provides by default.
This way I can keep the TypeScript files and JavaScript files separated.
Next to that I'm also targeting subfolders in that folder because I'm bundling my logic based on AngularJS modules.
You can read more about structuring an AngularJS project in the [John Papa AngularJS Style Guide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#application-structure-lift-principle).

* Add our compile task

   {% highlight text %}
gulp.task('compile', function(){
    gulp.src(paths.ts)
        .pipe(typescript({ emitError: false }))
        .pipe(gulp.dest('www/'));
});{% endhighlight %}

* Add our task to watch

   {% highlight text %}
gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.ts, ['compile']);
});{% endhighlight %}

* Now change the **ionic.project** file and add the compile task to the gulpStartupTasks. If the gulpStartupTasks section is not present at all, just add it anyway.

   {% highlight text %}
"gulpStartupTasks": [
    "sass",
    "compile",
    "watch"
]{% endhighlight %}

## 2. Add TSD

TSD is a **TypeScript Definition manager** for [DefinitelyTyped](http://definitelytyped.org/).
TypeScript used TypeScript Definition files so it knows how to handle the TypeScript you are writing and gives you intellisense.
Let's install TSD so we can continue.

{% highlight text %}
$ sudo npm install -g tsd
$ tsd install ionic cordova --save
{% endhighlight %}

This will create a typings folder which contains a tsd.d.ts file with references to the typings needed for ionic and cordova.
In the root of your project a tsd.json file will be created with all the installed definitions.
All you need to do to use the typings in your TypeScript file is include it at the top like so:

{% highlight text %}
/// <reference path="../typings/tsd.d.ts" />
{% endhighlight %}

**Note:** TSD has been deprecated in favour of [Typings](https://github.com/typings/typings) to manage and install TypeScript definitions.
More info on how to switch from TSD to Typings can be found [here](https://github.com/typings/typings/blob/master/docs/tsd.md).

## 3. Prevent editor from compiling on save

Now to prevent your editor to auto compile TypeScript we add a tsconfig.json file to the src folder with this in it:

{% highlight text %}
{
    "compileOnSave": false
}
{% endhighlight %}

## 4. Add TypeScript files in src folder

Now that we have everything set up it's time to start refactoring your application.
It's important to know that **every JavaScript file is essentially TypeScript** because TypeScript is a superset of the current JavaScript implementation.
This basically means that you can take your JavaScript files from your www folder, paste them to the src folder and rename them from `file.js` to `file.ts`.
Of course don't forget to add the reference on top of your files to the tsd.d.ts file in the typings folder.

If you now run `ionic serve`, you should see a message that looks like this one. `“Compiling TypeScript files using tsc version x.x.x”`.
TypeScript will process these files and write ES5 files to the www folder.

## Conclusion

As you can see it is fairly simple - just 4 steps - to add TypeScript support to your Ionic project by changing the default gulp setup used by Ionic.
It's nice to know that Ionic 2 will have support for TypeScript built in so you won't have to do it yourself.
By adding a flag `--ts` to your Ionic 2 project setup it will be enabled.

Personally I love using TypeScript and will use it whenever I can.
It makes my life as a developer a lot easier by spotting errors before I even hit the browser.

What are your thoughts about TypeScript? Feel free to add them in the comments section.
