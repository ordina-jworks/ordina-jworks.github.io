---
layout: post
author: jan_de_wilde
title: 'Adding TypeScript to Ionic Framework'
image: /img/ionic-and-typescript.jpg
tags: [JSConfBudapest,JavaScript,Conference]
category: conference
comments: true
---

### JS Conf Budapest

JS Conf Budapest started with a very nice WebGL Master of ceremony Jake Archibald from Google. A lot of jokes and 

## Day 1

### Laurie Voss

#### CTO, npm Inc. @seldo

Registry -> CLI -> You
Registry is a set of servers all around the world.
Tries the match the best version that you are looking for.
Will try to download local cache, otherwise CDN (uses the most closest server to your current location), otherwise registry (worldwide)

It is possible to specify a gist url but NPM does not download from git or something else. That would like be a bazillion amount of data and would not be nice.

EACCESS error -> use sudo -> NOPE! fix your rights

Don't write your package.json yourself, let NPM do it!

New feature in npm is scopes.
npm init --scope=username
npm install @myusername/mypackage
require('@myusername/mypackage')

Can be public and private

tilde/.npm-init.js and PromZard
When you initialise npm it will look in this file and provide basic configurations for the setup.

npm init can always be re-run.

**Why add stuff in devDependencies.**

Because production will install faster.

npm install --production

**Bundled dependencies**

npm install --save --save-bundle

**Offline installs**

npm install --cache-min 999999

**Run scripts**

npm start

npm stop

npm restart

npm test

Are default run scripts you can add to your package.json file.

**Run scripts get devDependencies in path**

Don't force users to install global tools. Don't get conflicts over global tools. Different versions in different projects.

**SemVer - Semantic Versioning**

1.5.6

Breaking Major . Feature Minor . Fix Patch

npm version minor

npm version major

npm version (something else)

npm version major -m "Bump to version %s"

**Microservices architecture**

Work with multiple packages for your services. 

use npm link

In package "Alice" run npm link

In "bob", which requires "alice" run npm link alice

**Unpublish package**

Now restricted after 24 hours. You need to contact support. Since the recent events with npm package that broke the internet. More friendly way is npm deprecated, that tells users the package has been deprecated.

**Keep projects up to date**

npm outdated

npm update

**More run scripts**

npm run start

npm run <anything>

**Stuff everybody should know about npm**

Babel: Transpile all the things! JavaScript, TypeScript, JSX, ...

Webpack and Browserify

Greenkeeper (greenkeeper.io) "npm outdated" as a service!

Node Security Project: npm install nsp -g. nsp check. Check if your project contains vurnerable modules.

Why NPM: npm reduces friction. Takes things you have to do all the time and make things simpler and faster.

### Safia (@captainsafia - safia.rocks) : The Hitchhiker's Guide to All Things Memory in JavaScript

j.mp/js-mem-live

**>> Slides on safia.rocks**

Safia created an interactive tutorial on how to use the chrome devtools for memory management.

**Why care about memory?**

1. It forces us to be (better) more inventive programmers. Add restrictions and forces us to use the best tools to create the best possible experience.
2. Memory is scarce. A lot of people still use devices that are not packed with a lot of memory. Not everyone has high performant dev machines.
3. It helps us exercise our empathy muscles

**What does it mean to manage memory?**

The Good, The Bad, The Ugly

**How does JS manage memory?**

V8 JS Engine.

Booleans, numbers, strings, ...
Memory is allocated in a heap structure. Uses a root node which has references to booleans, string, etc.

So: root node -> references -> variables

6 spaces

* New space: memory get's allocated here when an object is created immediately
* Old pointer space: if you don't use an object for a while
* Old data space: if it's not a reference
* Large object space: store large object tables, store here so it doesn't conflict with the store space of the above mentioned spaces
* Code space: ...
* Map space: 

V8 uses a 'stop the world' technique. Runs a short garbage collection cycle -> Halt the program.

V8 has different approaches on how it collects garbage in the new and old space.

- New space: Garbage collection by Scavenging technique. Starts a Scavenging cycle. Going through entire heap starting from the root and create copies. It will clear out what is currently in new space. Everything that is not reachable will be cleared out of the space. You need double the size of the memory that is availble for the new space to use for the copy.
- Old space: Mark and sweep technique. Remove unmarked objects on a regular basis. Mark and sweep has a rich history in computer science history :)

**How do I write memory performant applications?**

* How much memory is my application using?
* How often do GC cycles occur in my application?

Tools: Chrome Devtools HEAP allocation profiler. Check retain size and shallow size of objects. shallow size of an object is the amount of memory it holds of itself. Retain size is all of it's size and it's dependants.

Heapdump: npm install heapdump . Takes snapshot of your heap at a specific moment. Get a file with a .heap extension which enables you to load it in the chrome devtools.

### Yan Zhu (@bcrypt) : Encrypt the web for $0

**Is the web fast yet?**

Yes. Size of pages is rising. Amount of HTTPS requests is also rising!

**Is TLS fast yet?**

Yes. Netflix is going to secure streams this year over HTTPS.

* 2015: Netflix and chill
* 2016: Netflix and HTTPS and chill

https://istlsfastyet.com

Let's Encrypt (https://letsencrypt.org). At this moment in beta.

https://gethttpsforfree.com

### Dennis Mishumov : Why performance matters

- Speed! 1 second gain will increase revenue bij 1% for Company X. 1 second slower will decrease conversions by approx 5%.

**Performance is about perception! Not mathematics.**

The 20% rule.
- Event: make page load at least 20% faster, otherwise they don't notice. We're talking about noticeable difference. A big difference with meaningful difference.

**Noticeable !== Meaningful**

Perception: we did a live test on the conference where the sames page loaded first in 1.6 seconds and afterwards 2 seconds. Most of the people thought the second 2 second page was faster. Perception!

When delaying audio on a video, our mind will trick us by syncing the audio with what is visible on the screen. Perception!



## Day 2

### Speaker 1

### Speaker 2

### Speaker 3

## Conclusion

As you can see it is fairly simple - just 4 steps - to add TypeScript support to your Ionic project by changing the default gulp setup used by Ionic.
It's nice to know that Ionic 2 will have support for TypeScript built in so you won't have to do it yourself.
By adding a flag `--ts` to your Ionic 2 project setup it will be enabled.

Personally I love using TypeScript and will use it whenever I can.
It makes my life as a developer a lot easier by spotting errors before I even hit the browser.

What are your thoughts about TypeScript? Feel free to add them in the comments section.
