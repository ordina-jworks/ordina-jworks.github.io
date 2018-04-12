---
layout: post
authors: [yannick_vergeylen]
title: 'Protractor testing in Ionic app'
image: /img/ionic-protractor.png
tags: [ionic, protractor, pageobject, functional modules]
category: Ionic
comments: true
---

### Using Protractor in an ionic app

Since a few days I've been playing around with [Protractor](https://angular.github.io/protractor/#/)
and I am also involved on an internal project in which an Ionic app has to be created.
So I thought:

> Why not use Protractor in my Ionic app?

So here we are.

It's not hard to get started and I will explain how I got it working.
For the full example please refer to [the ionic documentation](http://learn.ionicframework.com/formulas/Protractor)

## 1. Getting started

First of all you need [Node.js](https://nodejs.org/).

When Node.js is installed you should install Ionic and Cordova using npm (Node Package Manager):

{% highlight bash %}npm install -g cordova ionic{% endhighlight %}

I personally needed an app with tabs, but you can also start a blank app or an app with a side menu:

{% highlight bash %}ionic start <your app name> tabs{% endhighlight %}
_You can also choose `blank` or `sidemenu` instead of `tabs`_

## 2. Running the app in the browser

Once the Ionic app has been generated, you can run t it in the browser using the following command:

{% highlight bash %}
cd <your app name>
ionic serve
{% endhighlight %}

> It's worth noting that Ionic has live reload built in **by default**.
> So any changes will be immediately
reflected in the browser.

To view the application using the iOS and Android styling applied you can use the following command:

{% highlight bash %} ionic serve -lab {% endhighlight %}

There are many more awesome things you can do with the Ionic CLI.
If you want to know more about the CLI you can find it in [the Ionic documentation](http://ionicframework.com/docs/cli/).

## 3. Structuring the application
At this moment you are set up with an Ionic starter app.
The first thing I did was refactor the code from technical to functional modules.

<div class="row">
    <div class="4u">
        <img class="image fit" src="{{ '/img/2016-04-07-ionic-protractor/technical.jpg' | prepend: site.baseurl }}" alt="Technical modules" />
    </div>
    <div class="1u align-center">--></div>
    <div class="4u$">
        <img class="image fit" src="{{ '/img/2016-04-07-ionic-protractor/functional.jpg' | prepend: site.baseurl }}" alt="Functional modules" />
    </div>
</div>


> I strongly advise to use functional modules, it's easier to work with.

Related code should be in one folder and when testing you can use the same structure to test each module separately while coding.

> You'll find yourself navigating less trough your open tabs or a tree-view.  

Additionally, it makes your code more comprehensible to other developers.
[The style guide from John Papa](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md)
 on how to structure AngularJS applications is a very good resource.

## 4. Sign-in page
_The one we'll be testing_

After refactoring, I implemented a sign-in page, which has no access to the tabs.
The code can be seen below.
If you work in functional modules like I do, it is as easy as referring to the controller and the service from index.html, then pass `starter.sign-in` as a module to your application.

`sign-in/sign-in-controller.js`:

{% highlight javascript %}
(function () {
    angular
        .module('starter.sign-in',[])
        .controller('SignInCtrl',SignInCtrl);

    SignInCtrl.$inject = ['$scope','$state','SignInService'];

    function SignInCtrl ($scope,$state,SignInService) {
        $scope.user = {};
        $scope.signIn = function() {
            SignInService.signIn($scope.user)
                .then(function(data){
                    if(data){
                        $state.go('tab.rooms');
                    }else{
                        $scope.incorrect = true;
                    }
                })
        };
    }
})();
{% endhighlight %}

`sign-in/signin.html`:

{% highlight html %}
<ion-view view-title="Sign in">
    <ion-content>
        <form name="frmLogin" novalidate ng-cloak>
            <ion-list>
                <ion-item class="item item-input item-floating-label">
                    <label>
                        <span class="input-label">Username</span>
                        <input type="email" ng-model="user.username" ng-required="true" placeholder="Username" id="username" name="username">
                    </label>
                    <div class="assertive" ng-if="frmLogin.$submitted || frmLogin.username.$touched">
                        <div ng-if="frmLogin.username.$error.required">Username is required</div>
                        <div ng-if="frmLogin.username.$error.email">Username is not valid</div>
                    </div>
                </ion-item>
                <ion-item class="item item-input item-floating-label">
                    <label>
                        <span class="input-label">Password</span>
                        <input type="password" ng-model="user.password" ng-minlength="4" ng-required="true" placeholder="Password" id="password" name="password">
                    </label>
                    <div class="assertive" ng-if="frmLogin.$submitted || frmLogin.password.$touched">
                        <div ng-show="frmLogin.password.$error.required">Password is required</div>
                    </div>
                </ion-item>
                <div class="padding">
                    <div class="assertive" ng-if="incorrect">
                        <div>Username or password is incorrect.</div>
                    </div>
                    <button id="btnSignIn" ng-disabled="frmLogin.$invalid" class="button button-full button-positive" ng-click="signIn()">
                        Sign in
                    </button>
                </div>
            </ion-list>
        </form>
    </ion-content>
</ion-view>
{% endhighlight %}

`sign-in/sign-in.service.js`:

{% highlight javascript %}
(function() {
    angular
        .module('starter.sign-in')
        .factory('SignInService', SignInService);

    SignInService.$inject = ['$timeout'];

    function SignInService ($timeout) {
        var _user = {
            email: 'yannick@gmail.com',
            pass: '1234'
        };

        function signIn (user) {
            return $timeout(function() {
                return true;
                //return !!(user.username === _user.email && user.password == _user.pass);
            },2000);
        }

        return {
            signIn : signIn
        };
    }
})();
{% endhighlight %}

Next you need to provide a state, so add the following in `app.js`:

{% highlight javascript %}
state('signin',{
    url:'/signin',
    templateUrl: 'sign-in/sign-in.html',
    controller: 'SignCtrl'
)}
{% endhighlight %}

and change redirect to `/signin` by default:

{% highlight javascript %}
$urlRouterProvider.otherwise('/signin');
{% endhighlight %}

_For complete authentication you should check the authenticated state when changing pages,
but that's not in the scope of this blog_

## 5. Preparing protractor

The sign-in part is the one I am going to test with Protractor.
First thing to do, is to install Protractor on your system:

{% highlight bash %}
npm install -g protractor
{% endhighlight %}

The `webdriver manager` is a helper tool to easily get a Selenium server running.
Run the following commands in order to start it:

{% highlight bash %}
webdriver-manager update
webdriver-manager start
{% endhighlight %}

To keep your code clean, you could put tests in a dedicated folder, but many argue against it.

> Since I work in functional modules, tests of these modules should live in the module itself.

Next I created a Protractor configuration file in the root of my project called `protractor.config.js`:

{% highlight bash %}
touch protractor.config.js
{% endhighlight %}

`protractor.config.js`:

{% highlight javascript %}
exports.config = {
    capabilities: {
        'browserName': 'chrome'
    },
    specs: [
        'www/sign-in/sign-in.spec.js',
    ],
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        isVerbose: true
    },
    allScriptsTimeout: 20000,
    onPrepare: function(){
        browser.driver.get('http://localhost:8100');
    }
};
{% endhighlight %}

> Don't forget to set the correct URL to your running app.
> If not, you'll see many errors, except that you might be referring to a wrong URL

## 6. Preparing the tests

As you can see, there is already a spec file defined in the protractor config file, so let's create it:

{% highlight bash %}
cd www/sign-in/
touch sign-in.spec.js
{% endhighlight %}

In the newly created file, you can start writing your tests.
If everything went well, you can simply add another test and it should validate to true.
It only tests if the first page you see, is the login page:

{% highlight javascript %}
describe('Signing in', function(){
    it('should start on sign-in view', function(){
        expect(browser.getTitle()).toEqual('Sign in');
    });
});
{% endhighlight %}

Basically, we define a `describe` function which will describe the whole scope of our specs.
Every 'it' function is called a spec.
We only created one for now.
As you can see this is a very readable way of testing.
We expect the browsers title to be equal to 'Sign in'.
If the `expect` statement evaluates to `true`, the spec has passed without failures, otherwise it will have a failure.

> Feel free to change `Sign in` to something else to fail the test.

To run the tests, we can execute the following command in the folder of our `protractor.config.js` file:

{% highlight bash %}
protractor protractor.config.js
{% endhighlight %}

Running this command will read the config file and run all the spec-files defined.
You will get some output in the command line.
At the end you'll get a summary like **1 specs, 0 failures Finished in x.xxx seconds**.

This is a simple test but it doesn't show the full potential of Protractor at all.
Lets add a new spec as part of the describe.

{% highlight javascript %}
it('should be unable to click Sign-in button when fields are empty', function(){
    var button = element(by.id('btnSignIn'));
    expect(button.getAttribute('disabled')).toEqual('true');
});
{% endhighlight %}

So here we test the availability of the sign-in button when the fields are empty.
Next is to test if the button becomes available if the fields are filled in with valid data.
So lets add another test:

{% highlight javascript %}
it('should be possible to click Sign-in button when fields are filled in', function(){
    var button = element(by.id('btnSignIn'));
    var txtUsername = element(by.id('username'));
    var txtPassword = element(by.id('password'));
    txtUsername.sendKeys('yannick@gmail.com');
    txtPassword.sendKeys('1234');
    expect(button.getAttribute('disabled')).toBe(null);
});
{% endhighlight %}

All these tests should pass correctly in protractor.

## 7. Page Object Pattern

You might have noticed that your tests run synchronous after each other.
In this scenario this might be useful, but sometimes you need to start with a 'clean page' which would mean you need to duplicate a lot of code (for finding the button and text-fields).

> When you are working in an agile team, it is quite common that requirements or user stories change.
> This can implicate you'll have to change a lot of duplicated code.
> How can we work around that.

The solution is called the **page object pattern**.
The general idea is to put your page in a JavaScript object.
Lets dive into `sign-in.page.js`.
This file should also be put into the module folder:

{% highlight javascript %}
var SignInPage = function () {
    browser.get('http://localhost:8100/signin');
};

SignInPage.prototype = Object.create({}, {
    txtUsername: { get: function () { return element(by.id('username')); }},
    txtPassword: { get: function () { return element(by.id('password')); }},
    btnSignIn: { get: function () { return element(by.id('btnSignIn')); }},
    typeUsername: {value: function (keys) { return this.txtUsername.sendKeys(keys); }},
    typePassword: {value: function (keys) { return this.txtPassword.sendKeys(keys); }},
    clickSignIn: {value: function (keys) { return this.btnSignIn.click(); }}
});
module.exports = SignInPage;
{% endhighlight %}

In the constructor we make sure our browser opens the signin page by passing the correct URL.
Then we use the `prototype` method to link our HTML elements with the object.
Finally, it is wise to create helper methods for basic functionality, such as filling in a username, in case you ever would want to change that behaviour.
Then you only need to change that line and all your tests will still pass.

> Using logical method names keeps your tests readable which is what you'll want when you look back in a few months.

We can now change our `sign-in.spec.js` to this:

{% highlight javascript %}
var SignInPage = require('./sign-in.page.js');
describe('Signing in', function(){
    var page;
    beforeEach(function () {
        page = new SignInPage();
    });
    it('should be unable to click Sign-in button when fields are empty', function(){
        expect(page.txtUsername.getText()).toEqual('');
        expect(page.txtPassword.getText()).toEqual('');
        expect(page.btnSignIn.getAttribute('disabled')).toEqual('true');
    });
    it('should be possible to click Sign-in button when fields are filled in', function(){
        page.typeUsername('yannick@gmail.com');
        page.typePassword('1234');
        expect(page.btnSignIn.getAttribute('disabled')).toBe(null);
        page.clickSignIn();
        expect(browser.getTitle()).toEqual('Rooms');
    });
});
{% endhighlight %}

What changed?
We created a page variable and before each `it` we assigned a new SignInPage object to the page variable.
This way, your page gets loaded again before running every spec.
This means it always returns in the same state.
Now you can create your specs as user stories.

## 8. Conclusion

Protractor is an awesome way to test your app's functionality.
Using a descriptive syntax you can emulate almost every user action and run trough the whole app in no time, again and again.
Using Protractor, you won't have to spend a lot of time testing your application manually,
and you can focus on feature development without having to worry about accidentally breaking some functionality.
Protractor will ensure that your user gets a working app without frustrations!
