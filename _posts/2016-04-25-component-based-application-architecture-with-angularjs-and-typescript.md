---
layout: post
authors: [ryan_de_gruyter]
title: 'Component-based application architecture with AngularJS and Typescript'
image: /img/components-angularjs.jpg
tags: [angularjs, typescript, javascript, components, architecture, best practices]
category: AngularJS-TypeScript
comments: true
---

## Introduction ##

> Ideally, the whole application should be a tree of components that implement clearly defined inputs and outputs, and minimize two-way data binding. That way, it's easier to predict when data changes and what the state of a component is.
>
> -- AngularJS documentation

In this article I will offer some basic guidelines on how to create a scalable AngularJS application with **reusable, well encapsulated components** that are **easy to maintain and refactor**.
AngularJS (version 1.5.5 at the time of writing) and its latest features offers us the ability to structure our apps as a tree of components.

> Each component contains its own controller and template

It can even have its own (relative) routing configured if you take advantage of the new **Component Router**.

If you are on a team with multiple front-end developers you can easily divide the work by letting each developer focus on a separate component.
It also helps in migrating to Angular 2, though I cannot promise it will be an easy task.
Another bonus point is you are getting into the mindset of modern front-end development: **web components**.

My preferred toolchain when developing AngularJS applications consists of Typescript, NPM and Webpack.
The sample code in this article and the sample application are created together with these tools.

You can find the sample application on Github:
[https://github.com/ryandegruyter/angularjs-components](https://github.com/ryandegruyter/angularjs-components "Sample app")


## What is a component? ##

> In AngularJS a **component** is a directive.

More specifically we call it a **component directive** or **template directive**.
It is an approach to writing your own custom HTML elements which browsers are able to read and render.
HTML comes with a set of pre-defined elements, for example the `<div></div>` element or the `<span></span>` element.

By combing and nesting these standard HTML tags we can build complex UI widgets.
We can change their appearance and behavior dynamically with JavaScript and CSS.

True web components can isolate their structure, appearance and behavior.
They make use of a technology called the Shadow DOM, which isolates the component in a separate DOM tree.
This element will have its styles and scripts encapsulated, they will not conflict with the styles and scripts inside the parent DOM.

Angular 2 takes full advantage of this technology, but unfortunately AngularJS, the framework I will be talking about in this article, does not.

> Components you write and register inside AngularJS **do not** get isolated into a separate DOM tree.

Lucky for us we are able to mimic the effect of Web components by using directives.
We can write a reusable UI element, declare it with a custom tag and configure it by supplying attributes on the element.
My advice is to be sure to use correct naming conventions and a module system so styles and scripts will not conflict with each other.

## Directives and components ##

To create and register a custom element in AngularJS, we can use either methods:

- `.directive (name, factoryFunction)`
- `.component (name, object)`

While components are restricted to custom elements, directives can be used to create both elements as well as custom attributes.

There are 3 types of directives:

- Component directive
- Attribute directive
- Structural directive

A **Component directive** is a directive with a template.
The `.component()` method is a helper method which creates a directive set with default properties.

An **Attribute directive** is declared as an element attribute and they can change the appearance or behavior of an element (`ng-change`, `ng-click`, ...).

A **Structural directive** is an attribute or element that manipulates the DOM by adding or removing DOM elements (`ng-if`, `ng-repeat`, ...).

## When do we use .directive(), and when do we use .component()? ##
Custom UI elements should be created with the `.component()` helper method because it:

- enforces best practices and provides optimizations (isolate scope, bindings)
- has handy defaults making it easy to create components
- makes migration to Angular 2 easier
- can take advantage of the new component router which will be the default router in Angular 2

> Use the `.directive()` method when you want to manipulate the DOM by adding or removing elements (Structural directive) or when you want to change the appearance or behavior of an element (Attribute directive).

## Creating a component-based AngularJS application ##
Beginning with a component-based application architecture we need to have a root component.
Before creating a component you have to decide if it will be a  **Presentational component** or a **Container component**.

## Presentational component ##
Also known as a dumb component.
They are used to visualize data and can easily be reused.
They don't manipulate application state nor do they fetch any data.
Instead they define a public API in which they can receive inputs (`<` and `@` bindings), and communicate any outputs (`&` binding) with their direct parent.

> Designers can easily work on Presentational components because they don't interfere with application logic.

These components are unaware of any application state, and they only get data passed down to them.

*A simple presentational root component.*

{% highlight javascript %}
	export class RootComponent implements IComponentOptions {
		static NAME:string = 'app';

		bindings:any = {
		    title: '@',
		};

  		template:string = `
	    	<h1>{{$ctrl.title}}</h1>
	    	<currency-converter></currency-converter>
	  	`;
	}

        angular
                .module('currencyConverterApp, []')
                .component(Rootcomponent.NAME, new RootComponent());

{% endhighlight %}

This component has a very simple API with one input -  `title` - and zero outputs.
It doesn't call a service or fetch any data.
It doesn't update any outside resources or make any requests to manipulate application state.
Also notice how easy it was to register this component directive.

*Let's create the same component directive but register it with the `.directive()` method.*

{% highlight javascript %}
    export class RootComponent implements IDirective {
        static NAME:string = 'app';
        restrict:string = 'E',
        bindToController:any = {
            title: '@',
        },
        scope:IScope = {},
        controller:Function = ()=>{},
        controllerAs:string = '$ctrl',
        template:string = `
            <h1>{{$ctrl.title}}</h1>
            <currency-converter></currency-converter>
         `;

        static instance():IDirective {
            return new RootComponent();
        }
    }

    angular
    .module('currencyConverterApp, []')
    .directive(Rootcomponent.NAME, RootComponent.instance());

{% endhighlight %}

As you can see, this has a lot more configuration compared to using the `.component()` helper method.
Although it offers more power and flexibility, its more practical to have the `.component()` method when creating custom UI elements.

- bindings are automatically bound to the controller
- `controllerAs` defaults to `$ctrl`
- always creates an isolate scope

## Container components ##
Also known as smart components.
This type of component is more tightly coupled to the application and not intended for reusability.
It fetches data, manages part of the application state and provides the data to its child components.
The child component communicates any update on the data through its output bindings (`&`).
The container component eventually decides what action to take with the data, not the child component.

Let's look at an example of a container component, I will leave out the complete template for brevity's sake, you can view the complete code in the companion repository.

*First we start with our component definition:*

{% highlight javascript %}
    export class CurrencyConverter implements IComponentOptions{
        static NAME:string = 'currencyConverter';

        template:string = `
            ...
            <currencies-select
                title="From"
                on-selected="$ctrl.fromSelected(selectedCurrency)"
                show-values-as-rates="true"
                currencies="$ctrl.fromCurrencies"
            ></currencies-select>
            <currencies-select
                title="To"
                on-selected="$ctrl.toSelected(selectedCurrency)"
                show-values-as-rates="true"
                currencies="$ctrl.toCurrencies"
            ></currencies-select>
            ...		
        `;

        controller:Function = CurrencyConverterComponentController;
        }

{% endhighlight %}

The template contains two declarations of a presentational component ```<currencies-select>```.
When we look at the attributes of the currencies-select element, the component API consists of **three inputs** (`title`, `show-values-as-rates` and `currencies`) and **one output** (`on-selected`).
Our container component can bind a callback method on the on-selected attribute which offers an opportunity for the currencies-select component to **communicate with its parent component**.

Below we define our components controller, here we can set and manipulate our template's view model.

{% highlight javascript %}
export class CurrencyConverterComponentController {

    selectedFromCurrency:Currency;
    selectedToCurrency:Currency;
    amount:number;
    result:number;

    fromCurrencies:Currency[];
    toCurrencies:Currency[];

    static $inject = [CurrenciesDataService.NAME];
        constructor(private currencyDataService:CurrenciesDataService) {
    }

    $onInit():void {
        this.fromCurrencies = this.toCurrencies = this.currencyDataService.getCurrenciesByYear(2016);
    }

    convert(from:number, to:number):void {
        this.result = (this.amount / from) * to;
    }

    fromSelected(currency:Currency):void {
        if(this.selectedToCurrency){
            this.convert(currency.rate, this.selectedToCurrency.rate);
        }
        this.selectedFromCurrency = currency;
    }

    toSelected(currency:Currency):void {
        if(this.selectedFromCurrency){
            this.convert(this.selectedFromCurrency.rate, currency.rate);
        }
        this.selectedToCurrency = currency;
    }
}

{% endhighlight %}

This component injects a data service to fetch a list of currencies.
We pass this list to each ```<currencies-select>``` element in the `$onInit` method.

The `$onInit` is a component lifecycle method that gets called by the framework each time the component gets instantiated.
In this method we set our view model properties `_fromCurrencies_` and `_toCurrencies_` equal to a list of currencies fetched from the data service.

The `fromSelected` and `toSelected` methods are passed down as callbacks for the ```<currencies-select on-selected>``` output.

So how does our presentational component definition look like?

{% highlight javascript %}
export class CurrencySelectComponent implements IComponentOptions {
    static NAME:string = 'currenciesSelect';

    bindings:any = {
        title: '@',
        currencies: '<',
        onSelected: '&',
        showSelected: '<',
        showValuesAsRates: '<'
    };

    controller:Function = CurrencySelectComponentController;
    template:string = `...`;
}

export class CurrencySelectComponentController {
    public title:string;
    public currencies:Currency[];
    public onSelected:Function;
    public showSelected:boolean;
    public showValuesAsRates:boolean;
    public selected:Currency;

    constructor() {
    }

    onCurrencyClick(currency:Currency) {
        this.selected = currency;
        this.onSelected({selectedCurrency: currency});
    }
}
{% endhighlight %}

Bindings define the components API, in the above case there are four bindings.
Our previous example declared this component but we only noticed three inputs and one output.
Apparently there is a fourth input called `_showSelected_`.
We can guess that it's a flag for showing the selected currency.
But as a new developer, we cannot be sure.

> This is one of the reasons why it is important to **document your components API**.
> It will save new developers and designers a lot of time figuring out how to correctly use your component.
> Your component will become more transparent and not just an abstract definition.

As you can see this component does not inject any data services or manage any outside state.
It only receives data through its input bindings:

 - `@` stands for one way string binding
 - `<` stands for one way any other primitive/type binding

The output binding `public onSelected:Function;` gets called each time the `onCurrencyClick` method gets called, it passes the selected currency which gets communicated back to the parent component.

**Make sure the parameter object key matches the parameter name in the parent component's viewmodel**, or the component will not be able to communicate any data.
in this case `selectedCurrency`:

{% highlight javascript %}
onCurrencyClick(currency:Currency) {
  this.selected = currency;
  this.onSelected({selectedCurrency: currency});
}
{% endhighlight %}

And inside the parent component's template:

{% highlight javascript %}
<currencies-select on-selected="$ctrl.toSelected(selectedCurrency)" ...
{% endhighlight %}

Another way of accessing selectedCurrency, is to use `$locals`.
This is useful when you want to send multiple types of data back.
The advantage is you don't have to specify each parameter separately in the component's template.
The disadvantage is `$locals` is not descriptive.

{% highlight javascript %}
<currencies-select
	on-selected="$ctrl.toSelected($locals)"...
{% endhighlight %}

To access the selectedCurrency you would use the property on the $locals object with the same name:

{% highlight javascript %}
toSelected($locals:any):void{
	var selected:Currency = $locals.selectedCurrency ...
}
{% endhighlight %}

## Component communication ##

### Output binding ###

In our previous example we saw an example of child to parent communication by mapping an output binding:

{% highlight javascript %}
binding:any = {
	onSelected: '&'
}
{% endhighlight %}

The parent component can pass a method to this binding which the child component can call back and optionally send back any data to.

### Mapping the require property ###

A child component can also require its parent components controller by mapping it in the require property:

{% highlight javascript %}
require:any = {
	parentCtrl: '^parentComponentName'
}
{% endhighlight %}

The **^** symbol is important here.
You should replace `parentComponentName` with the correct component name, you are free to choose a different name for the key, in this case `parentCtrl`.
The parent controller will get bound on to the property `parentCtrl`.

Be aware that this creates a tight coupling between the child and parent component.

### Using a service ###

We should access and manipulate application state in our container components, but only through services, a component's controller primary responsibility is to manage the template's view model.
You can implement a custom observer pattern inside the service, or use the rootscope as an eventbus.

{% highlight javascript %}
export class SampleService{
    static SERVICE_NAME:string = "mysampleservice";
    static EVENT_NAME:string = "sampleEvent";

    static $inject = ['$rootScope'];
    constructor(private $rootScope:IRootscopeService){}

    subscribe(scope:IScope, callback:Function):void {
        var handler = this.$rootScope.$on(SampleService.EVENT_NAME, callback);
        scope.$on('$destroy', handler);
    },

    notify():void {
        this.$rootScope.$emit(SampleService.EVENT_NAME);
    }
}
{% endhighlight %}

A component controller can get notified by any changes by subscribing to the service:

{% highlight javascript %}
    export class MyComponentController{		
        static $inject = ['$scope', SampleService.SERVICE_NAME];
        constructor(private isolatescope:IScope, private sampleService:SampleService){}

        $onInit():void{
            this.sampleService.subscribe(this.isolateScope, ()=>{
                ...
            });
         }
    }

{% endhighlight %}

### Summary ###

Start with a root component and work your way down building components that are composed of either **presentational** and **container** components.
Data should flow down in one direction (`<` and `@` input bindings), and events should propagate back up (`&` output binding).

> **Services** manage application state

> **Controllers** manage a templates' view model

> Application state is accessed only by **container components through services**.

- Use `.component()` when writing custom HTML elements in AngularJS
- Use `.directive()` when you need to manipulate the DOM or need to change the appearance or behavior of a DOM element
- Minimize 2 way binding (`ngModel` and `=` binding)
- Presentational components can contain both container components and presentational components and vice versa
- Use the **component router**, which makes it easy to bind URL paths to components. A component can contain its own relative routes too
- Document your component's API so new developers and designers know how to use it correctly
- Keep your controllers clean, their main purpose is to set and manipulate the templates' view model. **Delegate business logic to services**
