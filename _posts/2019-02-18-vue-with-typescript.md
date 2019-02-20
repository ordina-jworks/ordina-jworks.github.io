---
layout: post
authors: [elke_heymans]
outbound: [tech_blog_vue-with-typescript]
title: 'Vue with TypeScript'
image: /img/vue-with-typescript/vue-plus-typescript.png
tags: [Vue,TypeScript,JavaScript,VueJS,VueCLI]
category: Vue
comments: true
---

# Table of contents
1. [Vue with TypeScript, an introduction](#introduction)
2. [Creating a Vue project with TypeScript](#creating-a-vue-project-with-typescript)
3. [A look into the files created by the Vue CLI](#a-look-into-the-files-created-by-the-vue-cli)
4. [How to write your first component](#how-to-write-your-first-component)
5. [Using your first plugin](#using-your-first-plugin)
6. [Your first deployment](#your-first-deployment)
7. [Conclusion](#conclusion)
8. [Resources and further reading](#resources-and-further-reading)

# Vue with TypeScript, an introduction
With the release of the Vue CLI 3 in August 2018, Vue now officially supports development in TypeScript.
In September 2018, Evan You even announced that [the next version of Vue will be rewritten in TypeScript](https://medium.com/the-vue-point/plans-for-the-next-iteration-of-vue-js-777ffea6fabf){:target="_blank" rel="noopener noreferrer"}.
This does not yet mean that you are forced to use TypeScript, it will still be optional.
TypeScript has numerous advantages such as static typing, transpiling of the latest ECMAScript features to older versions to support older browsers and much more.
Especially the static typing is a very interesting feature for projects in a professional environment as it helps define more strict interfaces and provides documentation on how to use other developers their code.

In this tutorial we will make a really simple blog system to showcase how you create a component, do calls via HTTP and so on.
Our little project will be called *wordvue*.
At the same time we will explain some tips and tricks and background information about Vue with TypeScript so that you fully understand what the purpose is of everything.

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-plus-typescript-small.png" class="image">
</div>

# Creating a Vue project with TypeScript

## Using the Vue CLI
Thanks to the Vue CLI, it is very easy to create a new Vue project.
First make sure you have the lastest version of the CLI installed with NPM:

```text
$ npm i -g @vue/cli
```

After that we create our project:

```text
$ vue create wordvue
```

The CLI knows some presets but we will go through the manual mode to be sure we select the TypeScript version because Vue is currently using JavaScript as a default language:

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-1-manually-select.png" class="image">
</div>

### Babel + TypeScript
<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-2-selected-features.png" class="image right fit">
</div>

We check the TypeScript option, for the purpose of this article we will not look in detail at the other options and leave on the defaults.
I also checked CSS Pre-processors just because I like SASS.
Just make sure you at least have Babel selected as well.
Babel will automatically add multiple polyfills and will help with having backwards compatibility of newer ECMAScript features. 

### Class-style component syntax
<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-3-class-style-component-syntax.png" class="image fit">
</div>

In the next screen we will get the question if we want class-style component syntax, for which the default option is yes.
With this, we actually install the decorators that can be found in the Vue Class Component package.
If you do not use the class-style component syntax, your components will look just like in JavaScript Vue but with the addition of types:

```typescript
import Vue, { VNode } from 'vue'

export const HelloComponent = Vue.extend({
    data () {
        return {
            message: 'Hello',
        }
    },
    methods: {
        greet (): string {
            return this.message + ' world';
        }
    },
    computed: {
        greeting(): string {
            return this.greet() + '!';
        }
    },
    render (createElement): VNode {
        return createElement('div', this.greeting);
    }
});
```

As you can see, you'll still have the data function, the methods and computed properties and the render function that you can use in regular Vue.
With the class-style component syntax, we would write the same component like this:

```typescript
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    template: '<div>{{ greeting }}</div>'
})
export default class HelloComponent extends Vue {
    message: string = 'Hello'
    greet(): string {
        return this.message + ' world';
    }
    get greeting() {
        return this.greet() + '!';
    }
}
```

When you compare it to the previous version, the data property message is now a regular property in our component class. Methods are present as class methods. And the computed properties can be defined as a getter.

### The other setttings
After you've replied Yes to the "Use class-style component syntax?" question, you can continue with the default options that are self explanatory.

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-4-css-preprocessor.png" class="image fit">
</div>

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-5-linter.png" class="image fit">
</div>

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-6-lint-on-save.png" class="image fit">
</div>

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-7-dedicated-config.png" class="image fit">
</div>

Vue will then be creating the project so you will see some logging going on in your terminal:

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-8-project-generated.png" class="image fit">
</div>

The Vue CLI will create a Git repository, perform an NPM install and generate a README alongside a bunch of files and folders.

## Launching your first Vue project
After the Vue CLI has created your Vue project, you can launch it with:

```text
$ npm run serve
```

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-default-page.png" class="image fit">
</div>

As you will see, the CLI starts the development server and then starts the type checking and linting service.
By default it runs on http://localhost:8080 but if there's already something running on port 8080, he will pick port 8081 or the next one available.

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-serve.png" class="image fit">
</div>

# A look into the files created by the Vue CLI
The main folders in which you will work are public and src. We will look at these more in detail so you fully understand what their purpose is.

## Public
Public is meant for static stuff like images, favicons and more.
It also contains your index.html which is very basic:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width,initial-scale=1.0">
	<link rel="icon" href="<%= BASE_URL %>favicon.ico">
	<title>wordvue</title>
</head>
<body>
	<noscript>
		<strong>We're sorry but wordvue doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
	</noscript>
	<div id="app"></div>
	<!-- built files will be auto injected -->
</body>
</html>
```

It is only in rare cases that you should adapt the index.html.
One example situation would be to add Google Analytics, add more meta tags, adapt the title tag and so on.
Vue will automatically inject the necessary generated JavaScript files right before the closing body tag.
This will include the transpiled version of your own code as well as vendor code.
The most important thing is the div tag with id app.
This should always be present in your index.html as this is the tag on which Vue will bootstrap the entire application.

## Src

### main.ts
```typescript
import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
	render: (h) => h(App),
}).$mount('#app');
```

When we look in the src folder, we find a main.ts file.
This is the one that Vue will execute first.
As you can see this creates a new instance of Vue in which we only define a render function.
Vue will pass along h which is of type CreateElement, the same one as we have in VueJS.
It takes one parameter: App.
App is our main component that was generated by the Vue CLI and we will dive into that later.
main.ts should only be adapted to hook up new core functionalities of your application.
For example, a main.ts of one of my own projects is this:

```typescript
import Vue, { CreateElement, VNode } from 'vue';
import App from './App.vue';
import i18n from './i18n';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    i18n,
    render: (h: CreateElement): VNode => h(App),
}).$mount('#app');
```

As you can see, I've added 3 core functionalities: a router, a store and an i18n library.
In each component that you make, these functionalities will be available.
The reason why these will be available is because the Vue type gets extended by each of these libraries.
For example in the typings of VueI18n (the i18n library that I use), we find:

```typescript
declare module 'vue/types/vue' {
	interface Vue {
		readonly $i18n: VueI18n & IVueI18n;
		$t: typeof VueI18n.prototype.t;
		$tc: typeof VueI18n.prototype.tc;
		$te: typeof VueI18n.prototype.te;
		$d: typeof VueI18n.prototype.d;
		$n: typeof VueI18n.prototype.n;
	}
}
```

This means that we'll have a \$i18n property available and 5 different functions.
If you would use a different i18n library, you will have most of these things also readily available.
For example vue-i18next defines \$i18n as: 

```typescript
declare module "vue/types/vue" {
    interface Vue {
        readonly $i18n: VueI18Next;
        $t: TranslationFunction;
    }
}
```

Vue itself does not provide an i18n implementation nor a store nor a router nor does it even support HTTP calls by default.
Vue is designed to be as light as possible so that developers can keep a project as lightweight as possible.
Vue does officially support specific NPM packages for these core functionalities.
Other packages will follow the same naming conventions as the official supported libraries for convenience sake.

### App.vue
```vue
<template>
	<div id="app">
		<img alt="Vue logo" src="./assets/logo.png">
		<HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';

@Component({
	components: {
		HelloWorld,
	},
})
export default class App extends Vue {}
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
````

The App.vue file is our first component that Vue bootstraps via our main.ts file.
It is considered to be the root component.
Each page and part of a page that you will create, is a component that is a child of the root component.
Together, your whole application should have a component structure which should look like a tree:

```text
App
	- HomePage
		- HelloWorld
	- NewsPage
		- NewsArticle
			- Reaction
	- ContactPage
```

IMAGE

Each node of the tree is a component.
With the use of the Component decorator, we define which components can be child components of the component that we're defining.
For example in our App component, we want the HelloWorld component (via the HelloWorld tag), thus we add the components option with HelloWorld in there.
These components are local components.
If you would want to write a component that is global, you have to register it like this:

```typescript
Vue.component('my-component-name', {
	// ... options ...
})
```

A global component can be accessed everywhere.
Try to avoid this as much as possible as it fills up the global namespace.
One good use case would be for example for an icon library like Font Awesome:

```typescript
library.add(
    faBars,
    ...
    faCameraRetro,
);
Vue.component('font-awesome-icon', FontAwesomeIcon);
```

After this we can access the font-awesome-icon tag from everywhere.

# How to write your first component
We will keep the project as simple as possible for now.
Firstly I will explain the basics of a Vue Component so that you'll fully understand what happens when we write our first real component.

## The structure of a .vue file
```vue
<template>
	<div id="app">
		...
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';

@Component({
	components: {
		HelloWorld,
	},
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
	...
}
</style>
```

The standard way to write a Vue component is by using the .vue file extension.
In a .vue file, we define 3 optional tags: template, script and style.
According to the Vue documentation, you should always [order the tags consistently](https://vuejs.org/v2/style-guide/#Single-file-component-top-level-element-order-recommended){:target="_blank" rel="noopener noreferrer"} with style being the last one.

### \<template>...\</template>
This is the visual part of your component, in here you define the HTML that will be used to display your component.
Note that your custom HTML should *always* be surrounded by a div tag.
The reason for this is that it allows Vue to encapsulate your custom CSS and other stuff into that without unknowingly affecting the styling of your whole site.
You can use this to add a custom id or class to the tag to help you identify the component in for example your e2e tests.
Note that a .vue file can contain at most one template tag.

### \<script lang="ts">...\</script>
In the script tag, you can add your custom TypeScript code.
The lang attribute is not required but if you do not add it, the default language will be JavaScript.
In order for TypeScript to be available, we should add *lang="ts"*.
All of our TypeScript code should be present in this script tag, even the import statements.
Note that a .vue file can contain at most one template tag.

### \<style>...\</style>
In here we can define our own CSS specific for this component.
By default, all the styles you define are global.
By adding the scoped attribute, our custom CSS will be specific for that component.
For example if we add the stylings of a p tag, without the scoped attribute this will affect the styling of all the p tags in the application.
But by adding the scoped attribute, we only affect the p tag that are directly in this component.
Not even p tags in the child component will be affected.
Be careful though as the scoped attribute leads to a certain performance hit.
Simply by adding the same class or id that we used in the template, we avoid this hit and still can have some scoped CSS.
Note that this will also style the child components.
A .vue file can contain more than one style tag.

```vue
<template>
	<div id="app">
		<p>Blabla</p>
	</div>
</template>

<script lang="ts">
...
</script>

<style>
#app {
	p {
		color: red;
	}
}
</style>
```

### Should you put everything in a .vue file?
For small components, a .vue file will be very interesting as you have all the elements that make up your component into one specific file.
But what if you have for example lots of lines in the template tag?
Or what if you just want to split up the file?
One tactic you can use is the src attribute on the template, script and/or style tags.

```vue
<template src="./mycomponent.html"></template>

<script lang="ts">
...
</script>

<style src="./mycomponent.css"></style>
```

Personally I avoid using the src attribute as I like to force myself to keep my .vue files as small as possible.
There's also no performance difference between putting the HTML/CSS separately or in the same .vue file.
The Vue CLI will generate the same compiled code.

## How to organise your files

### The basic structure
The basic project structure in Vue is very simple:

```text
/public
	/index.html
/src
	/assets
	/components
	App.vue
```

The idea behind this is that you add all your custom components into /components and any assets that also need to be transpiled/compiled into /assets.
For example a global stylesheet or an icon library that you want to treeshake fits perfectly into /assets.
In the public folder we put all things static: the logo, the favicons, images, ...

### A more advanced structure
The basic structure is enough for a simple single page application.
But once you start to have complex pages, things will quickly need to be changed to accommodate the amounts of files that you will create.
A more advanced project structure could be this:

```text
/public
	/index.html
/src
	/assets
	/components
	/i18n
	/models
	/store
	/views
	App.vue
```

In this structure, both /public and /assets provide the same purpose.
I use /assets for some local .json files that contain some of my data that is needed in the application.
In /components I keep all my generic components that can be used by pages and other components.
This is what you would put in a SharedModule in Angular for example.
/i18n contains all my translations of my website as well as the initialisation of the i18n library.
Same goes for the /store that contains my implementation of a store.

### Modules
Vue is designed to be as lightweight as possible and this can be seen in how the basic project is structured: no modules are present.
Vue does support modules but those are not like we know them from other frameworks like Angular.
Vue modules are simply ES6 modules.

## BlogPost component
Our first component we will write is a BlogPost component.
In a first stage of our little project we will just hardcode a blogpost.
The BlogPost component is super simple:

```vue
<template>
	<div class="blogpost">
		<h2>{{ post.title }}</h2>
		<p>{{ post.body }}</p>
		<p class="meta">Written by {{ post.author }} on {{ date }}</p>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

export interface Post {
	title: string;
	body: string;
	author: string;
	datePosted: Date;
}

@Component
export default class BlogPost extends Vue {
	@Prop() private post!: Post;

	get date() {
		return `${this.post.datePosted.getDate()}/${this.post.datePosted.getMonth()}/{this.post.datePosted.getFullYear()}`;
	}
}
</script>

<style lang="scss">
div.blogpost {
	h2 {
		text-decoration: underline;
	}
	p.meta {
		font-style: italic;
	}
}
</style>
```

As you can see the template is rather small.
We've grouped all the elements in a div with class blogpost.
Vue expects us to wrap the contents in one tag and by convention, they advise to use a div tag.

After that we have the TypeScript code.
You'll notice that we have created a small Post interface to wrap our data in.
On the component itself, we have a member that is decorated with @Prop().
With this, we allow the use of the BlogPost component with the attribute post that should have type Post.
After that we simply have a date member which is actually a computed property.

Sadly there is no full type checking going on at the moment.
If we were to use the BlogPost component, we can always pass along another object into the post attribute.
We can pass along a type attribute in the Props decorator but even that is not that stable.

We end the component with our styling in which we make use of SASS to nest all our styling.

## Using the BlogPost component
So we have created the BlogPost component but how are we going to actually use it?
We adapt App.vue to this:

```vue
<template>
	<div id="app">
		<h1>Elke's fantastic blog</h1>
		<BlogPost v-for="blogPost in blogPosts" :post="blogPost" :key="blogPost.title" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BlogPost, { Post } from './components/BlogPost.vue';

@Component({
	components: {
		BlogPost,
	},
})
export default class App extends Vue {
	private blogPosts: Post[] = [
		{
			title: 'My first blogpost ever!',
			body: 'Lorem ipsum dolor sit amet.',
			author: 'Elke',
			datePosted: new Date(2019, 1, 18),
		},
		{
			title: 'Look I am blogging!',
			body: 'Hurray for me, this is my second post!',
			author: 'Elke',
			datePosted: new Date(2019, 1, 19),
		},
		{
			title: 'Another one?!',
			body: 'Another one!',
			author: 'Elke',
			datePosted: new Date(2019, 1, 20),
		},
	];
}
</script>

<style lang="scss">
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
```

As you can see we define a property on the App component that contains our blog posts, we add the components property to the Component decorator and add the BlogPost tag in the template.
We simply loop over the blog posts with the v-for directive.
We pass each blog post to the BlogPost component by binding it to the correct data attribute.
This can be done via v-bind:post="blogPost" but we use the shorthand method of :post="blogPost".
Vue transforms :name to v-bind:name behind the screens.

Note that we also pass :key which we bind to the title of our blog post.
The reason for this is that it allows Vue to keep track of the state of the list by only looking at the :key attribute instead of having to deep compare objects.
Try to have an unique key.
A blog post title is a good start but when ordering, updating or other modifying operations you might not have the wanted result if we have blog posts with the same title.
It's best to use something of type number or string as the key.
Vue will tell you this in the console of your browser if you would take for example the datePosted as your key:

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-key-typing-error.png" class="image fit">
</div>

This all has to do with Vue being able to rely on the built-in sort and find functionalities of JavaScript.
For objects, Vue can not do this natively.

When we serve our app with 
```text
$ npm run serve
```
We see in our browser: 

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/wordvue-first-impression.png" class="image fit">
</div>

Great, you've written your first working component!

# Using your first plugin
Vue comes without any libraries, it is a super clean and lean framework where even functionality for HTTP calls is not present.
However, every component is a Vue object and can be extended with a \$http member that you can utilise in your code to perform HTTP calls.
But to provide this \$http member, we have to add the correct plugin to our code.
In the awesome-vue project on GitHub, we can find an [extensive list of HTTP plugins](https://github.com/vuejs/awesome-vue#http-requests){:target="_blank" rel="noopener noreferrer"}.
We will use [axios](https://github.com/axios/axios){:target="_blank" rel="noopener noreferrer"} as our HTTP library but we will use [vue-axios](https://github.com/imcvampire/vue-axios){:target="_blank" rel="noopener noreferrer"} for the bindings with Vue in TypeScript as axios does not provide the necessary typings for axios in Vue.

## Installing a plugin
We follow the installation instructions for vue-axios which are pretty straightforward:

```text
$ npm i axios vue-axios
```

As you can see we also install axios.
This is because vue-axios only focuses on the TypeScript bindings for Vue and does not include the actual axios library.
Vue-axios basically turns the axios library into a plugin compatible for Vue.
After that, we have to signal to Vue that we want to use this plugin.
We add a Vue.use(...) statement in our main.ts so it looks like this:

```typescript
import axios from 'axios';
import Vue from 'vue';
import VueAxios from 'vue-axios';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

new Vue({
	render: (h) => h(App),
}).$mount('#app');
```

The important part is that we put the Vue.use(...) statement before we actually bootstrap the application with new Vue(...).

## The effect of adding a plugin
So we have added a plugin, but what does that actually mean?
What is the effect on our Vue code?
The main effect is that we now have \$http accessible in every Vue object and component.
This means that we can now have this.\$http in our classes in which an unique instance of the axios library will be plugged.
When we check the documentation from axios, we find that we now have methods like get(...), post(...) and many more available in our code via the \$http member in which an instance of axios is present.

Methods like get(...), post(...) and so on will also exist on other HTTP libraries that we can plug into Vue.
This is more by community standards as it is not obliged by Vue to provide the same functionalities in an HTTP library.
But it makes sense for library creators to comply to the standard set by the HTTP library of preference as chosen by Vue, in this case axios.

## Using the axios plugin for performing HTTP calls
A Vue component has multiple lifecycle hooks with the most interesting ones for what we want to do: mounted and created.
Created is called by Vue when the object is created: reactive data is set up, event callbacks are ready and so on.
The Vue object will thus be ready to go but it will not yet be visible to the user.
The mounted hook is used for when the element is mounted into the HTML DOM, i.e. the rendering is performed by the browser.

There are 2 reasons why we want to start our HTTP calls in the created method.
The first one being that it is earlier than the mounted hook so we hopefully can limit the amount of time the user has to wait before he sees anything on the screen.
The second one is that the mounted hook is not called when we would utilise serverside rendering.
To ensure that our code is compatible with all use cases, we place the HTTP calls in the created method of our App.vue which results in this component:

```vue
<template>
	<div id="app">
		<h1>Elke's fantastic blog</h1>
		<BlogPost v-for="blogPost in blogPosts" :post="blogPost" :key="blogPost.title" />
	</div>
</template>

<script lang="ts">
@Component({
	components: {
		BlogPost,
	},
})
export default class App extends Vue {
	private blogPosts: Post[] = [];

	private created() {
		this.$http.get('http://localhost:3000/blogposts').then((response: AxiosResponse) => {
			this.blogPosts = response.data.map((val: any) => ({
			title: val.title,
			body: val.body,
			author: val.author,
			datePosted: new Date(val.datePosted),
			}));
		});
	}
}
</script>
```

As you can see we have added a private created method since this should not be publicly available to other components.
We simply call an API and map the response into our Post array.

## How we have set up a local API
To simulate a real API call, we set up [json-server](https://github.com/typicode/json-server){:target="_blank" rel="noopener noreferrer"}, a small tool that launches a web server with a REST API that serves a json file present in our assets folder:

```json
{
    "blogposts": [
        {
            "title": "My first blogpost ever!",
            "body": "Lorem ipsum dolor sit amet.",
            "author": "Elke",
            "datePosted": "2019-01-18"
        },
        {
            "title": "Look I am blogging!",
            "body": "Hurray for me, this is my second post!",
            "author": "Elke",
            "datePosted": "2019-01-19"
        },
        {
            "title": "Another one?!",
            "body": "Another one!",
            "author": "Elke",
            "datePosted": "2019-01-20"
        }
    ]
}
```

We simple had to install json-server via NPM and then we could launch it with:

```text
$ json-server src/assets/db.json
```

# Your first deployment

## Development versus production mode
Just like in other frontend frameworks, Vue has its development mode and production mode. The first one is available with:

```text
$ npm run serve
```

While the latter one is available with:

```text
$ npm run build
```

Now what is the difference between both modes?

| Development mode                                                          | Production mode                                                         |
|---------------------------------------------------------------------------|-------------------------------------------------------------------------|
| CSS & HTML bundled into JS                                                | CSS separately                                                          |
| Warnings in console                                                       | No warnings in console                                                  |
| Additional checks to identify warnings                                    | No additional checks, ignores any situation that would trigger warnings |
| Everything in one app.js                                                  | Separate app.js and vendor.js                                           |
| Heavy use of eval() for hot reload                                        | No use of eval(), no hot reloading necessary                            |
| Basic bundling of all code, use of minified libraries only when available | Bundling & maximum minification                                         |
| No minification of index.html                                             | Minification of index.html                                              |

All the minification, avoiding the use of eval(), removing of warning checks and so on result in a much smaller size of the code. 

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/wordvue-size-serve.png" class="image fit">
</div>

In development mode, our application is more than 2MB large.
While when we build with the production mode, we get an application that is in total less than 125KB: 

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/wordvue-size-build.png" class="image fit">
</div>

The only thing we changed to get a dist folder that is so small, was add a vue.config.js file in the root of our folder with this content:

```typescript
module.exports = {
    productionSourceMap: false
};
```

More configurations can be found at [cli.vuejs.org](https://cli.vuejs.org/config/){:target="_blank" rel="noopener noreferrer"} but most of the configuration is already done for a maximum optimised production build.

## Building for production
When running the npm run build command, you'll get the following output:

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-build.png" class="image fit">
</div>

So what the Vue CLI does is take all the CSS out of the components minifies it, compiles all the components into an app.js file and treeshakes all used libraries into a chunk-vendors.js file.
After that, it Gzips all those files to ensure that everything is as light as possible.
If you were to have any assets, it will also copypaste those into the dist folder.

The result is a dist folder which contents you can directly deploy onto your favourite server.

# Conclusion
Congratulations, you have built your very first Vue application with TypeScript!
You now know how to write a basic component with the use of decorators, create a component structure and fill it with data coming from an API.
After that you can also deploy it onto a server.
A next step would be to add routing, add a store, whatever you might need.
Vue is a lightweight framework that primarily focuses on visualisation.
If you want to add more functionality, you will have to resort to plugins which either support Vue integration directly or you can use a plugin like vue-axios that will facilitate the integration of another library like axios.

# Resources and further reading
* Vue CLI: [cli.vuejs.org](https://cli.vuejs.org/){:target="_blank" rel="noopener noreferrer"}
* Awesome-vue, overview of Vue plugins: [github.com/vuejs/awesome-vue](https://github.com/vuejs/awesome-vue){:target="_blank" rel="noopener noreferrer"}
* Axios, HTTP library: [github.com/axios/axios](https://github.com/axios/axios-vue){:target="_blank" rel="noopener noreferrer"}
* Vue-axios, typings for using Axios in Vue: [github.com/imcvampire/vue-axios](https://github.com/imcvampire/vue-axios){:target="_blank" rel="noopener noreferrer"}
* Vue styleguide: [vuejs.org/v2/style-guide](https://vuejs.org/v2/style-guide/){:target="_blank" rel="noopener noreferrer"}
* Vue-class-component: [github.com/vuejs/vue-class-component](https://github.com/vuejs/vue-class-component){:target="_blank" rel="noopener noreferrer"} 
* JSON server: [github.com/typicode/json-server](https://github.com/typicode/json-server){:target="_blank" rel="noopener noreferrer"} 

