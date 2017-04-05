---
layout: post
authors: [jan_de_wilde,frederic_ghijselinck,orjan_de_smet]
title: "Optimising performance of your Enterprise Angular Application"
image: /img/optimising-performance-of-your-enterprise-angular-application.png
tags: [Angular]
category: Angular
comments: true
---

This blog post contains best practices that helped us optimise performance of our Enterprise Angular (v2+) Application we created for one of our clients.
The project has been created in under 6 months with a dedicated team of 7 people of which 4 people are from the JWorks unit (2 front-end, 2 backend) and consists of two Angular Applications that use modules and components from a shared library.
The use of Angular Universal does not apply (yet) for this project.

### Topics

1. [Lazy loading](#1-lazy-loading)
1. [Code splitting and commons chunk plugin (webpack)](#2-code-splitting-and-commons-chunk-plugin-webpack)
1. [ChangeDetectionStrategy: OnPush](#3-changedetectionstrategy-onpush)
1. [Reusable CSS with BEM and Sass](#4-reusable-css-with-bem-and-sass)
1. [GZIP](#5-gzip)
1. [AOT](#6-aot)

# 1. Lazy loading

Lazy loading your project modules can greatly enhance performance.

After each successful navigation, the router looks in its configuration for an unloaded module that it can preload.
Whether it preloads a module, and which modules it preloads, depends upon the preload strategy.
The Router offers two preloading strategies out of the box:

* No preloading at all which is the default. Lazy loaded feature areas are still loaded on demand.
* Preloading of all lazy loaded feature areas.

We implemented the PreloadAllModules strategy in its default configuration, but know that it is possible to create your own custom preloading strategy.

To do so, include the preloadingStrategy in your @NgModule like so:

{% highlight coffeescript %}
@NgModule({
    ...
    imports: [
        RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules })
    ]
});
{% endhighlight %}

And define your routes like this:

{% highlight coffeescript %}
{
    path: 'performance',
    loadChildren: 'performance.module#PerformanceModule',
    canLoad: [AuthGuard] // Optional
}
{% endhighlight %}

Note that when using guards, the CanLoad guard blocks loading of feature module assets until authorised to do so.
If you want to both preload a module and guard against unauthorised access, [use the CanActivate guard instead](https://angular.io/docs/ts/latest/guide/router.html#!#canload-blocks-preload).

Want to get started with lazy loading?
Maybe create a custom preloading strategy?
Check out the talk [Manfred Steyer gave at NG-BE 2016](https://www.youtube.com/watch?v=i0y5bJx8RFc) about improving start-up performance with lazy loading or [view the Angular docs](https://angular.io/docs/ts/latest/guide/router.html#!%23milestone-6-asynchronous-routing).


# 2. Code splitting and commons chunk plugin (webpack)

[Code splitting](https://webpack.js.org/guides/code-splitting/) is one of the most compelling features of webpack.
It allows you to split your code into various bundles which you can then load on demand — like when a user navigates to a matching route, or on an event from the user.
This allows for smaller bundles, and allows you to control resource load prioritization, which, if used correctly, can have a major impact on your application load time.
There are mainly two kinds of code splitting that can be accomplished with webpack: "Vendor code splitting" and "On demand code-splitting" (used for lazy loading).

The CommonsChunkPlugin is an opt-in feature that creates a separate file (known as a chunk), consisting of common modules shared between multiple entry points.
By separating common modules from bundles, the resulting chunked file can be loaded once initially, and stored in cache for later use.
This results in pagespeed optimisations as the browser can quickly serve the shared code from cache, rather than being forced to load a larger bundle whenever a new page is visited.

Among other optimisations the [extra async commons chunk](https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk) allows us to drastically improve performance by moving common modules out of the parent so that a new async-loaded additional commons chunk is used, which decreases initial load time.
This is automatically downloaded in parallel when the additional chunk is downloaded.

{% highlight coffeescript %}

new webpack.optimize.CommonsChunkPlugin({
  children: true,
  // (use all children of the chunk)

  async: true,
  // (create an async commons chunk)
});

{% endhighlight %}


# 3. ChangeDetectionStrategy: OnPush

## 3.1 The problem

Unlike using a Virtual DOM, like ReactJS, Angular uses change detection to update the actual DOM presented to the user.
Each component in an Angular application has its own change detector and in order to guarantee the latest data is always presented to the user, the default change detection strategy on an Angular component is set to always update.
This means that any time JavaScript finishes executing, Angular will check for changes in all components.
This usually works fast in small applications.

However, when a component has a large subset of components (e.g.: a list with several items in which every row is presented by a component), performance may take a hit, even when (almost) nothing changes.
The reason is that, due to the default change detection, Angular will also check for updates on a component when a change occurs on its siblings or ancestors or child components, while this is not needed in most cases.

## 3.2 The solution

Next to trying to have less DOM, the solution is to use the OnPush strategy for change detection.
The OnPush strategy will let the change detector run only in the following situations:

* when an event handler is fired in the component
* when one of its input properties changes
* when you manually request the change detector to look for changes (using ChangeDetectorRef's function markForCheck())
* when a child's change detector runs

## 3.3 Setting up OnPush

There are two ways to set up the OnPush strategy

### 3.3.1. Immutable input objects

   The simplest way is to use only immutable objects.

   {% highlight coffeescript %}
   import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

   @Component({
       selector: 'my-sub-component',
       template: `{% raw %}{{ item.name }}{% endraw %}`,
       changeDetection: ChangeDetectionStrategy.OnPush
   })
   export class MySubComponent implements OnInit {
       @Input() item: {name: string};

       constructor() {}
   }
   {% endhighlight %}

   The change detector will only run when the input property 'item' changes.
   The key here is to update the reference to the object.
   The change detector won't run when something inside the object (e.g.: property 'name') changes.

### 3.3.2. Observable input objects

   Another way is to use observables as inputs.

   {% highlight coffeescript %}
   import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

   @Component({
       selector: 'my-sub-component',
       template: `{% raw %}{{ myItemName }}{% endraw %}`,
       changeDetection: ChangeDetectionStrategy.OnPush
   })
   export class MySubComponent implements OnInit {
       @Input() itemStream:Observable<any>;
       myItemName: string;

       constructor(private changeDetectorRef: ChangeDetectorRef) {}

       ngOnInit() {
           this.itemStream.subscribe(i => {
               this.myItemName = item.name;
               this.changeDetectorRef.markForCheck();
           });
       }
   }
   {% endhighlight %}

   The change detector will run when the itemStream emits a new item.

As change detection is run from top to bottom components, start by setting OnPush on the leaf components and work your way up.
This allows to skip change detection in entire subtrees.


# 4. Reusable CSS with BEM and Sass

Sass has been an all-time favorite for writing structured and maintainable CSS for large projects.
We combined this with the [BEM methodology](https://en.bem.info/methodology/) which helps to create extendable and reusable interface components.
We used this approach on our project to create a style guide in the shared module that includes all working components used in the application.

Once most of the components were available we could simply start including them in the modules that needed to be built.
This greatly decreased the time needed to build the functional module.

Things like colors, typography, utilities, etc. are bundled in separate files that can be included where needed.
This prevents writing the same CSS over and over again and keeps the code base small(er).


# 5. GZIP

Gzip is a file format and also a method of compressing files (making them smaller) for faster network transfers.
It allows your web server to provide files with a smaller size that will be loaded faster by your browser.
Compression of your files with gzip typically **saves around fifty to seventy percent** of the file size.

You can easily enable gzip compression on your server by editing your .htaccess file:

{% highlight htaccess %}
#Set to gzip all output
SetOutputFilter DEFLATE

#exclude the following file types
SetEnvIfNoCase Request_URI \.(?:exe|t?gz|zip|iso|tar|bz2|sit|rar|png|jpg|gif|jpeg|flv|swf|mp3)$ no-gzip dont-vary

#include the following file types
AddType x-font/otf .otf
AddType x-font/ttf .ttf
AddType x-font/eot .eot
AddType image/x-icon .ico
AddType image/png .png
AddType image/svg+xml .svg

AddOutputFilterByType DEFLATE text/plain
AddOutputFilterByType DEFLATE text/html
AddOutputFilterByType DEFLATE text/xml
AddOutputFilterByType DEFLATE text/css
AddOutputFilterByType DEFLATE application/xml
AddOutputFilterByType DEFLATE application/xhtml+xml
AddOutputFilterByType DEFLATE application/rss+xml
AddOutputFilterByType DEFLATE application/javascript
AddOutputFilterByType DEFLATE application/x-javascript
AddOutputFilterByType DEFLATE image/svg+xml

#set compression level
DeflateCompressionLevel 9

#Handle browser specific compression requirements
BrowserMatch ^Mozilla/4 gzip-only-text/html
BrowserMatch ^Mozilla/4.0[678] no-gzip
BrowserMatch bMSIE !no-gzip !gzip-only-text/html

# Make sure proxies don't deliver the wrong content
Header append Vary User-Agent env=!dont-vary
{% endhighlight %}


# 6. AOT

At the time of writing, the application still runs using the just-in-time (JIT) compiler.
But we are looking into how we can integrate AOT.

JIT compilation incurs a runtime performance penalty.
Views take longer to render because of the in-browser compilation step.
The application is bigger because it includes the Angular compiler and a lot of library code that the application won't actually need.
Bigger apps take longer to transmit and are slower to load.

Compilation can uncover many component-template binding errors.
JIT compilation discovers them at runtime, which is late in the process.

The [ahead-of-time (AOT) compiler](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html) can catch template errors early and improve performance by compiling at build time.

### AOT ensures

* Faster rendering
* Fewer asynchronous requests
* Smaller Angular framework download size
* Earlier detection of template errors
* Better security


# Conclusion

While Angular states it’s performance driven out of the box, it is very important to optimise, where possible, especially when building a large Enterprise Angular Application.
As you can see it’s not that difficult to integrate, so why wouldn’t you?
Every bit of data that doesn’t end up downloading to the device of your users is a bless.

**Hat tip:** Try to integrate these changes when setting up your project.
It would be a shame to end up refactoring your code when halfway into development.
