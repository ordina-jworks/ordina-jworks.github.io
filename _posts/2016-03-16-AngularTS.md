---
layout: post
authors: [kevin_van_houtte]
title: 'AngularTS: A new look @ Angular'
image: /img/angularts.jpg
tags: [TypeScript,AngularJS]
category: AngularJS-TypeScript
comments: true
---

## Combining the best of two worlds.

Since my introduction to the heroic AngularJS framework at Devoxx around 4 years ago, I was intrigued and set for an adventure.
With the upcoming release of Angular 2 we have to prepare ourselves with the migrating road map coming up.
One of the core changes in Angular 2 is the focus on using TypeScript.
This post will cover the use of Angular components in TypeScript.
But what is it?
TypeScript is a superset of JavaScript that focuses on strong typing and new ES6 features: classes, interfaces and modules.
Like in common object-oriented languages such as Java and C# these features aren’t new.
These features give the developer the opportunity to build an object-oriented architecture in JavaScript.
With that in mind, let’s see what the advantages are: 

### Transpiling
The DOM can only recognize JavaScript.
With this said they had to come up with a way to compile TS (TypeScript).
Because TS is a superset of JS it can transpile to plain JavaScript before including it into HTML.
Transpilers are integrated in the latest IDE’s. 
Any valid JavaScript is valid TypeScript.

### Strongly typed
When you're used to plain JavaScript, you notice that every time you need a variable, it is loosely typed.
TypeScript gives you the opportunity for each of your variables to have its own type.
This comes with great benefits like better refactoring, less bugs and better type checking at compile time.

### OO architecture
TypeScript offers an object-oriented architecture experience, which means all code is defined in classes, interfaces and most of those classes can be instantiated into objects. It also supports encapsulation, which protects the data from unintended access and modification. 


## Learning path of AngularTS
If you’re no stranger to AngularJS you will notice that the structure remains the same. 
Two way data binding, controllers, services, ... 
But be aware that it has a different syntax in TypeScript. 
I will show you the different best practices to implement such components. 


## TypeScript Definition Files
When using TS we will refer to TSD files.
These files describe the types defined in external libraries such as Angular. 
To install the Angular TSD files we use typings.
To use the typings manager we install it with:
{% highlight text %}
npm install typings --global
{% endhighlight %}

Afterwards install Angular with:
{% highlight text %}
typings install angular --ambient --save
{% endhighlight %}
`--ambient --save` enables the flag and persists the selection in 'typings.json'

All the installed TSD files are gathered in the typings folder.
In the main.d.ts file you will see the references the application will use for Angular.
Since Angular has multiple libraries, you can use the search command to find the required definition.
{% highlight text %}
typings search Angular
{% endhighlight %}
It is possible that you have to declare the reference on top of your file.
{% highlight text %}
/// <reference path="../../typings/main.d.ts" />
{% endhighlight %}

## Modules

### Angular Modules
Modules are here to help us modularize our code.
It is a best practice to use one main module as the root of your application. 
Multiple modules are being used for third-party libraries or common code.
To let the module know the existence of every component, they have to register themselves.
Below every component declaration you will see a registration to the module. 
When registering the module you have to add all the libraries you want to depend upon.
In this example we inject the routing service for navigation. 

{% highlight coffeescript %}
module JWorks {
    "use strict";

    angular
       .module("jworks360", ['ngRoute'])
}
{% endhighlight %}

### Internal TypeScript Modules
These modules are similar to namespaces.
You can define an unique namespace around your code.
This will encapsulate variables, interfaces and classes. 
TypeScript supports sub namespaces for further encapsulation.

{% highlight coffeescript %}
module JWorks {
    "use strict";
}
{% endhighlight %}

#### Transpiled JavaScript

{% highlight coffeescript %}
var JWorks;
(function(JWorks){

})(JWorks || (JWorks = {}));
{% endhighlight %}

To encapsulate our code, the module will transpile to an IIFE (Immediately-Invoked Function Expression) around our components.
This will avoid global code which helps prevent variables and function declarations from living longer than expected in the global scope, which also helps avoid variable collisions.


## Entity Class
Now that TypeScript supports object-oriented programming, we can analyse our business problem and define the business objects into entity classes.
When you analyse and define these entities you can define which properties and methods each entity needs.
If you have a couple entities, you can even establish a relationship.
This will provide a clear view on what you want to achieve and have the possibility to create multiple instances of these classes. 
When building an entity class you can optionally define an interface to show what the intention of the class is.

{% highlight coffeescript %}
module JWorks {

    export interface IEmployee {
         username:string;
         name:string;
         eat(food:string):void
    }

    export class Employee implements IEmployee {
 
          constructor(public username:string, public name:string){}

          eat(food:string):void{
             //implementation
          }
    }
}

{% endhighlight %}

To use your entity class in a controller you have to define the export key.
This will expose the class to other classes.
When exporting the interface you will use it as a data type.

### Class as property
{% highlight coffeescript %}
Employee:IEmployee;
{% endhighlight %}

### Instance of the class
{% highlight coffeescript %}
employee = new Employee();
{% endhighlight %}

### Access property
{% highlight coffeescript %}
employee.name
{% endhighlight %}

### Call methods
{% highlight coffeescript %}
employee.eat(eggs);
{% endhighlight %}


## Controllers
As you know the controller defines the model to the view of your application, methods for every action you require and the scope where you hold a two way binding.
Because TS offers an object-oriented architecture, we can use classes and interfaces instead of functions.
Interfaces, like in all object-oriented languages, are a contract that must be implemented by classes that use it.
When implemented, all methods and properties have to be used.
Classes declare and implement the properties and methods exposed to the view.
Every class has his own constructor function, in this function we can declare default property values and other initialisation code. 

### Controller Interface
{% highlight coffeescript %}
module Jworks {

    interface IEmployeeController{
        person:IPerson;
        save(person:IPerson):void;
    }
}
{% endhighlight %}

The interface will show you the intent of our controller and declare the properties and methods that will be used.
When you look at the syntax, you see that the properties are strongly typed and the type is declared after the colon.
If you aren't certain what type a property should have, you can fall back to the general type ‘any’.
When you declare methods in an interface you have to specify the necessary parameters and return types.
The parameters have the same syntax as the properties.

### Controller Class

{% highlight coffeescript %}
module JWorks {

    class EmployeeController implements IEmployeeController{

        static $inject = ["EmployeeService"];

        constructor(private employeeService:IEmployeeService,public employee:IEmployee){
             this.employee = new Employee("Nivek","Kevin");
        }

        save():void{
             this.employeeService.addEmployee(this.employee).then(function(result){
             console.log("added successfully!");
        });
   }

}
angular.module("jworks360")
.controller("EmployeeController", EmployeeController);
{% endhighlight %}

### Dependency Injection in classes
When a service is needed in your controller, it must to be injected before it can be used.
In the above example it is important that you declare the `static $injection` on top of your constructor.
By doing this the constructor will recognize and initialise the injected services.
If you inject a custom service you have to reference to the related service.

{% highlight text %}
/// <reference path="../services/employee.service.ts"/>
{% endhighlight %}


### Constructor
TypeScript supports initialisation of your properties and injections in a constructor.
When declaring properties in your class, you can declare them directly into your constructor.
Although *these two examples are* correct you can have issues in your tests with the second example.

{% highlight coffeescript %}
So this:
class Controller {

    name:string;

    constructor(public name:string){
        this.name=name;

    }

}
Becomes:
class Controller {

    constructor(public name:string){
    }
}


{% endhighlight %}
Be sure to notice that we are using access modifiers to tell the controller which properties we want to expose to the view.
The best practice is that you put your injections and Angular services private and all your properties you want to use on your view public.
When initialising strings, TypeScript makes no distinction between double or single quotes.

### ControllerAs

Controller classes use the controllerAs feature by default.
So it’s important to declare this into your routes and views.
In your HTML you will have to prefix your methods and properties with the ControllerAs syntax.


{% highlight coffeescript %}
module JWorks {
   "use strict";

   function routes($routeProvider) {

       $routeProvider
           .when('/', {
               redirectTo: '/login'
           })
           .when('/profile', {
               templateUrl: 'app/persons/profile.html',
               controller: 'EmployeeController',
               controllerAs: '$profile',
           })
           .otherwise({
               redirectTo: '/'
           });
   }
   routes.$inject = ["$routeProvider"];

   angular.module("jworks360")
       .config(routes);
}
{% endhighlight %}

## Services
When you make a custom service, the code you implement is reusable and can be called in any other Angular component, including controllers and other services.
It is important to know that services are singletons, so there will be only one instance for each service.
With this in mind we can use the custom service to share data across all components in Angular.
Communicating with an HTTP service to collect and share data with any other component by injecting the service.

### Restangular
For my project I used an Angular service that simplifies common verb requests with a minimum of client code.
In my custom services you'll see examples of Restangular in TypeScript.
If you like to checkout what the difference is with $resource, you can check this [list](https://github.com/mgonto/restAngular#differences-with-resource)

{% highlight coffeescript %}
module JWorks {

   export interface IEmployeeService {
       username:string;
       employee:IEmployee;

       getEmployee(): Employee;
       setEmployee(employee:IEmployee);
       getEmployeeByUsername(username:string):ng.IPromise<{}>;
       getEmployeeByLink(href:string):ng.IPromise<{}>;
   }

   export class EmployeeService implements IEmployeeService {

       static $inject = ["EmployeeRestangular", "$location"];

       constructor(private employeeRestService:restAngular.IService, private $location:ng.ILocationService, private employees:restAngular.IElement,public employee:IEmployee,public username:string) {
            username =window.sessionStorage.getItem("username");
            this.employees = employeeRestService.all("employees");
            employees.one(username).get().then((data:any)=> {
                   this.setEmployee(data);
               });
           }
       }
       getEmployee():Employee {
           return this.employee;
       }
       
       setEmployee(employee:IEmployee) {
           this.employee = employee;
       }
             
       getEmployeeByUsername(username:string):ng.IPromise<{}> 
           return this.employees.one(username).get()
       }

       getEmployeeByLink(href:string):ng.IPromise<{}>{
           return this.employees.oneUrl(href).get();
       }       
   }
          angular.module("jworks360")
              .service("EmployeeService", EmployeeService);       
}
{% endhighlight %}

In the above example, to use the Restangular service you have to install the proper typings.
For services it is a best practice to declare an interface for data typing and getting a clear view of the intent.
The service class will implement all methods related to the data communication with the backend and returns a promise to the controllers or services that will inject this custom service.
Restangular has its own configuration you can modify in the .config component to point to the right api call.
After the config you can inject the Restangular service and use its services to build up a request to the backend.


## Directives
Custom directives allow you to create highly semantic and reusable components.
A directive allows Angular to manipulate the DOM and add its own behaviour. 
These can either be a set of instructions or a JSON representation.
To define a directive in TypeScript we use the directive service **that Angular** provides.

{% highlight coffeescript %}
module JWorks {

   export interface IAnimate extends ng.IAttributes {
       jwAnimate:string;
   }

   class Animate implements ng.IDirective {

       restrict = "A";

       static instance():ng.IDirective {
           return new Animate();
       }

       link($scope, elm:ng.IRootElementService, attr:IAnimate,ngModel:ng.INgModelController):void {

           $scope.right = function(){
               $(this).animate({
                   left: '+=150'
               });
                elm.fadeOut("slow");
           };
           var direction = attr['jwAnimate'];
           elm.on('click',$scope[direction]);

       }

   }
   angular.module("jworks360").directive("jwAnimate", Animate.instance);

}
{% endhighlight %}

In the interface above we have to tell Angular what name will be used for our directive.
The attribute service will be called to add the name to its attributes.
Secondly the class has to implement the directive interface to be recognized by the compiler as a directive.
Inside the class you have to declare the prefixed properties and override the methods you will be using.
The `static instance()` method has to be declared to let your module know that there is a new directive.
At the end you register the directive to your module with the instance as value.



## Final note

Best practices can change over time. 
With webpack for example the registry to the module is contained in one file.
TypeScript keeps on growing, and in my opinion **will be the default language for many future front-end projects.**
When it comes to testing our code, TypeScript will provide better support because of encapsulation. 
Finally, this is a nice learning path to take if you want to migrate to Angular 2.
