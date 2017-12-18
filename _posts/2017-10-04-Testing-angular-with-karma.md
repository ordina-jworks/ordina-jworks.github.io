---
layout: post
authors: [martijn_willekens]
title: "Testing Angular with Karma 101"
image: /img/2017-10-02-testing-angular-with-karma/unit-tests.png
tags: [Angular,Karma,Unit testing,Jasmine,TypeScript]
category: Angular
comments: true
---
Testing your code is as important as writing the code itself. 
This also counts for frontend applications such as Angular apps. 
Unit testing is one way to do so. 
The goal of these kind of tests is to isolate classes and verify the output of its functions to be what you expect when they are called.
We also need a tool to run our tests written in TypeScript.
[Karma](https://karma-runner.github.io/){:target="_blank"} is the one we'll be using to run tests described in this blog.
It will open a browser, execute pieces of JavaScript and report the results back to you.

Now, I must admit that I’m not too fond of writing tests myself. 
However, I do strongly believe they help a lot towards improving the quality of the code. 
Writing unit tests can be quite a hassle, but with an application that is continuously growing and changing, they are an efficient way to prevent bugs getting to production.

# Table of contents
1. [Setup](#setup)
2. [Writing tests](#writing-tests)
3. [What to test](#what-to-test)
4. [Tips and tricks](#tips--tricks)
5. [Conclusion](#conclusion)

# Setup
Let’s take a look at how it’s done in an Angular app using Karma.
If you're using the Angular CLI, you’re in luck because setting up the unit tests is easy. 
It’s already done! 
All you need to do is run `ng test` (or `npm test`). 
It will transpile your tests and run them using Karma. 
If you're not using the Angular CLI yet, I recommend creating a new project with the CLI and copying your existing project to it.
It will make your life a lot easier.

Running `ng test` will run the tests in watch mode, meaning that every time you save a change to a file, it will automatically rerun your tests. 
Additional flags can be passed like `--single-run` to make it run only once. 
When passing the `--code-coverage` flag, it generates a report in HTML. 
By default it's found under `coverage/index.html` and it indicates which parts of your code were covered by your unit tests.

<div class="row">
    <img class="image fit" style="max-width: 785px" alt="Code coverage" src="/img/2017-10-02-testing-angular-with-karma/code-coverage.png">
</div>

# Writing tests
## Structure
Now that the setup is done, let’s look at how to write the tests themselves.
First of all, test files should be named after the `.ts` file you're testing, but with `.spec` added to the file name (e.g. when testing `login.component.ts`, the test file should be named `login.component.spec.ts`). 
It's best practice to keep the spec file in the same folder as the ts file. So mostly, for a component, you’ll end up with a HTML, scss, spec.ts and ts file in one folder (unless you like to inline your HTML and CSS).

<p>
    <img class="image" alt="Folder structure" src="/img/2017-10-02-testing-angular-with-karma/files.png" />
</p>

Next up, the content of a test file. 
The Jasmine spec is used to format the tests ([more info](https://jasmine.github.io/pages/getting_started.html){:target="_blank"}).
This means that individual tests are grouped together in a `describe` block. 
A test itself starts with `it`. 
Besides tests, you can also add other blocks to a `describe`, like `beforeEach`, `beforeAll`, `afterEach`, `afterAll`... 
What these blocks do, is quite self-explanatory. 
Here's an example how it could be used: when testing a class, you’ll want to create an instance of that class for each test, so instead of writing the same code in each test to create an instance, you could put that code in the `beforeEach` clause. 
Simply pass a function (in lambda notation) to `beforeEach` containing the code you want it to run. 

Within a test itself, the class' public functions can be called and assertions can be made. 
Assertions are made using the `expect` function. You can give it a variable or a call to a function and tell it what you expect the result to be with `toBe`, `toEqual`, `toBeTruthy`, `toBeFalsy`, `toBeNull`...

Here's an example: 

{% highlight typescript %}
describe('NAME_OF_YOUR_CLASS', () => {
    let component;

    beforeEach(() => {
        //initialize
        component = new AppComponent();
    });
    
    //Actual tests
    it('should have a car selected', () => {
        //assertions
        expect(component.carSelected).toBeThruthy();
    });

    it('should find my favorite car brand', () => {
        //assertions
        const carBrand = component.getFavoriteCarBrand();
        expect(carBrand.name).toEqual('Mazda');
    }); 
}); 
{% endhighlight %}  

As you can see, you can pass some text as an argument in the `describe` call. 
This is usually the name of the class you're testing and it'll be shown when running the tests. 
For the tests themselves, you can also pass some text which will be shown. 
These are mainly used for you to be able to identify failing tests. 
The text should describe what's being tested, for example "It should get the brand of the car", could be written as `it('should get the brand of the car', () => ...`.

## Writing the actual tests
There are multiple ways to write unit tests for an Angular app. 
Either you use the Angular TestBed, the ReflectiveInjector or you simply call the constructor of the class directly. 
ReflectiveInjector and TestBed have a similar approach, so I'll only be discussing TestBed here.
It's something pretty cool Angular came up with in order to test your components. 
TestBed can create components and injects all its dependencies.
The instance of the component that is returned can then be used for testing.
Accessing the view is also possible.

Now, although I said there are multiple ways to unit test an Angular app, there's actually only one correct way: calling the constructor.
Since TestBed loads the view as well as any components, directives... used in the view, you're actually also testing how the class integrates with them.
In other words, you're entering the domain of integration testing, which is also important, but out of scope for this blog post.

The unit tests you would write using the constructor approach, could practically look the same when you would use TestBed to instatiate the components. 
However, there are some problems with using the Angular TestBed for unit tests which I'll be explaining below.

## 1. TestBed
Setting up the TestBed configuration for a component kind of looks like a module definition. 
You should list all components, directives and services that are used by the component you're testing directly or by importing a module that includes them. 
Calling `createComponent` will return a 'fixture' which can be used to access the view and also get the instance of the class linked to it. 
With the fixture you can find HTML elements and perform actions on them, verify their content and attributes...
The instance of the class can be used to test its public functions (unit test).

{% highlight typescript %}
describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            providers: [CarBrandService],
            imports: [CommonLogicModule]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test the class', () => {
        //use component to test the class itself
        const carBrand = component.getFavoriteCarBrand();
        expect(carBrand.name).toEqual('Mazda');
    });

    it('should test the view', () => {
        //use component to test the class itself
        const carBrand = component.getFavoriteCarBrand();
        expect(carBrand.name).toEqual('Mazda');

        //use fixture to access the HTML (e.g. get h1 element)
        const de = fixture.debugElement.query(By.css('h1'));
        const el = de.nativeElement;
        expect(el.textContent).toContain('Mazda');
    });
});
{% endhighlight %}  


### Mocking
In unit testing, we are only interested in testing the class itself and try to isolate it as much as possible. 
We also want to be able to easily control the output of all dependencies of our class, such as services. 

#### spyOn
One way to do so is by creating spies for all calls to functions of those dependencies. 
That's where the `spyOn` function comes into play:

{% highlight typescript %}
describe('AppComponent', () => {
    let component: RequestPopupContainer;
    let fixture: ComponentFixture<AppComponent>;        

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            providers: [CarBrandService],
            imports: [CommonLogicModule]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;

        const carBrandService = fixture.debugElement.injector.get(CarBrandService);
        spyOn(carBrandService, 'findAll').and.returnValue(Observable.of([
            { name: 'Mazda', country: 'Japan' },
            { name: 'BMW', country: 'Germany' }
        ]));    

        fixture.detectChanges();
    });
    ...
});
{% endhighlight %}  

In the example above, you can see when the `AppComponent` would call `carBrandService.findAll()`, instead of making a HTTP call, an Observable is returned with a list of car brands which is defined in the test itself. 
This is pretty cool, but also very error prone. 
If you forget to place a spy on a certain function, it will perform the actual call, possibly a HTTP call.
That's something we do not want at all.

#### Mock classes
To prevent forgetting to spy on a certain function, you could create mock classes and inject them instead of the actual classes:

{% highlight typescript %}
class MockCarBrandService {
    findAll(): Observable<CarBrand[]> {
        return Observable.of([
            { name: 'Mazda', country: 'Japan' },
            { name: 'BMW', country: 'Germany' }
        ]);     
    }   
}

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;        

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            providers: [{provide: CarBrandService, useClass: MockCarBrandService}],
            imports: [CommonLogicModule]
        })
        .compileComponents();
    }));

    ...
});
{% endhighlight %}

Again we see that `findAll()` will return an Observable containing a list. 
By using this approach, you'll get an error when you forgot to define a function in the mock class. 
This may solve our previous problem, but now we have created another one. 
Karma allows us to assert whether a function was called using `toHaveBeenCalled` and `toHaveBeenCalledWith`. 
The problem here is that we don't have any spies, so those functions can't be used.
We can again add spies like in the first approach, but you can imagine that this is a lot of work and will get quite messy.

#### Jasmine spy objects
So, the first two approaches have some issues. Luckily there's a better way, Jasmine spy objects:
    
{% highlight typescript %}
describe('AppComponent', () => {        
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>; 

    const mockCarBrandService = jasmine.createSpyObj('carBrandService', ['findAll']);
    mockCarBrandService.findAll.and.returnValue(Observable.of([
        { name: 'Mazda', country: 'Japan' },
        { name: 'BMW', country: 'Germany' }
    ]);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            providers: [{provide: CarBrandService, useValue: mockCarBrandService}],
            imports: [CommonLogicModule]
        })
        .compileComponents();
    }));
    ...
});
{% endhighlight %}  

The first argument of `jasmine.createSpyObj` is the name for the object and will be used to mention it in the console.
This is usually the name you gave the instance of the corresponding class in the constructor. 
The second argument is an array containing all function names of that corresponding class that are called from the class being tested. 
In other words, not all functions offered by the class that's being mocked have be listed, only the ones actually being used.
>Also note that in the providers list, we have to use `useValue` instead of `useClass` since `jasmine.createSpyObj` already returns an instance.

Using `spyOn` isn't needed, a spy object is already being spied upon (hence the name) and you can call the `toHaveBeenCalled` and `toHaveBeenCalledWith` functions on it.

{% highlight typescript %}
...
it('should call the findAll method' () => {
    component.getFavoriteCarBrand();
    expect(mockCarBrandService.findAll).toHaveBeenCalled();
}); 
...
{% endhighlight %}  

I think it's obvious to say that using Jasmine spy objects is the way to go. 
If you forget to define a function, you'll get an error when it's called. 
The functions that are defined, are also spied upon. 
So all the problems with the first and second approach are solved. 
There's even another benefit when using spy objects. 
The implementation (`returnValue` or `callFake`) can be changed at any time, even in the middle of a test!

### Issues with unit testing
A side effect of using TestBed is that when the component is loaded, the `ngOnInit`, `ngAfterViewInit`... lifecycle events are called automatically.
This means you have less control over them. 

Getting all the imports, providers and declarations setup can be quite a struggle too. 
If there's any subcomponent in the HTML of the component you're testing, they should either be imported through a module or added in the declarations of the TestBed configuration.
If you don't feel like doing all that, you can also tell Angular to skip elements it doesn't recognise by adding `NO_ERRORS_SCHEMA` to the TestBed configuration:

{% highlight typescript %}
TestBed.configureTestingModule({
    declarations: [ AppComponent ],
    schemas: [ NO_ERRORS_SCHEMA ]
})
{% endhighlight %}  

It's very likely that you'll be using the Angular router in some of your components, so you'll have to account for that too. 
You could mock the router dependency using a Jasmine spy object or you can add `RouterTestingModule` as an import instead of the `RouterModule` itself. 
The routes that are relevant can then be defined in the `RouterTestingModule`:
    
{% highlight typescript %}
imports: [RouterTestingModule.withRoutes([/*List mock routes here*/])]
{% endhighlight %}  

>To learn more about writing tests using Angular TestBed, I recommend reading this guide: [https://angular.io/guide/testing](https://angular.io/guide/testing){:target="_blank"}.

## 2. Calling the constructor

A much better way to do unit testing is to simply call the constructor of the class you want to test.
You should get an instance of each dependency that's needed in the component's constructor.
Of course we want to mock these classes and as we saw in the Angular TestBed section, the Jasmine spy objects are the way to go.

{% highlight typescript %}
describe('AppComponent', () => {        
    let component: AppComponent;

    const mockCarBrandService = jasmine.createSpyObj('carBrandService', ['findAll']);
    mockCarBrandService.findAll.and.returnValue(Observable.of([
        { name: 'Mazda', country: 'Japan' },
        { name: 'BMW', country: 'Germany' }
    ]);

    beforeEach(() => {
        component = new AppComponent(mockCarBrandService);
    });
    ...
});
{% endhighlight %}  

Without the TestBed, you don’t have access to the view. 
However, your tests will run much faster as there are less things to load. 
When using TestBed, you’ll probably be including lots of dependencies just to make it work, giving you less control. 
This is something you do not want in unit testing as you want to isolate the class as much as possible. 
Another difference with TestBed is that you have to call the lifecycle events yourself, again giving you more control over the code you’re testing.

{% highlight typescript %}
it('should find the car brand', () => {
    component.ngOnInit();
    const carBrand = component.getFavoriteCarBrand();
    expect(carBrand.name).toEqual('Mazda');
}); 
{% endhighlight %}

# Async, fakeAsync, tick
Angular is full of Observables and writing tests for them is a little trickier. 
You might also be using the `setTimeout` and `setInterval` functions. 
To cope with all that, Angular provides the `async` and `fakeAsync` functions. 
You can simply wrap your test in an `async` and it should only finish after all async calls are finished. 
If you want to have more control, you can wrap the test in a `fakeAsync` instead. 
Then the `tick()` function can be called to advance time with one tick. 
By passing an argument to it, time can be advanced by more ticks at once: `tick(500)`.

Suppose we have this class:
    
{% highlight typescript %}
export class TimeoutExample {
    counter = 0;

    updateCounterWithDelay() {
        setTimeout(() => {
            this.counter++;
        }, 100);
    }
}
{% endhighlight %}
    
And this test:

{% highlight typescript %}  
it('should increase the counter with a delay', fakeAsync(() => {
    const component = new TimeoutExample();
    expect(component.counter).toBe(0);
    component.updateCounterWithDelay();
    tick();
    expect(component.counter).toBe(0);
    tick(10);
    expect(component.counter).toBe(0);
    tick(90);
    expect(component.counter).toBe(1);
}));
{% endhighlight %}  

It clearly shows how the `tick` function manipulates the advancement of time, although it isn't really a useful test, 

### Observables

Now, what if you want to test a function that returns an Observable? 
Well, simply subscribe to it in an async block and check the result!

{% highlight typescript %}
it('should return a list of cars' async(() => {
    service.findAll().take(1).subscribe(
        (result) => {
            expect(result.length).toBe(9);
        },
        (error) => {
            expect(true).toBeFalsy();
        }
    );
}));
{% endhighlight %}  

The error clause may seem strange. 
However, what if the `findAll()` call returns an error and you don't have the error clause in your test? 
You'll simply think that your test has passed because it appears green in the console. 
With code coverage enabled, you may notice that the part of the code you were testing isn't marked as covered. 
By adding `expect(true).toBeFalsy();` to the error clause, your test will fail because it shouldn't get there!

# What to test
Now that we know a little on how to test, let's have a look at what to test. 

For starters, you don't have access to private and protected variables/functions, so all you can do is test the public ones. 
All variables that are accessed by the view should be public, so those are the ones you can use for your tests. 
The constructor and all lifecycle events can be called as well as they are public. 
You should never ever set a variable or function to public in order to test it. 
If you can't test it because it's private, you're doing something wrong. 
You should be able to get to it through other functions.

Generally, you give an input and assert the output, it's as simple as that. 
Your different inputs should also make sure that all branches are tested (e.g. an `if` gives you two branches, one where the `if` resolves to `true` and one to `false`).
Unit tests in Karma also allow you to assert whether a function has been called and optionally with which parameters (`toHaveBeenCalled` and `toHaveBeenCalledWith`). 
This can be useful when for example testing a `void` function that calls a mocked function. 
That way you can still assert the output. 
So, think of possible scenarios for the functions to test, provide the input and assert the output using `expect`. 
Also try to cover other paths than just the happy paths!

Testing getters and setters usually isn't needed, unless they are more complex. 
In most cases they're not and it's quite pointless to call a setter and then assert whether it has been set correclty. 
Most of the time, these will be called indirectly when testing other functions.

The code coverage report can help you find functions that aren't fully tested yet. 
However, your goal shouldn't be to get a 100% coverage. 
Getting a 100% isn't that hard, simply calling all functions with some different inputs will get you there.
It won't mean that your code is fully tested.
To give you an example, suppose you have a function that sorts a list.
You write some tests with different inputs so all branches are covered and you get a 100% coverage.
The ordering of the list could still be completely wrong and not what you expect, although it's fully covered.
By using `expect` to verify that the output is correct, you'll be doing a way better job.
Even then there may be scenarios that aren't tested despite the coverage report stating that part of the code is covered.
So try to think of the various possible scenarios (both success and error scenarios) and translate those to tests.

# Tips & tricks
## Only run certain tests
When your test base begins to grow, you don't always want to wait for all tests to have run when only testing a certain class or function. 
Therefore, you can choose to only run specific `describe` blocks or tests (`it`) by adding an `f` (which stands for focus) in front of them, such as `fdescribe` and `fit`. 
To exclude certain `describe` blocks or tests, you can prefix them with an `x` (exclude), like `xdescribe` and `xit`. 
This will certainly come of use.

## Nesting describe blocks
Describe blocks can also be nested. 
If you want for example different `beforeEach` blocks for your tests when testing a class, you can create a nested `describe` block for each case.

{% highlight typescript %}
describe('AppComponent', () => {
    let mockCarBrandService = jasmine.createSpyObj('carBrandService', ['findAll']);

    describe('Happy path', () => {
        beforeEach(() => {
            mockCarBrandService.findAll.and.returnValue(Observable.of([
                { name: 'Mazda', country: 'Japan' },
                { name: 'BMW', country: 'Germany' }
            ]));
        });

        it(...);
        ...
    });
    
    describe('Error path', () => {
        mockCarBrandService.findAll.and.returnValue(Observable.throw('Error'));

        it(...);
        ...
    });
});
{% endhighlight %}  

## Using the injector
Dependency injection is used all over Angular meaning that it isn't possible to simply call `new` for certain classes. 
Normally, you simply put the dependencies in the constructor of your class and Angular takes care of the rest (e.g. `constructor(private formBuilder: FormBuilder)`).
When calling the constructor of a class in a test, you don't always want to mock those dependencies, so you'll need to get instances of them somehow. 
For example when using Angular's `FormBuilder` or when you need it to create a `FormGroup` to use in your test. 
In that case, you can use Angular's ReflectiveInjector which takes care of getting an instance for you.
Here's an example how:

{% highlight typescript %}
const injector = ReflectiveInjector.resolveAndCreate([FormBuilder]);
const formBuilder = injector.get(FormBuilder);
{% endhighlight %}  
    
As you can see, you can simply pass the class name and it will return an instance of that class. 
That instance can then be passed in the constuctor of the class you're testing.

# Conclusion
When writing unit tests, it's better to call the constructors direcly and not to use Angular TestBed. 
It will give you more freedom and more control, run the tests much faster and allow you to completely isolate classes. 
You should also write integration tests and TestBed will serve that purpose very well.
To mock classes, Jasmine spy objects are simply the way to go.
Changing their implementation or return value is easy and can be done at any time!
Code coverage reports can be very useful to find parts of uncovered code. 
However, getting a high percentage of code coverage shouldn't be your goal. 
Write useful tests and also, don't limit your tests to the happy path!