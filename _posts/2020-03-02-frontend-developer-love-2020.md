---
layout: post
authors: [elke_heymans]
title: "Frontend Developer Love 2020"
image: /img/frontend-developer-love-2020.png
tags: [Conference, Vue.JS]
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
While the other 2 days were focussed on VueJS, the first day was a day filled with more generic frontend topics.
These topics ranged from Webpack, serverless to micro-interactions and more inspirational talks.

# How thinking small is changing software development big time, by [Sander Hoogendoorn](https://twitter.com/aahogendoorn){:target="_blank" rel="noopener noreferrer"}
As a keynote, we started the day with a non-technical talk.
These days we developers face mainly two challenges: the speed at which we have to deliver results and the legacy code that we must handle.
With the constant changing technology landscape, we can expect that software will not survive for 1000 years.
Regularly adapting and delivering is a key component of delivering quality software.
Sander talked about his current and previous experiences in the volatile world of software development.
In the end, it all boils down to trying to release as fast, as often and as small as you can.
// TODO

> [Sander's talk](https://www.youtube.com/watch?v=64LI5v470VY){:target="_blank" rel="noopener noreferrer"}, [Sander's Twitter](https://twitter.com/aahogendoorn){:target="_blank" rel="noopener noreferrer"} and his [slides](https://speakerdeck.com/aahoogendoorn/its-a-small-world-after-all-full-edition-fall-2019){:target="_blank" rel="noopener noreferrer"}

# How to pack your Webpack, by [Johannes Ewald](https://twitter.com/jhnns){:target="_blank" rel="noopener noreferrer"}
In this talk, Johannes explained more what Webpack is and how you can define your own Webpack config.
While most frontend developers use CLIs these days, a lot can be learned from actually writing a Webpack config so that you know what your favorite CLI is generating.
With the latest Webpack we now have TypeScript support in our Webpack config file.
// TODO

> [Johannes' talk](https://www.youtube.com/watch?v=z8YP5ZEUIxA){:target="_blank" rel="noopener noreferrer"}, [Johannes's Twitter](https://twitter.com/jhnns){:target="_blank" rel="noopener noreferrer"} and his [slides](https://peerigon.github.io/talks/2020-02-19-frontend-developer-love-how-to-pack-your-webpack/slides/#/){:target="_blank" rel="noopener noreferrer"}

# Svelte: the last framework we need?, by [Alexander Esselink](https://twitter.com/DexterLabsNL){:target="_blank" rel="noopener noreferrer"}
On its website, [Svelte](https://svelte.dev/){:target="_blank" rel="noopener noreferrer"}  claims to allow you to write "cybernetically enhanced web apps".
But what does that mean?
Alexander tried to explain why Svelte is such a great framework.
To start with, Svelte is [truly reactive](https://svelte.dev/blog/svelte-3-rethinking-reactivity){:target="_blank" rel="noopener noreferrer"} .
While in most frameworks you need to call certain functions like a 'set' or 'setState', Svelte parses your JS to add reactivity.
So a basic statement like `count += 1;` will be reactive as all code that relies on the value of `count` will be updated.

// TODO

> [Alexander's talk](https://www.youtube.com/watch?v=U4ll3QWkpD4){:target="_blank" rel="noopener noreferrer"}, [Alexander's Twitter](https://twitter.com/DexterLabsNL){:target="_blank" rel="noopener noreferrer"}

# Serverless gives you wings, by [Yan Cui](https://twitter.com/theburningmonk){:target="_blank" rel="noopener noreferrer"}
These days we can expect that we will have users of our web applications that are distributed around the world and will use our web app 24/7.
// TODO

> [Yan's talk](https://www.youtube.com/watch?v=A6wbpkSmhrA){:target="_blank" rel="noopener noreferrer"}, [Yan's Twitter](https://twitter.com/theburningmonk){:target="_blank" rel="noopener noreferrer"} and his [slides](https://www.slideshare.net/theburningmonk/serverless-gives-you-wings){:target="_blank" rel="noopener noreferrer"}

# Modern solutions for e2e testing, by Anastasiia Dragich
During her talk, Anastasiia gave an overview of all current end-to-end testing frameworks.
While Selenium can be considered as being Genesis, we have seen a steady rise of different e2e frameworks.
If you're looking for an all-in-one solution, Cypress is the obvious choice.
But we have some other options although they might not be all-in-one solutions.
Puppeteer for example is a quicker alternative as its only task is to control a browser so you can add your own testrunner like `jest`.
But while Puppeteer is a valid choice, there is a new kid on the block called PlayWright.
PlayWright is built by the same Puppeteer people who now work for Microsoft.
// TODO

> [Anastassiia's talk](https://www.youtube.com/watch?v=KdjYUtjVs3I){:target="_blank" rel="noopener noreferrer"}, [PlayWright](https://github.com/microsoft/playwright){:target="_blank" rel="noopener noreferrer"}

# Practical a11y for web apps, by Bob Bijvoet
Even before you start writing a11y specific HTML such as aria-labels, we can take certain tips into consideration to make our web apps more accessible.

// TODO

> [Bob's talk](https://www.youtube.com/watch?v=btxOl52LTns){:target="_blank" rel="noopener noreferrer"}

# Micro-interactions with React Spring, by [Emma Bostian](https://twitter.com/EmmaBostian){:target="_blank" rel="noopener noreferrer"}
Micro-interactions are important in your web app as they have a lot of added value.

* They enforce perceived performance
* They illustrate a state change
* They draw attention to something
* They inform the user about the status of a task
* They build habits
* They delight our users

// TODO

> [Emma's talk](https://www.youtube.com/watch?v=NBb5Dt-uc40){:target="_blank" rel="noopener noreferrer"}, [Emma's Twitter](https://twitter.com/EmmaBostian){:target="_blank" rel="noopener noreferrer"}, [React-spring](https://www.react-spring.io/){:target="_blank" rel="noopener noreferrer"}

# But, you're not Facebook, by [Kitze](https://twitter.com/thekitze){:target="_blank" rel="noopener noreferrer"}

> [Kitze's Twitter](https://twitter.com/thekitze){:target="_blank" rel="noopener noreferrer"}, [Sizzy](https://sizzy.co/){:target="_blank" rel="noopener noreferrer"} , [Kitze's Twitch](https://www.twitch.tv/thekitze){:target="_blank" rel="noopener noreferrer"}

# Beats, rhymes and unit tests, by [Tony Edwards](https://twitter.com/tonyedwardspz){:target="_blank" rel="noopener noreferrer"}

> [Tony's talk](https://www.youtube.com/watch?v=x_L1eQT6TyA){:target="_blank" rel="noopener noreferrer"}, [Tony's Twitter](https://twitter.com/tonyedwardspz){:target="_blank" rel="noopener noreferrer"} and a Spotify list with [songs from the talk](https://open.spotify.com/playlist/6kCeuSEq5PE7qrMebN8uNf){:target="_blank" rel="noopener noreferrer"} 

# GraphQL without a database, by [Roy Derks](https://twitter.com/gethackteam){:target="_blank" rel="noopener noreferrer"}

> [Roy's talk](https://www.youtube.com/watch?v=yygC60yamh8){:target="_blank" rel="noopener noreferrer"}, [Roy's Twitter](https://twitter.com/gethackteam){:target="_blank" rel="noopener noreferrer"} and his [slides](https://www.slideshare.net/RoyDerks1/graphql-without-a-database-frontend-developer-love){:target="_blank" rel="noopener noreferrer"}

# DX is the new black. Learnings from using Nuxt and Storybook at scale, by [Aurélie Violette](https://twitter.com/purple_orwel){:target="_blank" rel="noopener noreferrer"}

> [Aurélie's talk](https://www.youtube.com/watch?v=R9NXT_qU7qM){:target="_blank" rel="noopener noreferrer"}, [Aurélie's Twitter](https://twitter.com/purple_orwel){:target="_blank" rel="noopener noreferrer"} and her [slides](https://slides.com/aurelieviolette-1/dx-is-the-new-black#/){:target="_blank" rel="noopener noreferrer"}

# Refactor your life, by Noer Paanakker & Sima Milli

> [Noer & Sima's talk](https://www.youtube.com/watch?v=jczJ9IPH-Aw){:target="_blank" rel="noopener noreferrer"}, [Hack Your Future](https://www.hackyourfuture.net/){:target="_blank" rel="noopener noreferrer"}, [Behind The Source video](https://www.youtube.com/watch?v=GSyQayMEID8){:target="_blank" rel="noopener noreferrer"}

# Blazor with WebAssembly, by [Don Wibier](https://twitter.com/donwibier){:target="_blank" rel="noopener noreferrer"}

> [Don's talk](https://www.youtube.com/watch?v=ZAFqw952GQM){:target="_blank" rel="noopener noreferrer"}, [Don's Twitter](https://twitter.com/donwibier){:target="_blank" rel="noopener noreferrer"}

# Audio Streaming - Using WebRTC for building your own Voice AIs, by [Lee Boonstra](https://twitter.com/ladysign){:target="_blank" rel="noopener noreferrer"}

Tools like the [Google Assistant](https://assistant.google.com/){:target="_blank" rel="noopener noreferrer"}, [Amazon Alexa](https://developer.amazon.com/en-US/alexa){:target="_blank" rel="noopener noreferrer"} and [Apple's Siri](https://www.apple.com/siri/){:target="_blank" rel="noopener noreferrer"} are becoming more popular.
The usage of voice assistants is becoming more mainstream.
And while there are a lot of developer tools available to integrate your app with these voice assistants, this might not be your best course of action.
You're limited to the technical requirements of these assistants, they might be overkill for your usecase or they might not fit for your enterprise usage.

// TODO

> [Lee's talk](https://www.youtube.com/watch?v=6JD8WC1LV7g){:target="_blank" rel="noopener noreferrer"}, [Lee's Twitter](https://twitter.com/ladysign){:target="_blank" rel="noopener noreferrer"} and her [slides](https://speakerdeck.com/savelee/implementing-a-custom-ai-voice-assistant-by-streaming-webrtc-to-dialogflow-and-cloud-speech){:target="_blank" rel="noopener noreferrer"}

# The future of real-time, offline, data, by [Nader Dabit](https://twitter.com/dabit3){:target="_blank" rel="noopener noreferrer"}
When trying to write an offline-first app, you should take three things into account:

* Code should work offline & online
* Write your data locally and replicate it to a database: you should always have a local copy of all the relevant data
* Provide good user experience in case of bad internet: your app should still be usable when your user has internet issues

Your app should feel real-time:

* Give your user a sense of real-time: don't delay things and add animations to enhance the feeling of real-time
* Allow for synchronisation between multiple devices

// TODO

> [Nader's talk](https://www.youtube.com/watch?v=dkMEkD9OsPY){:target="_blank" rel="noopener noreferrer"}, [Nader's Twitter](https://twitter.com/dabit3){:target="_blank" rel="noopener noreferrer"}

# The state of WebAssembly, by [Sendil Kumarn](https://twitter.com/sendilkumarn){:target="_blank" rel="noopener noreferrer"}
The final talk of the day was by Sendil who came to explain what the current state of WebAssembly is.
WASM, short for WebAssembly, is a highlevel definition of how to run bytecode in your JavaScript engine.
At its core, it's a stackmachine that uses a linear memory model by using a shared array buffer.
Contrary to what you might expect, WASM is not faster if you would use it for lots of DOM operations.
The advantage of WASM lies in the fast calculations that can be done.

To write WASM, you can look at multiple higher-level languages that compile to WASM code.
If you're a fan van C/C++, the tool [Emscripten](https://github.com/emscripten-core){:target="_blank" rel="noopener noreferrer"} helps you out by compiling a C/C++ module to an HTML page.
For the Rust lovers, you can simply annotate a function with `#[wasm_bindgen]` to activate the [wasm-bindgen library](https://rustwasm.github.io/wasm-bindgen/){:target="_blank" rel="noopener noreferrer"} and allowing to compile a WASM function.
For the TypeScript lovers, there is a strict subset of TypeScript called [AssemblyScript](https://docs.assemblyscript.org/){:target="_blank" rel="noopener noreferrer"} that allows for compilation.

So the tools are already there to write WASM code but the future looks really bright as multiple features are currently being specified:

* [Interface types](https://github.com/WebAssembly/interface-types){:target="_blank" rel="noopener noreferrer"} to help describe higher-level values such as strings and records
* [Single Instruction Multiple Data](https://github.com/WebAssembly/simd){:target="_blank" rel="noopener noreferrer"} so that WASM will be more efficient on newer instruction set architectures up to 128-bit.
* Garbage collection
* ... and more!

> [Sendil's talk](https://www.youtube.com/watch?v=2KDU1qdIobA){:target="_blank" rel="noopener noreferrer"}, [Sendil's Twitter](https://twitter.com/sendilkumarn){:target="_blank" rel="noopener noreferrer"}, [WASM.org getting started with Emscripten](https://webassembly.org/getting-started/developers-guide/){:target="_blank" rel="noopener noreferrer"}

# Conclusion

