---
layout: post
authors: [elke_heymans]
title: "Frontend Developer Love 2020"
image: /img/frontend-developer-love-2020.png
tags: [Conference, Vue.js, React, GraphQL, WebAssembly, a11y]
category: Conference
comments: true
---

# Table of Contents

* [Introduction](#introduction)
* [How thinking small is changing software development big time](#how-thinking-small-is-changing-software-development-big-time-by-sander-hoogendoorn)
* [How to pack your Webpack](#how-to-pack-your-webpack-by-johannes-ewald)
* [Svelte: the last framework we need?](#svelte-the-last-framework-we-need-by-alexander-esselink)
* [Serverless gives you wings](#serverless-gives-you-wings-by-yan-cui)
* [Modern solutions for e2e testing](#modern-solutions-for-e2e-testing-by-anastasiia-dragich)
* [Practical a11y for web apps](#practical-a11y-for-web-apps-by-bob-bijvoet)
* [Micro-interactions with React Spring](#micro-interactions-with-react-spring-by-emma-bostian)
* [But, you're not Facebook](#but-youre-not-facebook-by-kitze)
* [Beats, rhymes and unit tests](#beats-rhymes-and-unit-tests-by-tony-edwards)
* [GraphQL without a database](#graphql-without-a-database-by-roy-derks)
* [DX is the new black. Learnings from using Nuxt and Storybook at scale](#dx-is-the-new-black-learnings-from-using-nuxt-and-storybook-at-scale-by-aurélie-violette)
* [Refactor your life](#refactor-your-life-by-noer-paanakker--sima-milli)
* [Blazor with WebAssembly](#blazor-with-webassembly-by-don-wibier)
* [Audio Streaming - Using WebRTC for building your own Voice AIs](#audio-streaming---using-webrtc-for-building-your-own-voice-ais-by-lee-boonstra)
* [The future of real-time, offline, data](#the-future-of-real-time-offline-data-by-nader-dabit)
* [The state of WebAssembly](#the-state-of-webassembly-by-sendil-kumarn)
* [Conclusion](#conclusion)

# Introduction

The Frontend Developer Love conference day was the first of 3 conference days that I was visiting in Amsterdam.
While the last 2 days were focussed on VueJS, the first day was filled with more generic frontend topics.
These topics ranged from Webpack, serverless to micro-interactions and more inspirational talks.
With a big countdown clock, the conference was about to start.

<img alt="Countdown clock on screen before the Frontend Developer Love conference started" src="{{ '/img/frontend-love-2020/countdown.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

# How thinking small is changing software development big time, by [Sander Hoogendoorn](https://twitter.com/aahogendoorn){:target="_blank" rel="noopener noreferrer"}
As a keynote, we started the day with a non-technical talk.
These days we developers face mainly two challenges: the speed at which we have to deliver results and the legacy code that we must handle.
With the constant changing technology landscape, we can expect that software will not survive for 1000 years.
Regularly adapting and delivering is a key component of delivering quality software.
Sander talked about his current and previous experiences in the volatile world of software development.
Like how a 9-to-5 mentality is not always the right choice as not everybody is that productive during the day.
<img alt="Graph depicting productivity of a geek during the day" src="{{ '/img/frontend-love-2020/geek-productivity-at-work.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">
Factors such as strict working hours ruin productivity.
But the same can be said about the usage of open floor plans which explains the popularity of noise-cancelling headphones.
We need to think for ourselves and don't copy what other big corporations might be doing.
In the end, it all boils down to trying to release as fast, as often and as small as you can.
Even if that means following weird office hours...

> Check out [Sander's talk](https://www.youtube.com/watch?v=64LI5v470VY){:target="_blank" rel="noopener noreferrer"}, [Sander's Twitter](https://twitter.com/aahogendoorn){:target="_blank" rel="noopener noreferrer"}, [his slides](https://speakerdeck.com/aahoogendoorn/its-a-small-world-after-all-full-edition-fall-2019){:target="_blank" rel="noopener noreferrer"} and the [geek productivity chart resource](https://www.insanityworks.org/acme/2013/5/14/geek-productivity-chart.html){:target="_blank" rel="noopener noreferrer"}

# How to pack your Webpack, by [Johannes Ewald](https://twitter.com/jhnns){:target="_blank" rel="noopener noreferrer"}
In this talk, Johannes explained more what Webpack is and how you can define your own Webpack config.
While most frontend developers use CLIs these days, a lot can be learned from actually writing a Webpack config so that you know what your favourite CLI is generating.
With the latest Webpack we now have TypeScript support in our Webpack config file.
He also described the several key components of a Webpack config.
Such as the `entry` element which denotes the base of your module tree.

In the end Johannes gave a couple of tips to create a good Webpack along with some tips for your code to decrease the bundle size that Webpack will generate: 

* Most apps will have a good bundle size just be setting the Webpack `mode` to `production`. You don't need to overthink your configuration, Webpack already optimises a lot for you
* Lazy load modules with the use of `import()`
* Check [bundlephobia.com](https://bundlephobia.com){:target="_blank" rel="noopener noreferrer"} to determine if a bundle could be replaced by something more lightweight or more tree-shakeable
* Measure the performance with a tool like Lighthouse
* Don't overestimate longterm caching. It is ok for fonts, images and CSS but caching whole pages could be not as rewarding for the amount of effort you need to put into it
* Minify your CSS with a tool like [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin){:target="_blank" rel="noopener noreferrer"}

> Check out [Johannes' talk](https://www.youtube.com/watch?v=z8YP5ZEUIxA){:target="_blank" rel="noopener noreferrer"}, [Johannes's Twitter](https://twitter.com/jhnns){:target="_blank" rel="noopener noreferrer"} and his [slides](https://peerigon.github.io/talks/2020-02-19-frontend-developer-love-how-to-pack-your-webpack/slides/#/){:target="_blank" rel="noopener noreferrer"}

# Svelte: the last framework we need?, by [Alexander Esselink](https://twitter.com/DexterLabsNL){:target="_blank" rel="noopener noreferrer"}
On its website, [Svelte](https://svelte.dev/){:target="_blank" rel="noopener noreferrer"}  claims to allow you to write "cybernetically enhanced web apps".
But what does that mean?
Alexander tried to explain why Svelte is such a great framework.
To start with, Svelte is [truly reactive](https://svelte.dev/blog/svelte-3-rethinking-reactivity){:target="_blank" rel="noopener noreferrer"}.
While in most frameworks you need to call certain functions like a 'set' or 'setState', Svelte parses your JS to add reactivity.
So a basic statement like `count += 1;` will be reactive as all code that relies on the value of `count` will be updated.
An example Svelte component could look like this:
```html
<script>
	let count = 0;

	function handleClick() {
		count += 1;
	}
</script>

<button on:click={handleClick}>
	Clicked {count} {count === 1 ? 'time' : 'times'}
</button>
<style>
button {
	border: 1px solid red;
}
</style>
```
As you can see we have grouped everything of the component into one file: styling, the script and the HTML code.
Between the style tags, you can put your regular CSS.
Between the script tags, you can put JavaScript while your HTML can reference anything that you've defined within your script tag such as `count`.
This allows for the creation of small readable components that anybody, even someone without prior knowledge of Svelte can read.

> Check out [Alexander's talk](https://www.youtube.com/watch?v=U4ll3QWkpD4){:target="_blank" rel="noopener noreferrer"}, [Alexander's Twitter](https://twitter.com/DexterLabsNL){:target="_blank" rel="noopener noreferrer"}, [Svelte.dev](https://svelte.dev/){:target="_blank" rel="noopener noreferrer"}

# Serverless gives you wings, by [Yan Cui](https://twitter.com/theburningmonk){:target="_blank" rel="noopener noreferrer"}
These days we can expect that we will have users of our web applications that are distributed around the world and they will use our web app 24/7.
Because of this, deploying your web application into the cloud is very interesting.
It is resilient, scalable, fast and secure.
As we always need to prepare for success, these are all contributing elements to choose for something in the cloud.
For some, using Docker seems to be the holy grail, especially in combination with container services like Kubernetes.
But to quote Matt Klein: "Unless you're an infrastructure company, infrastructure is basically overhead".

Going serverless means that:
* you don't pay for it if no-one uses it
* you don't need to worry about scaling
* you don't need to provision and manage servers

With the help of Functions-as-a-Service tools like [Google Cloud Functions](https://cloud.google.com/functions){:target="_blank" rel="noopener noreferrer"}, [AWS Lambda](https://aws.amazon.com/lambda/){:target="_blank" rel="noopener noreferrer"} and more, frontend developers can leverage whole blocks of business logic into functions that live in the cloud.
As a result, they can decrease the amount of work that backenders need to do, thus allowing them to focus on more critical stuff and not being occupied with providing some basic API.

> Check out [Yan's talk](https://www.youtube.com/watch?v=A6wbpkSmhrA){:target="_blank" rel="noopener noreferrer"}, [Yan's Twitter](https://twitter.com/theburningmonk){:target="_blank" rel="noopener noreferrer"} and his [slides](https://www.slideshare.net/theburningmonk/serverless-gives-you-wings){:target="_blank" rel="noopener noreferrer"}

# Modern solutions for e2e testing, by Anastasiia Dragich
During her talk, Anastasiia gave an overview of all current end-to-end testing frameworks.
While the [Selenium WebDriver](https://www.selenium.dev/projects/){:target="_blank" rel="noopener noreferrer"} can be considered as Genesis, we have seen a steady rise of different e2e frameworks.
If you're looking for an all-in-one solution, [Cypress](https://www.cypress.io/){:target="_blank" rel="noopener noreferrer"} is the obvious choice.
But we have some other options although they might not be all-in-one solutions.
[Puppeteer](https://pptr.dev/){:target="_blank" rel="noopener noreferrer"} for example is a quicker alternative as its only task is to control a browser so you can add your own testrunner like `jest`.
But while Puppeteer is a valid choice, there is a new kid on the block called [PlayWright](https://github.com/microsoft/playwright){:target="_blank" rel="noopener noreferrer"}.
PlayWright is built by the same Puppeteer people who now work for Microsoft.
It is a Node library to automate the Chromium, Webkit and Firefox browsers with a single API.

An example of how powerful PlayWright is, lies in the fact that we have full control over the browser context.
For example, we can emulate that we visit a website from a specific location with a specific type of mobile browser and take a screenshot:

```javascript
const { webkit, devices } = require('playwright');
const iPhone11 = devices['iPhone 11 Pro'];

(async () => {
  const browser = await webkit.launch();
  const context = await browser.newContext({
    viewport: iPhone11.viewport,
    userAgent: iPhone11.userAgent,
    geolocation: { longitude: 12.492507, latitude: 41.889938 },
    permissions: ['geolocation']
  });
  const page = await context.newPage();
  await page.goto('https://maps.google.com');
  await page.click('text="Your location"');
  await page.waitForRequest(/.*preview\/pwa/);
  await page.screenshot({ path: 'colosseum-iphone.png' });
  await browser.close();
})();
```

In the end, there are multiple tools available to perform e2e tests on your web application, you just have to pick the one that best fits your needs.

> Check out [Anastassiia's talk](https://www.youtube.com/watch?v=KdjYUtjVs3I){:target="_blank" rel="noopener noreferrer"}, [Selenium WebDriver](https://www.selenium.dev/projects/){:target="_blank" rel="noopener noreferrer"}, [Cypress](https://www.cypress.io/){:target="_blank" rel="noopener noreferrer"}, [Puppeteer](https://pptr.dev/){:target="_blank" rel="noopener noreferrer"} and [PlayWright](https://github.com/microsoft/playwright){:target="_blank" rel="noopener noreferrer"}

# Practical a11y for web apps, by Bob Bijvoet
Even before you start writing a11y specific HTML such as the `aria-label` attribute, we can take certain tips into consideration to make our web apps more accessible.
As a start, our pages should be perceivable:

* Logical ordering of elements: what's important such as an article header should come first
* Don't rely on colour: be aware that not everybody can perceive colour the same way as you can. Use shapes and different sizes to distinguish between elements, colour in itself is not enough
* Use contrast: all different elements should be distinguishable one from the other
* Don't rely on orientation: with the rising number of mobile users, you should keep in mind that not everybody uses their phone in portrait mode, make sure that your web application also works in landscape mode

While trying to make your page as perceivable as possible, don't forget to focus on making your page operable.
A lot of users rely on a keyboard so make sure that they can tab through your content easily.
Having a logical focus order makes most sense.
To make your page more operable, add labels to UI elements to help them describe what they do.
For example it is of no use to add a search icon to a search button without adding the "Search" text somewhere.
Screenreader users will be very grateful for such small adaptations.

Most of the tips that Bob gave were easy to verify on your own.
For example, try to use your web application with only your keyboard to check if it's easy to operate.
Or how about turning of your CSS to see if the order is logical and if your application is still usable.
And if you can, try to use your web application with just a screen reader.
On a Windows, [NVDA](https://www.nvaccess.org/){:target="_blank" rel="noopener noreferrer"} is a good option while MacOS X has the [VoiceOver](https://www.apple.com/voiceover/info/guide/_1121.html){:target="_blank" rel="noopener noreferrer"} option.

> Check out [Bob's talk](https://www.youtube.com/watch?v=btxOl52LTns){:target="_blank" rel="noopener noreferrer"}

# Micro-interactions with React Spring, by [Emma Bostian](https://twitter.com/EmmaBostian){:target="_blank" rel="noopener noreferrer"}
Micro-interactions are small animations.
They are important in your web app as they have a lot of added value.

* They enforce perceived performance
* They illustrate a state change
* They draw attention to something
* They inform the user about the status of a task
* They build habits
* They delight our users

Ideally, for each interaction that results in a state change you should have an animation.
This will help improve the user experience as the user will better percieve what has changed.
It is best to keep in mind that:

* Animations should be accessible. Accessibility should never suffer from the introduction of an animation
* You should make them relatable
* You should be intentional with the placement
* You don't let your users wait. Why not already start an animation while for example your backend call is going?

During her talk, Emma showcased her live coding skills as she took a full screen menu and animated it with the use of [React-spring](https://www.react-spring.io/){:target="_blank" rel="noopener noreferrer"}.
React-spring looks to be an interesting library that exposes hooks such as `useSpring()` to easily configure animations.
Having for example a menu slide in from the top of your page with a change in opacity, could be something as simple as this in your component:

```javascript
const [fullMenuVisible, setFullMenuVisible] = useState(false);
const fullMenuAnimation = useSpring({
	transform: fullMenuVisible ? `translateY(0)` : `translateY(-100%)`,
	opacity: fullMenuVisible ? 1 : 0
});
```

After that you can add `fullMenuAnimation` to your HTML with the react-spring factory `animated`.
A menu can thus end up like this:

```html
<animated.div className="menu menu--full" style={fullMenuAnimation}>
	<nav>
		<ul className="menu-list menu-list--full">
			<li className="menu-list-item menu-list-item--full">
				<a href="/">Home</a>
			</li>
			<!-- more elements -->
		</ul>
	</nav>
</animated.div>
```

> Check out [Emma's talk](https://www.youtube.com/watch?v=NBb5Dt-uc40){:target="_blank" rel="noopener noreferrer"}, [Emma's Twitter](https://twitter.com/EmmaBostian){:target="_blank" rel="noopener noreferrer"}, [React-spring](https://www.react-spring.io/){:target="_blank" rel="noopener noreferrer"}, the [Codesandbox with the end result](https://codesandbox.io/s/boring-sun-qe6kn?fontsize=14&hidenavigation=1&theme=dark){:target="_blank" rel="noopener noreferrer"}, [Emma's blog post about micro interactions part 1](https://stackoverflow.blog/2020/01/16/how-to-create-micro-interactions-with-react-spring-part-1/){:target="_blank" rel="noopener noreferrer"} and [Emma's blog post about micro interactions part 2](https://stackoverflow.blog/2020/01/23/micro-interactions-with-react-spring-part-2/){:target="_blank" rel="noopener noreferrer"}

# But, you're not Facebook, by [Kitze](https://twitter.com/thekitze){:target="_blank" rel="noopener noreferrer"}
"This is going to be the most entertaining talk of the day, mark my words", said the friend next to me.
And he was right, Kitze was able to give a fun yet very interesting talk about the current culture in IT companies.
We tend to aim for certain goals that are just not necessary to achieve.
Why should you have a PWA portfolio for example?
Or what's the point in having a 100 score on all Lighthouse tests?

<img alt="Lighthouse scores all 100%" src="{{ '/img/frontend-love-2020/kitze-lighthouse-100.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

But what should you do?
Stop solving solved problems! 
There's already enough methods to implement button styling, state management and so on.
There are complete design systems that you can reuse, so why not reuse them?
Because ultimately, your end-users don't care about the technology.
Look at your analytics once in a while and see if your users like your app or not.
Because even if you have overengineered your app, if the end-users don't like it then there's no point.

> Check out [Kitze's Twitter](https://twitter.com/thekitze){:target="_blank" rel="noopener noreferrer"}, [Sizzy](https://sizzy.co/){:target="_blank" rel="noopener noreferrer"}, [Kitze's Twitch](https://www.twitch.tv/thekitze){:target="_blank" rel="noopener noreferrer"}

# Beats, rhymes and unit tests, by [Tony Edwards](https://twitter.com/tonyedwardspz){:target="_blank" rel="noopener noreferrer"}

The [Web Speech API](https://wicg.github.io/speech-api/){:target="_blank" rel="noopener noreferrer"} consists of 2 parts: the [Speech Recognition API](https://wicg.github.io/speech-api/#api_description){:target="_blank" rel="noopener noreferrer"} and the [Speech Synthesis API](https://wicg.github.io/speech-api/#tts-section){:target="_blank" rel="noopener noreferrer"}.
In short, the Speech Recognition API allows you to transform speech into text and the Speech Synthesis API allows you to transform text into speech.
In his talk, Tony asked himself: how good would the Speech Recognition API be in analysing hiphop lyrics.
Tony showcased his abilities to bring a live demo of the implementation of the Speech Recognition API.
Would it be able to transform his live lyrics into text?
Even though the technology still has a long way to go, it was still impressive that it was able to transcribe more than half of his live lyrics.

<img alt="55% end result of his live lyrics correctly transcribed" src="{{ '/img/frontend-love-2020/beats-rhymes-unit-tests-results.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

> Check out [Tony's talk](https://www.youtube.com/watch?v=x_L1eQT6TyA){:target="_blank" rel="noopener noreferrer"}, [Tony's Twitter](https://twitter.com/tonyedwardspz){:target="_blank" rel="noopener noreferrer"} and a Spotify list with [songs from the talk](https://open.spotify.com/playlist/6kCeuSEq5PE7qrMebN8uNf){:target="_blank" rel="noopener noreferrer"} 

# GraphQL without a database, by [Roy Derks](https://twitter.com/gethackteam){:target="_blank" rel="noopener noreferrer"}

GraphQL is one of those technologies that a lot of frontenders want to use.
But most backenders are not that keen to add a GraphQL API to their existing REST APIs.
But why would that stop you?
There are multiple options to integrate a GraphQL API in your project without having to bother your backenders.
Roy highlighted two of them.

The first one was [apollo-link-rest](https://www.apollographql.com/docs/link/links/rest/){:target="_blank" rel="noopener noreferrer"}.
This allows you to call REST endpoints from within your GraphQL queries while having all your data managed by `ApolloClient`.
These REST endpoints can be bundled together in the same GraphQL query so that getting information about a product with ID 3 and data about its rating and categories, might end up like this:

```
query getProduct {
	product @rest(type: "Product", path: "product/3") {
		id
		name
		price
		thumbnail
		categories @rest(type: "Category", path: "products/3/categories") {
			name
		}
		rating @rest(type: "Rating", path: "products/3/rating") {
			average
			count
		}
	}
}
```

Another way to integrate a GraphQL API is to use the package [OpenAPI-to-graphql](https://www.npmjs.com/package/openapi-to-graphql){:target="_blank" rel="noopener noreferrer"}.
The idea behind this is to use an OpenAPI specification coming from something like [Swagger](https://swagger.io/){:target="_blank" rel="noopener noreferrer"} that will be used to generate a schema which will build a GraphQL server.
To help with all this, there even is a [CLI](https://github.com/IBM/openapi-to-graphql/tree/master/packages/openapi-to-graphql-cli){:target="_blank" rel="noopener noreferrer"} to make your life even more easy.

With these two tools, you can already start integrating the usage of GraphQL in your frontend code without having to rely on backend.
The backend is not forced to immediately start making the transition from classic REST APIs to GraphQL.
This is the perfect way to test out if GraphQL brings any added value to your project.

> Check out [Roy's talk](https://www.youtube.com/watch?v=yygC60yamh8){:target="_blank" rel="noopener noreferrer"}, [Roy's Twitter](https://twitter.com/gethackteam){:target="_blank" rel="noopener noreferrer"}, [his slides](https://www.slideshare.net/RoyDerks1/graphql-without-a-database-frontend-developer-love){:target="_blank" rel="noopener noreferrer"}, [apollo-link-rest](https://www.apollographql.com/docs/link/links/rest/){:target="_blank" rel="noopener noreferrer"}

# DX is the new black. Learnings from using Nuxt and Storybook at scale, by [Aurélie Violette](https://twitter.com/purple_orwel){:target="_blank" rel="noopener noreferrer"}

Aurélie used [Storybook](https://storybook.js.org/){:target="_blank" rel="noopener noreferrer"} in her projects as a tool to demo stuff, have live documentation and to enable visually driven development.
Storybook in itself is already a great tool to showcase your components with their different use cases.
But Aurélie extended its functionality by adding the [Knobs addon](https://www.npmjs.com/package/@storybook/addon-knobs){:target="_blank" rel="noopener noreferrer"} as well as the [Docs addon](https://www.npmjs.com/package/@storybook/addon-docs){:target="_blank" rel="noopener noreferrer"}.

The concepts that she uses, is to bring "Nuxt logic" to your Storybook project.
By adding components into Storybook, developers are tempted to just write the visualisation of their components with some mock data.
But why not add some business logic into it instead of just being occupied with showcasing your components?
If your actual component uses data coming from a store, why not implement a store in your Storybook stories to help you mimick the real usecase of your components?
Storybook's functionality can be extended by writing decorators.
An example she gave of a decorator to add a store to your components is this:

```javascript
	
import addons, { makeDecorator } from '@storybook/addons'
import { STORY_CHANGED } from '@storybook/core-events'
 
export const withStore = makeDecorator({
  name: 'withStore',
  parameterName: 'store',
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context, { parameters = {} }) => {
    const { modules = {} } = parameters
    return {
      created() {
        for (name in modules) {
          this.$store.registerModule(name, modules[name])
        }
        const channel = addons.getChannel()
        channel.on(STORY_CHANGED, () => {
          for (name in modules) {
            this.$store.unregisterModule(name)
          }
        })
      },
      template: '<story></story>',
    }
  },
})
```

After activating the decorator with `addDecorator(withStore)`, your components will have access to the store.
So now you can make your examples in Storybook even more linked to the real use of the components.

> Check out [Aurélie's talk](https://www.youtube.com/watch?v=R9NXT_qU7qM){:target="_blank" rel="noopener noreferrer"}, [Aurélie's Twitter](https://twitter.com/purple_orwel){:target="_blank" rel="noopener noreferrer"} and her [slides](https://slides.com/aurelieviolette-1/dx-is-the-new-black#/){:target="_blank" rel="noopener noreferrer"}

# Refactor your life, by Noer Paanakker & Sima Milli

<div style="position: relative; width: 100%; height: 0; padding-bottom: 55%;">
<iframe src="https://www.youtube.com/embed/GSyQayMEID8?rel=0" width="100%" height="100%;" style="position: absolute; left: 0; top: 0; bottom: 0; right: 0;"></iframe>
</div>

Noer and Sima talked about [Hack Your Future](https://www.hackyourfuture.net/){:target="_blank" rel="noopener noreferrer"}, a coding school for people that have limited access to education and the labour market.
They talked about a few of the heartbreaking stories of their students and highlighted how the program helped these people try to build a brighter future for themselves.
In just over 4 years, they've helped get 120+ people land a good tech job.
With Behind The Source, they highlight a couple of the other stories on how being a refugee wasn't a choice but becoming a developer was a choice.

> Check out [Noer & Sima's talk](https://www.youtube.com/watch?v=jczJ9IPH-Aw){:target="_blank" rel="noopener noreferrer"}, [Hack Your Future](https://www.hackyourfuture.net/){:target="_blank" rel="noopener noreferrer"} and the [Behind The Source video](https://www.youtube.com/watch?v=GSyQayMEID8){:target="_blank" rel="noopener noreferrer"}

# Blazor with WebAssembly, by [Don Wibier](https://twitter.com/donwibier){:target="_blank" rel="noopener noreferrer"}

Blazor lets you build interactive web applications in C\# instead of JavaScript.
In fact, it allows you to create a component based UI with a combination of C\#, HTML and CSS.
Both the client and server-side code are written in C\#.
This has one big benefit: you can share code and libraries between your front- and backend code.

A really basic example of Blazor code would be this:
```javascript
<h1>Counter</h1>
<p>Current count: @currentCount</p>
<button class="btn btn-primary" @onclick="IncrementCount">Click me</button>

@code {
	private int currentCount = 0;

	private void IncrementCount()
	{
		currentCount++;
	}
}
```

Those familiar with C# and mainly .Net Razor pages, will recognise the syntax.
Razor allows you to write both your HTML and C\# in the same file.

One of the interesting features of Blazor is the ability to compile it to WebAssembly.
In fact, your client-side C\# code is being run by WebAssembly in your browser.

In a Blazor project, you even have your client-side and server-side code right besides each other.
A typical Blazor project has the following structure: 

* /Client
* /Server
* /Shared

In this structure, your whole frontend is situated in `/Client` while all your backend code is situated in `/Server`.
If you are in need of any code sharing, you can put it into `/Shared` and it will be availabled in both `/Client` and `/Server`.  

> Check out [Don's talk](https://www.youtube.com/watch?v=ZAFqw952GQM){:target="_blank" rel="noopener noreferrer"}, [Don's Twitter](https://twitter.com/donwibier){:target="_blank" rel="noopener noreferrer"} and [Blazor](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor){:target="_blank" rel="noopener noreferrer"}

# Audio Streaming - Using WebRTC for building your own Voice AIs, by [Lee Boonstra](https://twitter.com/ladysign){:target="_blank" rel="noopener noreferrer"}

Tools like the [Google Assistant](https://assistant.google.com/){:target="_blank" rel="noopener noreferrer"}, [Amazon Alexa](https://developer.amazon.com/en-US/alexa){:target="_blank" rel="noopener noreferrer"} and [Apple's Siri](https://www.apple.com/siri/){:target="_blank" rel="noopener noreferrer"} are becoming more popular.
The usage of voice assistants is becoming more mainstream as prices are dropping and they are becoming less of a gimmick and more of a tool to use during your everyday life.

And while there are lots of developer tools available to integrate your app with these particular voice assistants, this might not be your best course of action.
You're limited to the technical requirements of these assistants, they might be overkill for your usecase or they might not fit for your enterprise usage.

[WebRTC](https://webrtc.org/){:target="_blank" rel="noopener noreferrer"} is an open web standard and is available as a regular JavaScript API in all major browsers.
It allows for real-time communication (RTC) in the form of audio and video communication via direct peer-to-peer communication.
[RecordRTC](https://github.com/muaz-khan/RecordRTC){:target="_blank" rel="noopener noreferrer"} is a WebRTC JavaScript library for audio, video, screen and canvas recording.
By combining RecordRTC together with a tool such as [Dialogflow](https://dialogflow.com/){:target="_blank" rel="noopener noreferrer"} that can parse voice recordings to text, we can create our very own voice assistant.

Tools such as Dialogflow use machine learning to parse voice recordings to achieve intent matching.
An intent categorizes an end-user's intention for one conversation turn.
By trying to match phrases or parts of phrases, Dialogflow tries to classify the end-user expression to the best intent.
It then tries to parse the input with the help of the intent to extract information.
For the example of weather forecase queries, if Dialogflow is able to match the queries to the forecast intent, it knows it can try to extract information such as time and location.

<img alt="Intent matching diagram for weather forecast queries" src="{{ '/img/frontend-love-2020/intent-match-forecast.svg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

Linked to this intent, one can add actions to perform or responses to give.
By training the system, the classification of intents can be improved as to ensure that the voice assistant gives back the correct answer.
During her talk, Lee demonstrated the [Airport SelfService Kiosk](https://github.com/dialogflow/selfservicekiosk-audio-streaming){:target="_blank" rel="noopener noreferrer"}, a demo in which microphone streaming is used to give the end-user information linked to their flight in an airport.

> Check out [Lee's talk](https://www.youtube.com/watch?v=6JD8WC1LV7g){:target="_blank" rel="noopener noreferrer"}, [Lee's Twitter](https://twitter.com/ladysign){:target="_blank" rel="noopener noreferrer"}, her [slides](https://speakerdeck.com/savelee/implementing-a-custom-ai-voice-assistant-by-streaming-webrtc-to-dialogflow-and-cloud-speech){:target="_blank" rel="noopener noreferrer"}, [RecordRTC](https://www.webrtc-experiment.com/RecordRTC/){:target="_blank" rel="noopener noreferrer"}, [Dialogflow](https://dialogflow.com/){:target="_blank" rel="noopener noreferrer"} and the [Airport SelfService Kiosk](https://github.com/dialogflow/selfservicekiosk-audio-streaming){:target="_blank" rel="noopener noreferrer"}

# The future of real-time, offline, data, by [Nader Dabit](https://twitter.com/dabit3){:target="_blank" rel="noopener noreferrer"}
When trying to write an offline-first app, you should take three things into account:

* Code should work offline & online
* Write your data locally and replicate it to a database: you should always have a local copy of all the relevant data
* Provide good user experience in case of bad internet: your app should still be usable when your user has internet issues

Your app should feel real-time:

* Give your user a sense of real-time: don't delay things and add animations to enhance the feeling of real-time
* Allow for synchronisation between multiple devices

Tools such as [AWS AppSync](https://aws.amazon.com/appsync/){:target="_blank" rel="noopener noreferrer"} and [AWS Amplify](https://aws.amazon.com/amplify/){:target="_blank" rel="noopener noreferrer"} can help you with that.
AppSync is a managed service that uses GraphQL to make it easy for applications to get the data they need from multiple sources with the option to have real-time updates.
Amplify is a framework to build cloud-based full-stack serverless apps.
By combining the forces of these two tools, we can create real-time, offline data, especially if we combine it with GraphQL.

Your data model can be defined by a GraphQL schema.
In your application, you can use GraphQL subscriptions to have real-time updates for your application data.
There are options to get updates such as long polling, server sent events and web sockets.
It depends on your use case to choose what option is best for you.

But getting real-time updates also forces you to think about conflict detection and resolution.
Like what do you do when you get multiple updates at the same time?
What if your connection is down for a while?
There are a couple of popular ways to tackle these issues.

AppSync already uses the solution of monotonic counters combined with a base table that contains all your base data while also maintaining a change table to log all operations that happen on the base data.
AppSync will automerge everything for you while also offering other options if necessary.
Check the [Amplify DataStore documentation](https://aws-amplify.github.io/docs/js/datastore){:target="_blank" rel="noopener noreferrer"} for more information.

> Check out [Nader's talk](https://www.youtube.com/watch?v=dkMEkD9OsPY){:target="_blank" rel="noopener noreferrer"}, [Nader's Twitter](https://twitter.com/dabit3){:target="_blank" rel="noopener noreferrer"}, [AWS AppSync](https://aws.amazon.com/appsync/){:target="_blank" rel="noopener noreferrer"}, [AWS Amplify](https://aws.amazon.com/amplify/){:target="_blank" rel="noopener noreferrer"} and the [Amplify DataStore documentation](https://aws-amplify.github.io/docs/js/datastore){:target="_blank" rel="noopener noreferrer"}

# The state of WebAssembly, by [Sendil Kumarn](https://twitter.com/sendilkumarn){:target="_blank" rel="noopener noreferrer"}
The final talk of the day was by Sendil who came to explain what the current state of WebAssembly is.
WASM, short for WebAssembly, is a highlevel definition of how to run bytecode in your JavaScript engine.
At its core, it's a stackmachine that uses a linear memory model by using a shared array buffer.
Contrary to what you might expect, WASM is not faster if you would use it for lots of DOM operations.
The advantage of WASM lies in the fast calculations that can be done.

To write WASM, you can look at multiple higher-level languages that compile to WASM code.
If you're a fan of C/C++, the tool [Emscripten](https://github.com/emscripten-core){:target="_blank" rel="noopener noreferrer"} helps you out by compiling a C/C++ module to an HTML page.
For the Rust lovers, you can simply annotate a function with `#[wasm_bindgen]` to activate the [wasm-bindgen library](https://rustwasm.github.io/wasm-bindgen/){:target="_blank" rel="noopener noreferrer"} and allowing to compile a WASM function.
For the TypeScript lovers, there is a strict subset of TypeScript called [AssemblyScript](https://docs.assemblyscript.org/){:target="_blank" rel="noopener noreferrer"} that allows for compilation.

So the tools are already there to write WASM code but the future looks really bright as multiple features are currently being specified:

* [Interface types](https://github.com/WebAssembly/interface-types){:target="_blank" rel="noopener noreferrer"} to help describe higher-level values such as strings and records
* [Single Instruction Multiple Data](https://github.com/WebAssembly/simd){:target="_blank" rel="noopener noreferrer"} so that WASM will be more efficient on newer instruction set architectures up to 128-bit.
* Garbage collection
* ... and more!

All this will lead to an even better performance of WebAssembly combined with more usecases so that WASM can become a more popular standard on the web.

> Check out [Sendil's talk](https://www.youtube.com/watch?v=2KDU1qdIobA){:target="_blank" rel="noopener noreferrer"}, [Sendil's Twitter](https://twitter.com/sendilkumarn){:target="_blank" rel="noopener noreferrer"}, [WASM.org getting started with Emscripten](https://webassembly.org/getting-started/developers-guide/){:target="_blank" rel="noopener noreferrer"}, [wasm-bindgen library](https://rustwasm.github.io/wasm-bindgen/){:target="_blank" rel="noopener noreferrer"} and [AssemblyScript](https://docs.assemblyscript.org/){:target="_blank" rel="noopener noreferrer"}

# Conclusion
The first of three days in Amsterdam was packed with lots of great talks on a multitude of subjects.
Combine those interesting topics with a great venue (the screen opened for access to the break room!) and you have a killer combination.
If this was day 1, I could not wait for day 2 and 3 that were going to be more focused on VueJS.
I returned to my hotel satisfied with the amount of stuff I had learned that day and was excited for what was still to come.

<img alt="During breaks, the stage opened to provide access to the break room" src="{{ '/img/frontend-love-2020/opening-stage.jpeg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">
