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
1. [Vue with TypeScript, an introduction](#1-introduction)
2. [Creating a Vue project with TypeScript](#2-creating-a-vue-project-with-typescript)
3. [A look into the files created by the Vue CLI](#3-a-look-into-the-files-created-by-the-vue-cli)
4. [How to write your first component](#4-how-to-write-your-first-component)
5. [Using your first plugin](#5-using-your-first-plugin)
6. [Your first deployment](#6-your-first-deployment)
7. [Conclusion](#7-conclusion)
8. [Resources and further reading](#8-resources-and-further-reading)

# 1. Vue with TypeScript, an introduction
With the release of the Vue CLI 3 in August 2018, Vue now officially supports development in TypeScript.
In September 2018, Evan You even announced that [the next version of Vue will be rewritten in TypeScript](https://medium.com/the-vue-point/plans-for-the-next-iteration-of-vue-js-777ffea6fabf){:target="_blank" rel="noopener noreferrer"}.
This does not mean that you are forced to use TypeScript, it will still be an option.
TypeScript has numerous advantages such as static typing and transpiling of the latest ECMAScript features for full compatibility with older browsers.
Especially the static typing is a very interesting feature for projects in a professional environment as it helps define more strict interfaces.
With the use of types, you inherently provide documentation to other developers on how to use your code as it offers guidance on how to use your functions, components and so on.

In this tutorial we will make a really simple blog system to showcase how you create a project, create a component, install a plugin and do calls via HTTP.
Our little project will be called `wordvue`.
At the same time we will explain some tips and tricks and give some background information about Vue with TypeScript so that you fully understand what the purpose is of each line of code.
The project can be found in a [GitHub repository](https://github.com/ordina-jworks/vue-typescript-wordvue){:target="_blank" rel="noopener noreferrer"} so you can see a working version.

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-plus-typescript-small.png" class="image">
</div>

# 2. Creating a Vue project with TypeScript

## Using the Vue CLI
Thanks to the Vue CLI, it is the easiest way to create a new Vue project.
First make sure you have the latest version of the CLI installed with NPM:

```text
$ npm i -g @vue/cli
```

After that we create our project:

```text
$ vue create wordvue
```

The CLI knows some presets but we will go through the manual mode to be sure we select the TypeScript version, at the time of writing the current default language for Vue is JavaScript.

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-1-manually-select.png" class="image">
</div>

### Babel + TypeScript
<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-2-selected-features.png" class="image right fit">
</div>

We check the TypeScript option and for the purpose of this article we will not look in detail at the other features of this screen and leave on the defaults.
I also checked CSS Pre-processors just because I like SCSS.
Make sure you have Babel selected, Babel will automatically add multiple pollyfills.
The pollyfills will help with having backwards compatibility of ECMAScript features.

### Using the class-style component syntax
<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-3-class-style-component-syntax.png" class="image fit">
</div>

In the next screen we will get the question if we want class-style component syntax, for which we answer yes.
With this, we actually install the decorators that can be found in the [Vue Class Component package](https://github.com/vuejs/vue-class-component).
We will now explain the difference between using the class-style coomponent syntax and using the classic Vue syntax.

#### The classic Vue Syntax
If you do not use the class-style component syntax, your components will look exactly as if you have rendered them with Vue with JavaScript, but with the addition of types:

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

As you can see, you'll still have the data function, the methods, computed properties and the render function that you can use in regular Vue.

#### Class-style component syntax
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

### The other settings
After you've replied `Yes` to the "Use class-style component syntax?" question, you can continue with the default options.

For the CSS pre-processor, you either choose between Stylus, Less and SCSS. We choose the default `Sass/SCSS (with node-sass)`.

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-4-css-preprocessor.png" class="image fit">
</div>

As for the linter, you can either choose between TSLint or ESLint with a bunch of configurations.
I opt for the default `TSLint` option as the support for TypeScript in ESLint is (at the time of writing) fairly recent.
But ESLint is certainly a valid option as the TypeScript has announced in their [January to June 2019 roadmap](https://github.com/Microsoft/TypeScript/issues/29288) that ESLint will be their own focus.

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-5-linter.png" class="image fit">
</div>

We can choose for the `Lint on save`option as we want to see immediately the effects of our linter.

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-6-lint-on-save.png" class="image fit">
</div>

Finally we have to choose if we want the configurations in dedicated files or all bundled together in our package.json. We opt for `In dedicated config files` as we prefer to not clutter the package.json with a lot of configurations.

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-7-dedicated-config.png" class="image fit">
</div>

The Vue CLI will now create the project with a Git repository, perform an NPM install and generate a README.

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-8-project-generated.png" class="image fit">
</div>

## Launching your first Vue project
After the Vue CLI has created your Vue project, you can go with the terminal to the root folder of the project and launch it with:

```text
$ npm run serve
```

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-default-page.png" class="image fit">
</div>

As you will see, the CLI starts the development server, starts the type checking and linting service.
By default the project runs on http://localhost:8080 but if there's already something running on port 8080, he will pick port 8081 or the next one available.
This way you don't need to specify a free port.

A default Vue project looks like this:

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-serve.png" class="image fit">
</div>

# 3. A look into the files created by the Vue CLI

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-generated-files.png" class="image right">
</div>

The files that the Vue CLI generated are mainly all the configuration files that we wanted separately.
So we have a configuration file for Babel with babel.config.js, PostCSS (which contains the configuration for SCSS) with postcss.config.js, TypeScript with tsconfig.json and TSLint with tslint.json.
You will also find a node_modules folder for all your NPM packages with a package.json in which we define all the NPM packages that we need in our project.
If we would have opted for the `In package.json` option, we would have had a large package.json file.

The main folders in which you will work are public and src. We will look at these more in detail later so you fully understand what their purpose is.

## Public
Public is meant for static assets like images, favicons and more.
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
One example situation would be to add Google Analytics, add more meta tags or adapt the title tag.
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

When you look in the src folder, you will find a main.ts file.
This is the one that Vue will execute first.
As you can see this creates a new instance of Vue in which we only define a render function.
Vue will pass along `h` which is of type `CreateElement`.
`h` has been [chosen by the creator of Vue](https://github.com/vuejs/babel-plugin-transform-vue-jsx/issues/6){:target="_blank" rel="noopener noreferrer"} as it is short for `Hyperscript`, a term that is used in several virtual DOM implementations.
A hyperscript is a script that will generate HTML structures.
It takes one parameter: `App`.
Thus in a Vue project, `h` will generate the HTML for our App component.
App is our main component that was generated by the Vue CLI and we will dive into that after this section.
main.ts should only be adapted to plug in new core functionalities of your application.
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
    router, // custom router configuration
    store, // custom store implementation
    i18n, // my translations
    render: (h: CreateElement): VNode => h(App),
}).$mount('#app');
```

As you can see, I have added 3 core functionalities: a router, a store and an i18n library.
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

This means that we will have a \$i18n property available and 5 different functions.
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
Like said before we will only focus on the basic Vue functionalities and HTTP calls.
The other topics will be for a future article.

### App.vue
The App.vue file is our first component that Vue bootstraps through our main.ts file.
It is considered to be the root component.
The Vue CLI generates the App component with one child component.
```vue
{% raw %}
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
{% endraw %}
```

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

Each node of the tree is a component.
With the use of the `@Component(...)` decorator, we define which components can be child components of the component that we're defining.
For example in our App component, we want the HelloWorld component (through the HelloWorld tag), thus we add the components option with HelloWorld in there.
These components are local components.
If you would want to write a component that is global, you have to register it like this:

```typescript
Vue.component('my-component-name', {
	// ... options ...
})
```

A global component can be accessed anywhere.
Try to avoid this as much as possible as it fills up the global namespace.
An example of a use case that is justified would be an icon library like Font Awesome:

```typescript
library.add(
    faBars,
    ...
    faCameraRetro,
);
Vue.component('font-awesome-icon', FontAwesomeIcon);
```

After this we can access the font-awesome-icon tag from everywhere.

```html
<font-awesome-icon icon="arrow-down" />
```

# 4. How to write your first component
We will keep the project as simple as possible for now.
Firstly I will explain the basics of a Vue Component so that you will fully understand what happens when we write our first real component.

## The structure of a .vue file
```vue
{% raw %}
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
{% endraw %}
```

The standard way to write a Vue component is by using the .vue file extension.
In a .vue file, we define 3 optional tags: `template`, `script` and `style`.
According to the Vue documentation, you should always [order the tags consistently](https://vuejs.org/v2/style-guide/#Single-file-component-top-level-element-order-recommended){:target="_blank" rel="noopener noreferrer"} with style being the last one.

### \<template>...\</template>
This is the visual part of your component, in here you define the HTML that will be used to display your component.
Note that your custom HTML should always be surrounded by a div tag.
The reason for this is that it allows Vue to encapsulate your custom CSS without unknowingly affecting the styling of your whole site.
You can use this to add a custom id or class to the tag to help you identify the component in for example your e2e tests.
Note that a .vue file can contain at most one template tag.

### \<script lang="ts">...\</script>
In the script tag, you can add your custom TypeScript code.
The lang attribute is not required but if you do not add it, the default language will be JavaScript.
In order for TypeScript to be available, you need to add `lang="ts"`.
All of our TypeScript code should be present in this script tag, even the import statements.
Note that a .vue file can contain at most one script tag.

### \<style>...\</style>
In the style tag we can define our own SCSS specific for this component.
By default, all the styles you define in a style tag are global.
By adding the scoped attribute to our style tag, our custom SCSS will be specific for that component.

```vue
{% raw %}
<template>
	<div id="app">
		<p>Hello World!</p>
		<ChildComponent></ChildComponent>
	</div>
</template>

<script lang="ts">
...
</script>

<style scoped>
#app {
	p {
		text-style: italic;
	}
}
</style>

<style>
#app {
	p {
		color: red;
	}
}
</style>
{% endraw %}
```

In the example above, the `style` tag with the scoped attribute will only affect the p tag in our component and not the one in our child component.
The `color: red` styling however will affect also the styling of p tags in `ChildComponent`.
So it is best to be aware of the implications as it can have unwanted side effects.
For a good way to structure your CSS, check out the [BEM methodology](http://getbem.com){:target="_blank" rel="noopener noreferrer"} as it will help with avoiding conflicts and will guide you in having clean CSS selectors.

Be careful though as the scoped attribute leads to a certain performance hit.
Simply by adding the same class or id that we used in the template, we avoid this performance hit and still can have some scoped SCSS.
Note that this will also style the child components.
A .vue file can contain more than one style tag.

If you want to use global styles, you can either put them in App.vue or create your own CSS file that you import either directly in index.html or in App.vue.

### Should you put everything in a .vue file?
For small components, a .vue file will be very interesting as you have all the elements that make up your component into one specific file.
But what if you have for example lots of lines in the template tag?
Or what if you just want to split up the file?
One tactic you can use is the src attribute on the template, script and/or style tags.

```vue
<template src="./mycomponent.html"></template>
<script lang="ts" src="./mycomponent.ts"></script>
<style src="./mycomponent.scss"></style>
```

Personally I avoid using the src attribute as I like to force myself to keep my .vue files as small as possible.
There's also no performance difference between putting the HTML/SCSS separately or in the same .vue file.
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
For example a global stylesheet or an icon library that you want to [treeshake](https://webpack.js.org/guides/tree-shaking/){:target="_blank" rel="noopener noreferrer"} fits perfectly into /assets.
In the public folder we put all things static that don't need to be parsed and treeshaked: the logo, the favicons, images, ...

### A more advanced structure
The basic structure is enough for a simple single page application.
But once you start to have complex pages, things will quickly need to be changed to accommodate the amount of files that you will create.
In a more advanced project (like a personal project of mine), the structure could be like this:

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

In this project structure, both /public and /assets provide the same purpose.
I use /assets for some local .json files that contain some of my data that is needed in the application.
In /components I keep all my generic components that can be used by pages and other components.
This is what you would put in a SharedModule in Angular for example.
/i18n contains all my translations of my website as well as the initialisation of an i18n library.
Same goes for the /store that contains my implementation of a store.
I had based myself on the [structure proposed in the Vuex library](https://vuex.vuejs.org/guide/structure.html) where they group everything store related into /store and applied the same principle for other libraries.

### Modules
Vue is designed to be as lightweight as possible and this can be seen in how the basic project is structured: no modules are present.
Vue does support modules but not in the way like we know them from other frameworks like Angular.
Vue modules are simply ES6 modules.

## BlogPost component

### The basic file
Our first component we will write is a BlogPost component in `components/BlogPost.vue`.
In a first stage of our little project we will just hardcode a blogpost.
The BlogPost component is small:

```vue
{% raw %}
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
		return `${this.post.datePosted.getDate()}/${this.post.datePosted.getMonth()}/${this.post.datePosted.getFullYear()}`;
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
{% endraw %}
```

As you can see the template is rather small.
We've grouped all the elements in a div with class blogpost.
Vue expects us to wrap the content in one tag and by convention, they advise to use a div tag.

Within the script tag you'll notice that we have created a small Post interface to wrap our data.
On the component itself, we have a member that is decorated with `@Prop()`.
With the decorator, we allow the use of the BlogPost component with the attribute post that should have type Post.
You'll notice we've added a `!` behind `post` so we end up with `post!`.
The exclamation mark is the [non-null assertion operator](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#non-null-assertion-operator){:target="_blank" rel="noopener noreferrer"} which tells the browser that `post` will eventually be filled in with a value and that it shall never be `null` or `undefined`.

```html
<BlogPost :post="blogPost" />
```

Where `blogPost` is an instance of `Post` in our component.

After that we have a date member which is a computed property.

Sadly there is no full type checking going on at the moment.
If we were to use the BlogPost component, we can always pass along another object into the post attribute.
We can pass along a type attribute in the Props decorator but even that is not that stable.

```typescript
@Prop({type: Object as () => Post})
```

We end the component with our styling in which we make use of SCSS to nest all our styling.

## Using the BlogPost component
So we have created the BlogPost component but how are we going to actually use it?
We adapt App.vue to this:

```vue
{% raw %}
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
{% endraw %}
```

As you can see we define a property on the App component that contains our blog posts, we add the components property to the Component decorator and add the BlogPost tag in the template.
We simply loop over the blog posts with the v-for directive.
We pass each blog post to the BlogPost component by binding it to the correct data attribute.
This can be done through `v-bind:post="blogPost"` but we use the shorthand method of `:post="blogPost"`.
Vue transforms `:post` to `v-bind:post` behind the screens.

Note that we also pass `:key` which we bind to the title of our blog post.
The reason for this is that it allows Vue to keep track of the state of the list by only looking at the `:key` attribute instead of having to deep compare objects.
Try to have an unique key of type number or string that can be used for actions such as identifying, ordering and searching.
A blog post title is a good start but when ordering, updating or other modifying operations you might not have the wanted result if we have blog posts with the same title.
It's best to use something of type number or string as the key.
Vue will tell you this in the console of your browser if you would take for example the `datePosted` as your key:

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-key-typing-error.png" class="image fit">
</div>

The reason behind this is that Vue relies on the built-in sort and find functionalities of JavaScript.
For objects, Vue can not do this natively.

When we serve our app with 
```text
$ npm run serve
```
We see in our browser: 

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/wordvue-first-impression.png" class="image">
</div>

Great, you've written your first working component!
Now it is time to extend it with some functionalities.

## Adding conditional elements to the component
An important part of a component is to have some dynamic behaviour.
For example what if we want to show a highlighted blog post? 
We could create a new component called `HighlightedBlogPost` but we could also extend our existing component.

We can add a new paragraph with a `v-if` statement:

```html
<p v-if="post.highlighted">This post is highlighted!</p>
```

The contents of the `v-if` is a TypeScript statement that should return `true` or `false`.
We extend our `Post` interface to accomodate this:

```typescript
export interface Post {
	title: string;
	body: string;
	author: string;
	datePosted: Date;
	highlighted?: boolean;
}
```

After that we add `highlighted: true,` to the second blog post in `App.vue`.

In our browser it looks like this:

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/wordvue-conditional-elements.png" class="image">
</div>

We end up with this as our BlogPost component:

```vue
{% raw %}
<template>
	<div class="blogpost">
		<h2>{{ post.title }}</h2>
		<p v-if="post.highlighted">This post is highlighted!</p>
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
	highlighted?: boolean;
}

@Component
export default class BlogPost extends Vue {
	@Prop() private post!: Post;

	get date() {
		return `${this.post.datePosted.getDate()}/${this.post.datePosted.getMonth()}/${this.post.datePosted.getFullYear()}`;
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
{% endraw %}
```

## Adding conditional CSS to our component
We now know how to add a conditional element to our component, but we can also have conditional CSS.
We will use this conditional CSS so our highlighted blog post is also visually highlighted.

We can add in our div with class blogpost an extra `v-bind` directive:

```html
<div class="blogpost" v-bind:class="{ highlighted: post.highlighted }">...</div>
```

With `v-bind` we define to which attribute we want to bind after the colon.
So in our case, `v-bind:class` results in a binding with the `class` attribute in our HTML.
`v-bind:class` accepts an object as parameter in which each key should be mapped to a boolean.
For each key that is mapped to a truthy value, that key is added as a class to the HTML tag on which the `v-bind` is located.
You will notice that we use `v-bind` to bind to the `class` attribute but that this attribute already exists on our HTML element.
This is no problem as Vue will simply concatenate all the values.
In the case that `post.highlighted` is truthy, we will thus end up with:

```html
<div class="blogpost highlighted">...</div>
```

And when it is falsy, we end up with:

```html
<div class="blogpost">...</div>
```

We extend our `.blogpost` to give the blog posts a width, center them and add a border with a background:

```css
div.blogpost {
	width: 400px;
	margin: 0 auto;
	&.highlighted {
		border: 1px solid #f4d942;
		background: #fff3b2;
	}
	...
}
```

In our browser it looks like this:

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/wordvue-conditional-css.png" class="image">
</div>

Note that we also have a shorter version of `v-bind:attributename` which is `:attributename`.
So we can shorten `v-bind:class` to this:

```html
<div class="blogpost" :class="{ highlighted: post.highlighted }">...</div>
```

We end up with this as our BlogPost component:

```vue
{% raw %}
<template>
	<div class="blogpost" :class="{ highlighted: post.highlighted }">
		<h2>{{ post.title }}</h2>
		<p v-if="post.highlighted">This post is highlighted!</p>
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
	highlighted?: boolean;
}

@Component
export default class BlogPost extends Vue {
	@Prop() private post!: Post;

	get date() {
		return `${this.post.datePosted.getDate()}/${this.post.datePosted.getMonth()}/${this.post.datePosted.getFullYear()}`;
	}
}
</script>

<style lang="scss">
div.blogpost {
	width: 400px;
	margin: 0 auto;
	&.highlighted {
		border: 1px solid #f4d942;
		background: #fff3b2;
	}
	h2 {
		text-decoration: underline;
	}
	p.meta {
		font-style: italic;
	}
}
</style>
{% endraw %}
```

## Using events in a component
As a final extension to our blog, we also want to add some dynamic behaviour by reacting to events.
For our example, we will bind a button to the click event in our App component with the `v-on:click` directive.

```html
<button v-on:click="toggleHighlightedPostsVisibility">Show/hide highlighted posts</button>
```

The syntax to bind to events is `v-on:eventname`.
We can also use the shorthand version which is `@eventname`:

```html
<button @click="toggleHighlightedPostsVisibility">Show/hide highlighted posts</button>
```

After that we write the event handler along with some variables in our component and we'll explain after the code what we have done:

```typescript
export default class App extends Vue {
	// ...
	public showHighlighted: boolean = true;

	private blogPosts: Post[] = [];

	get visibleBlogPosts() {
		return this.blogPosts.filter((post: Post) => post.highlighted === undefined ||  post.highlighted === this.showHighlighted);
	}

	public toggleHighlightedPostsVisibility() {
		this.showHighlighted = !this.showHighlighted;
	}
	// ...
}
```

First what we did was add the `showHighlighted` boolean.
This is to keep track whether we should show or hide the highlighted blog posts.

We also wrote a getter to only show the blog posts that are allowed to be shown.
In our filter, we check if the `highlighted` member is defined and if so, we check if it equals our `showHighlighted` variable.

The reason why we write this in a getter, is that we want to avoid putting business logic in our template.
Thus we opt for writing a getter which is the equivalent of a computed property in Vue JavaScript.

After this we have to adapt the `v-for` in our template so that we use the new getter:

```html
<BlogPost v-for="blogPost in visibleBlogPosts" :post="blogPost" :key="blogPost.title" />
```

As a small bonus, we will make the text in our button dynamic.
Currently we have `Show/hide highlighted posts` as the text but it would be cleaner if we showed `Show highlighted posts` and `Hide highlighted posts` depending on the state of the component.
We update the button to the following code:

```html
{% raw %}
<button @click="toggleHighlightedPostsVisibility">{{ showHighlighted ? 'Hide' : 'Show' }} highlighted posts</button>
{% endraw %}
```

In the end, we end up visually with this:

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/wordvue-events-showhide.png" class="image">
</div>

And our App component looks like this:

```vue
{% raw %}
<template>
	<div id="app">
		<h1>Elke's fantastic blog</h1>
		<button @click="toggleHighlightedPostsVisibility">{{ showHighlighted ? 'Hide' : 'Show' }} highlighted posts</button>
		<BlogPost v-for="blogPost in visibleBlogPosts" :post="blogPost" :key="blogPost.title" />
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

	public showHighlighted: boolean = true;

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
			highlighted: true,
		},
		{
			title: 'Another one?!',
			body: 'Another one!',
			author: 'Elke',
			datePosted: new Date(2019, 1, 20),
		},
	];

	get visibleBlogPosts() {
		return this.blogPosts.filter((post: Post) => post.highlighted === undefined ||  post.highlighted === this.showHighlighted);
	}

	public toggleHighlightedPostsVisibility() {
		this.showHighlighted = !this.showHighlighted;
	}
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
{% endraw %}
```

# 5. Using your first plugin
Vue comes without any libraries, it is a super clean and lean framework where even functionality for HTTP calls is not present.
However, every component is a Vue object and can be extended with a `$http` member that you can use in your code to perform HTTP calls.

To provide this `$http` member, we have to add the correct plugin to our code.
In the [awesome-vue project on GitHub](https://github.com/vuejs/awesome-vue){:target="_blank" rel="noopener noreferrer"}, we can find an [extensive list of HTTP plugins](https://github.com/vuejs/awesome-vue#http-requests){:target="_blank" rel="noopener noreferrer"}.
We will use [axios](https://github.com/axios/axios){:target="_blank" rel="noopener noreferrer"} as our HTTP library but we will use [vue-axios](https://github.com/imcvampire/vue-axios){:target="_blank" rel="noopener noreferrer"} for the bindings with Vue in TypeScript as axios does not provide the necessary typings for axios in Vue.

## Installing a plugin
We follow the installation instructions for vue-axios which are pretty straightforward:

```text
$ npm i axios vue-axios
```

As you noticed we also installed axios.
This is because vue-axios only focuses on the TypeScript bindings for Vue and does not include the actual axios library.
Vue-axios basically turns the axios library into a plugin compatible for Vue.
After that, we have to signal to Vue that we want to use this plugin.
We add a `Vue.use(plugin, options)` statement in our main.ts so it looks like this:

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

The important part is that we put the `Vue.use(...)` statement before we actually bootstrap the application with `new Vue(...)`.

## The effect of adding a plugin
So we have added a plugin, but what does that actually mean?
What is the effect on our Vue code?
The main effect is that we now have `$http` accessible in every Vue component.
This means that we can now have `this.$http` in our classes in which a unique instance of the axios library for the whole application will be plugged.
When we check the [typings](https://github.com/axios/axios/blob/master/index.d.ts){:target="_blank" rel="noopener noreferrer"}  from axios, we find that we now have methods like `get(...)`, `post(...)` and many more default REST methods available in our code through the \$http member in which an instance of axios is present.

Methods like `get(...)` and `post(...)` will also exist on other HTTP libraries that we can add to Vue.
It is not obliged by Vue to provide these same functionalities in another HTTP library.
But it makes sense for library creators to comply to the standard set by the HTTP library of preference as chosen by Vue, in this case axios.
Otherwise it would not be easy to change certain libraries for another one.

## Using the axios plugin for performing HTTP calls
A Vue component has [multiple lifecycle hooks](https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks){:target="_blank" rel="noopener noreferrer"} with the most interesting ones for what we want to do: `created()` and `mounted()`.
Created is called by Vue when the object is created: reactive data is set up, event callbacks are ready and the object is not yet mounted on the DOM.
The Vue object will thus be ready to go but it will not yet be visible to the user.
The mounted hook is used for when the element is mounted into the HTML DOM, which means the rendering is performed by the browser.

```vue
{% raw %}
<template>
	<div id="app">
		...
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class App extends Vue {
	private created() {
		console.log('The app is created!');
	}

	private mounted() {
		console.log('The app is mounted!');
	}
}
</script>

<style lang="scss">
#app {
  ...
}
</style>
{% endraw %}
```

There are 2 reasons why we want to start our HTTP calls in the created method.
The first reason is that we can limit the amount of time the user has to wait for data to be loaded and shown on the screen.
The second one is that the mounted hook is not called when we would use serverside rendering.
To ensure that our code is compatible with all use cases, we place the HTTP calls in the created method of our App.vue which results in this component:

```vue
{% raw %}
<template>
	<div id="app">
		<h1>Elke's fantastic blog</h1>
		<button @click="toggleHighlightedPostsVisibility">{{ showHighlighted ? 'Hide' : 'Show' }} highlighted posts</button>
		<BlogPost v-for="blogPost in visibleBlogPosts" :post="blogPost" :key="blogPost.title" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BlogPost, { Post } from './components/BlogPost.vue';
import { AxiosResponse } from 'axios';

@Component({
	components: {
		BlogPost,
	},
})
export default class App extends Vue {

	public showHighlighted: boolean = true;

	private blogPosts: Post[] = [];

	get visibleBlogPosts() {
		return this.blogPosts.filter((post: Post) => post.highlighted === undefined ||  post.highlighted === this.showHighlighted);
	}

	public toggleHighlightedPostsVisibility() {
		this.showHighlighted = !this.showHighlighted;
	}

	private created() {
		this.$http.get('http://localhost:3000/blogposts').then((response: AxiosResponse) => {
			this.blogPosts = response.data.map((val: any) => ({
				title: val.title,
				body: val.body,
				author: val.author,
				datePosted: new Date(val.datePosted),
				highlighted: val.highlighted,
			}));
		});
	}
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
{% endraw %}
```

As you can see we have added a private created method since this should not be publicly available to other components.
We call an API and map the response into our Post array.
Now we need to set up our API.

## How we have set up a local API
To simulate a real API call, we set up [json-server](https://github.com/typicode/json-server){:target="_blank" rel="noopener noreferrer"}, a small tool that launches a web server with a REST API that serves a json file which we call `db.json` present in our assets folder:

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
			"datePosted": "2019-01-19",
			"highlighted": true
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

We install json-server with NPM and then we launch it with:

```text
$ npm i json-server
$ json-server src/assets/db.json
```

By default, json-server will launch on port 3000.
When we launch wordvue and open it in the browser, we will see that the blog posts are now coming from our local API.
Now you know how to install a plugin and retrieve data with axios over HTTP.

# 6. Your first deployment

## Development mode versus production mode
Just like other frontend frameworks, Vue has its development mode and production mode. The development mode is available with:

```text
$ npm run serve
```

While production mode is available with:

```text
$ npm run build
```

Now what is the difference between both modes?

| Development mode                                                          | Production mode                                                         |
|---------------------------------------------------------------------------|-------------------------------------------------------------------------|
| CSS & HTML bundled into JS                                                | CSS separately, HTML bundled into JS                                    |
| Warnings in console                                                       | No warnings in console                                                  |
| Additional checks to identify warnings                                    | No additional checks, ignores any situation that would trigger warnings |
| Everything in one app.js                                                  | Separate app.js and vendor.js                                           |
| Heavy use of eval() for hot reload                                        | No use of eval(), no hot reloading necessary                            |
| Basic bundling of all code, use of minified libraries only when available | Bundling & maximum minification                                         |
| No minification of index.html                                             | Minification of index.html                                              |

> *vendor.js*: Contains all the node_modules code that your project uses
>
> *eval()*: JavaScript function that executes strings as if it's a line of code and should [never be used in production](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Do_not_ever_use_eval!){:target="_blank" rel="noopener noreferrer"} 

All the minification, avoiding the use of `eval()`, removing of warning checks and so on results in a much smaller size of the code.

If we do a `npm run serve` and check our Developer Tools in Chrome, we see the size of our application:

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/wordvue-size-serve.png" class="image fit">
</div>

In development mode, our application is more than 2MB large. We see the index.html alongside a generated app.js that contains all our own code and all the node_modules that we are using.
While when we build with the production mode via `npm run build`, we get an application that is in total less than 125KB: 

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/wordvue-size-build.png" class="image fit">
</div>

The only thing we changed to get a dist folder that is so small, was add a vue.config.js file in the root of our folder which exports an object with the settings we want:

```typescript
module.exports = {
    productionSourceMap: false
};
```

We only had to add the `productionSourceMap` set to false to disable the creation of source maps.

More configurations can be found at [cli.vuejs.org](https://cli.vuejs.org/config/){:target="_blank" rel="noopener noreferrer"} but most of the configuration is already done for a maximum optimised production build.

## Building for production
When running the `npm run build` command, you'll get the following output:

<div style="text-align: center;">
  <img src="/img/vue-with-typescript/vue-cli-build.png" class="image fit">
</div>

So what the Vue CLI does is take all the SCSS out of the components and minifies it, compiles all the components into an app.js file and [treeshakes](https://webpack.js.org/guides/tree-shaking/){:target="_blank" rel="noopener noreferrer"}  all used libraries into a chunk-vendors.js file.
After that, it Gzips all those files to ensure that everything is as light as possible.
If you have any assets, it will also clone those into the dist folder.

The result is a dist folder which contents you can directly deploy onto your favourite server.

# 7. Conclusion
Congratulations, you have built your very first Vue application with TypeScript!
The end result can be found in my [GitHub repository](https://github.com/ordina-jworks/vue-typescript-wordvue){:target="_blank" rel="noopener noreferrer"}  so you can see the working version.
You now know how to write a basic component with the use of decorators, create a component structure and fill it with data coming from an API.
After that you can also deploy it onto a server.
A next step would be to add routing, add a store or an i18n library.
Vue is a lightweight framework that primarily focuses on visualisation.
If you want to add more functionality, you will have to rely on plugins who either support Vue integration directly or you can use a plugin like vue-axios that will facilitate the integration of another library like axios.

# 8. Resources and further reading
* Vue CLI: [cli.vuejs.org](https://cli.vuejs.org/){:target="_blank" rel="noopener noreferrer"}
* Awesome-vue, overview of Vue plugins: [github.com/vuejs/awesome-vue](https://github.com/vuejs/awesome-vue){:target="_blank" rel="noopener noreferrer"}
* Axios, HTTP library: [github.com/axios/axios](https://github.com/axios/axios-vue){:target="_blank" rel="noopener noreferrer"}
* Vue-axios, typings for using Axios in Vue: [github.com/imcvampire/vue-axios](https://github.com/imcvampire/vue-axios){:target="_blank" rel="noopener noreferrer"}
* Vue styleguide: [vuejs.org/v2/style-guide](https://vuejs.org/v2/style-guide/){:target="_blank" rel="noopener noreferrer"}
* Vue-class-component: [github.com/vuejs/vue-class-component](https://github.com/vuejs/vue-class-component){:target="_blank" rel="noopener noreferrer"} 
* JSON server: [github.com/typicode/json-server](https://github.com/typicode/json-server){:target="_blank" rel="noopener noreferrer"} 
* Wordvue repository: [github.com/ordina-jworks/vue-typescript-wordvue](https://github.com/ordina-jworks/vue-typescript-wordvue){:target="_blank" rel="noopener noreferrer"} 
