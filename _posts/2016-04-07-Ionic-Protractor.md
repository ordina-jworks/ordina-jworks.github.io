---
layout: post
author: yannick_vergeylen
title: 'Protractor testing in Ionic app'
image: /img/ionic-protractor.png
tags: [ionic, protractor, pageobject, functional modules]
category: Ionic
comments: true
---

### Using Protractor in an ionic app

Since a few days I've been playing around with protractor and I am also involved on an internal
project in which an Ionic app has to be created. So I thought: 'why not combine them?'.
So here we are: Protractor in an Ionic app.

It's not hard to get started and I will explain here how I got something working. For the full
example please refer to [the ionic documentation](http://learn.ionicframework.com/formulas/Protractor)

## 1. Getting started

First of all you need node.js. Once node.js is on your machine you should install Ionic and
Cordova using npm (node package manager)

{% highlight text %}npm install -g cordova ionic{% endhighlight %}

I personally needed an app with tabs, but there is also the possibility to start a blank app or an
app with sidemenu.

{% highlight text %}ionic start <your app name> tabs{% endhighlight %}
_here you can also choose 'blank' or 'sidemenu' instead of 'tabs'_

## 2. running the app in the browser

After the app has been generated you can run the Ionic app in the browser using the following command.
It's worth noting that Ionic has live reload built in by default. So any changes will be immediately
reflected in the browser.

{% highlight text %}
cd <your app name>
ionic serve
{% endhighlight %}

To view the application using the iOS and Android styling applied you can use the following command:

{% highlight text %} ionic serve -lab {% endhighlight %}

There are many more awesome things you can do with the Ionic CLI. If you want to know more about the
CLI you can find it on [the ionic documentation](http://ionicframework.com/docs/cli/):

## 3. Structuring the application
At this moment you are set up with an Ionic starter app. But the first thing I did was refactoring the
code from technical modules to functional modules.

![Technical modules]({{ '/img/2016-04-07-ionic-protractor/technical.jpg' | prepend: site.baseurl }})
 --> 
![Functional modules]({{ '/img/2016-04-07-ionic-protractor/functional.jpg' | prepend: site.baseurl }})

I strongly advise to use functional modules, It's easy to work with because related code should be in 
one folder, and when testing you can use the same structure to test each module separately while 
coding. You'll find yourself less navigating trough all your open tabs or trough a tree-view.  
Further on it makes your code more comprehensible towards other developers. 
[The style guide from John Papa](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md)
 on how to structure AngularJS applications is a very good resource:
 
## 4. Sign-in page
_the one we'll be testing_

After the refactoring I implemented a sign-in page, which has no access to the tabs. 
The code for that is down here. If you work in functional modules like I do, it is as easy as 
referring to the controller and the service from index.html, then give 'starter.sign-in' as a module 
to your application

sign-in/sign-in-controller.js:
{% highlight text %}
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

sign-in/signin.html (essensial code):
{% highlight text %}
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

sign-in/sign-in.service.js:
{% highlight text %}
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

Next you need to provide a state, therefor in app.js add:
{% highlight text %}
state('signin',{
    url:'/signin',
    templateUrl: 'sign-in/sign-in.html',
    controller: 'SignCtrl'
)}
{% endhighlight %}

and change redirect to /signin by default.

{% highlight text %}
$urlRouterProvider.otherwise('/signin');
{% endhighlight %}

_For ideal authentication you should check authenticated state on changing pages, 
but that's not the scope for this blog_

## 5. Preparing protractor

Now the sign-in part is the one I am going to test with Protractor. First thing to do is install 
Protractor on your system, I did it global. 

{% highlight text %}
npm install -g protractor
{% endhighlight %}

The webdriver manager is a helper tool to easily get Selenium server running. 
These commands should be run in order to start the Selenium server.

{% highlight text %}
webdriver-manager update
webdriver-manager start
{% endhighlight %}

To keep you code clean from tests you can put tests in a dedicated folder, but one can argue against 
it and since I work in functional modules testing of these modules should go in the modules itself 
(imho).

Next I created a Protractor configuration file in the root of my project:

{% highlight text %}
touch protractor.config.js
{% endhighlight %}

In the Protractor file we need the following code, don't forget to set the correct URL to your running 
app otherwise you'll see some error codes that tell a lot, but not that you might be referring to a 
wrong URL. 

{% highlight text %}
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

## 6. Preparing the tests

As you can see there is already one spec file defined in the protractor config file, 
so lets create that file.

{% highlight text %}
cd www/sign-in/
touch sign-in.spec.js
{% endhighlight %}

In the newly created file you can start writing your tests, if everything went well you can simply 
add next test and it should validate to true. It only tests if the first page u see is the login page.
 
{% highlight text %}
describe('Signing in', function(){
    it('should start on sign-in view', function(){
        expect(browser.getTitle()).toEqual('Sign in');
    });
});
{% endhighlight %}

So we create a describe which will describe the whole scope of the specs. Every 'it' is called a spec, 
so here we just make one, we will add more later on. As you can see this is a very readable way of 
testing. We expect the browsers title to be equal to 'Sign in'. If the expect statement validates 
true, the spec has passed without failures, otherwise it will have a failure 
(feel free to change 'Sign in' to something else to see the test failing).

Now running this test requires a simple command that we could automate on our build server to test 
for us. In your command line you should return to the test folder and run the next command.

{% highlight text %}
cd ../..
protractor protractor.config.js
{% endhighlight %}

Running this command will read the config file and run all the spec-files defined. You will get 
some output in the command line. At the end you'll get a summary like 1 specs, 0 failures Finished 
in x.xxx seconds.

This is a simple test but it doesn't show the full potential of Protractor at all. 
Lets add a new spec as part of the describe.

{% highlight text %}
it('should be unable to click Sign-in button when fields are empty', function(){
    var button = element(by.id('btnSignIn'));
    expect(button.getAttribute('disabled')).toEqual('true');
});
{% endhighlight %}

So here we test the availability of the sign-in button when the fields are empty.
Next is to test if the button becomes available if the fields are filled in with valid data. 
So lets add another test:

{% highlight text %}
it('should be possible to click Sign-in button when fields are filled in', function(){
    var button = element(by.id('btnSignIn'));
    var txtUsername = element(by.id('username'));
    var txtPassword = element(by.id('password'));
    txtUsername.sendKeys('yannick@gmail.com');
    txtPassword.sendKeys('1234');
    expect(button.getAttribute('disabled')).toBe(null);
});
{% endhighlight %}

Running these tests should in all cases return they passed.

## 7. Page Object Pattern

You might have noticed that your tests run synchronous after each other. 
For this scenario it might be useful, but sometimes you need to start with a 'clean page' that 
would also mean you need to duplicate a lot of code, (for finding the button and text-fields). 
If you are working in an agile team, it is not unusual that requirements or user stories change. 
So this can implicate you'll have to change a lot of duplicated code. How can we work around that. 
Its called the 'page object pattern'. The general idea is to put your page in a JavaScript object. 
Lets dive in sign-in.page.js . This file should also be put into the module folder.

{% highlight text %}
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

In the 'constructor' we make sure our browser opens the signing page by passing the correct URL. 
Next we use the prototype to link our html elements with the object. Finally it is wise to create 
methods for basic functionality, like typing the username, if ever you would change the way of 
inputting a username (yeah I know bad example), you should just change that line and all your test 
will still be working. If that doesn't convince you, creating good methodnames also keeps your tests 
readable which is what you'll want when you look back in a few months.

We can now change our sign-in.spec.js to this:

{% highlight text %}
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

What changes? We create a page variable and before each 'it' we assign a new SignInPage object, 
this is important so your page get loaded again before every spec. meaning it always returns in the 
same state. Now you can create your specs as user stories.