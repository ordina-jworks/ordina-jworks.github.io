---
layout: post
authors: [ryan_de_gruyter]
title: "E2E Testing Ionic applications on native mobile"
image: /img/angularts.jpg
tags: [ionic]
category: Ionic
comments: true
---

# Automated E2E (End-to-End) testing on Android and iOS with Ionic, Protractor and Appium.

## Introduction

Many articles related to E2E testing Cordova/Ionic applications are about applications which only run in the browser. 
But what if your application run's on native mobile devices?

This article will cover how to get started with E2E testing your Ionic application on native Android and iOS devices.

To follow along, I recommend having a basic understanding of Javascript, Typescript, Jasmine and automated testing in general.

## Automated testing
When releasing an application, we need to make sure it was thoroughly tested. 
Making sure of discovering any bugs before reaching production. 
These tests or test scenarios can be done manually, but this would consume a lot of time and resources. 
The more cost-effective solution would be to automatically run these test scenario's completely by an programmable agent.

Thanks to a few technologies, we can script a bot that can perform most user interface interactions, such as clicking on a button, performing touch gestures (f.e. swiping), etc.

The most popular solution for automated E2E tests is called Selenium which is based on the [WebDriver protocol](https://w3c.github.io/webdriver/). 

While Selenium is a great solution, we will be using [Appium](http://appium.io/).

## Appium

Appium is a tool for automating mobile applications and writing cross-platform UI tests.

It is very similar to Selenium.

The difference is that Selenium is a tool for automating browsers and web applications, whereas Appium is a tool for automating Native / Hybrid mobile applications.

Appium allows developers to write UI tests for mobile applications in any number of programming language (Javascript, Java, .NET, etc.), as it uses a superset of the Selenium WebDriver specification, called the MJSONWP protocol.

### Cross-platform UI testing
Because we are using Ionic with Cordova, we can write our codebase using only web technologies but still build, deploy and run on multiple platforms.

Our mobile application can be packaged and deployed as a native application for both iOS and Android.

We can achieve the same cost-savings strategy "Write once, run anywhere" for our UI tests using Appium.

To automate our UI tests there needs to be an agent that programmatically drives the UI of your mobile application.

For each platform there are different agents:

**iOS**: XCUITest
**Android**: UIAutomator, Selendroid, Espresso

Controlling these agents requires a developer to write platform-specific code.

Appium with MJSONWP (Webdriver spec) provides an abstraction layer to drive these agents programmatically in a platform agnostic way.

We will explain how to set up your Appium server and run automated UI tests in your Ionic application on Android and iOS mobile devices.

## Getting started with Appium
### Environment
The first step is to setup your environment.

Because we are targeting Android and iOS we will only describe the setup for macOS.

[On the developer resources page of the official ionic documentation](https://ionicframework.com/docs/developer-resources/), you wil find guides on how to setup your machine depending on the OS you are working on.

Next:

- Install https://github.com/appium/appium-doctor using npm.
- Run appium-doctor --ios and fix any issues
- Run appium-doctor --android and fix any issues

### Appium server
There are multiple ways to start an Appium server
- Appium Desktop
- webdriver-manager
- npm install -g appium && npm run appium

#### Appium desktop
Appium Desktop is a graphical frontend for running an Appium server and starting sessions to inspect your applications.
https://github.com/appium/appium-desktop

Note: For macOS make sure to drop the downloaded package in the /Applications folder, otherwise you will encounter write permission issues.

Appium desktop has 2 advantages
- It comes with an inspector to show and inspect all elements of your application
- Record user actions

The drawback is inspecting and recording user actions only supports the Native context. You cannot record actions for the Webview context.
Cordova applications always run in the webview context. https://appium.io/docs/en/writing-running-appium/web/hybrid/index.html

### webdriver-manager
Selenium and appium server manager.
https://github.com/angular/webdriver-manager

webdriver-manager is officially supported by Angular and works well together with Protractor, the official E2E testing framework for Angular applications. Ionic up untill version 3.x is built on top of Angular, from version 4 and on Ionic has decoupled from the Angular framework and recreated all of their components using [StencilJS](https://stenciljs.com/).

### NPM 

We will be using this package to start up our appium server.

## Language
Decide in which language you want to write your tests in. You need to have a client library that can send MJSONWP / JSONWP HTTP Requests to the Appium server.

For our application, we will write our tests in Typescript using Protractor since it has added support for Angular and type safety.

Other webdriver javascript clients:
- http://webdriver.io/guide/getstarted/modes.html
- https://github.com/admc/wd

Client libraries for different languages https://appium.readthedocs.io/en/stable/en/writing-running-appium/other/appium-bindings/


## Project setup

We are going to use Ionic 4 and the **super** template as our application to run our tests on.

First make sure your development machine has been set up correctly.

[On the developer resources page of the official ionic documentation](https://ionicframework.com/docs/developer-resources/), you wil find guides on how to setup your machine depending on the OS you are working on.

Once your machine is setup, install the Ionic cli.
```
npm i -g ionic
```

Next, generate the Ionic Cordova application using the Ionic CLI.

```
ionic start superApp super --type=ionic-angular --cordova
ionic cordova platform add android
ionic cordova platform add ios
```

Test if you can build the application by entering the following commands

### Android ###

```
ionic cordova build android
```

### iOS ###

You will have to open your ios project in xcode first 
to configure your code signing identity and provision profile. 

```
ionic cordova build ios
```

If you were able to successfully run these command, we can start E2E testing our application on both iOS and Android.

Make a folder **/e2e** in the root of your project. 

### Configure E2E testing tools in your Ionic project

#### Appium

1. Install Appium as a local dependency
2. Add the correct chrome driver
3. Create an NPM task in your package.json
4. Boot up the appium service

##### 1. Install Appium as a local dependency

Simply run the following command to add Appium as a local dependency, 
this will allow us to work with Appium using NPM scripts.

``
npm i -D appium
``

##### 2. Add the correct chrome driver

To be able and run your tests on Android devices, 
you need to match the correct chrome driver with the Chrome version running on the Android test devices.

[Here is an overview of all the chrome drivers and their respective Chrome versions](https://appium.readthedocs.io/en/stable/en/writing-running-appium/web/chromedriver/).

To download a chrome driver, go to the [Chrome Driver Downloads page](http://chromedriver.chromium.org/downloads).

Once you have selected your chrome driver, download it and put in the 

**/e2e** folder.

##### 3. Create an NPM task in your package.json

Before running Appium, you can provide the downloaded chrome driver as a cli argument:

``
"appium": "appium --chromedriver-executable e2e/chromedriver",
``

##### 4. Start your Appium server

Now you should have everything configured correctly to start your Appium server.
Simply run:

``
npm run appium
``

#### Protractor


### Writing UI tests
There are seven basic steps in creating an Appium test script.

1. Set the location of the application to test in the desired capabilities of the test script.
2. Create an Appium driver instance which points to a running Appium server
3. Locate an element within the mobile application.
4. Perform an action on the element.
5. Anticipate the application response to the action.
6. Run tests and record test results using a test framework.
7. Conclude the test.

Behaviour-driven development with Cucumber
Cucumber is a tool for BDD. We can easily integrate Cucumber with Appium using Protractor.

A typical workflow looks like this:

Describe an app feature and corresponding scenarios in a .feature file. The contents are written in Gherkin

Feature: As a KBC employee I want to access the application

@Authentication
Scenario: Authenticate with AzureAD
Given I am on the Login page
When I click on "Login"
When I provide my credentials
When I click on the "Submit" button
Then I should see the Dashboard page


@Authentication Failed
Scenario: Authenticate with AzureAD fails
Given I am on the Login page
When I click on "Login"
When I provide incorrect credentials
When I click on the "Submit" button
Then I should see the Login failed page



Developers write an implementation for the feature in a step definitions file:

Given(/^I am on the Login page$/, () => {
    expect(app.getTitle()).to.equal('Login');
});

When(/^I click on "Login", () => {
    LoginPage.loginButton.click();
});

When(/^I provide my credentials$/, () => {
    WindowsAuthPage.enterCredentials(usr,pass);
});

When(/^I click on the "Submit" button$/, () => {
    WindowsAuthPage.submitButton.click();
});

Then(/^I should see the Dashboard page$/, () => {
    expect(app.getTitle()).to.equal('Dashboard');
});


Let protractor and Appium run the step definitions in an Automated way.


The advantage of using cucumber is non-developers can easily write their own .feature files in plain english (Gherkin).
This offers:

Better collaboration between Business & Developers
Feature files can act as contracts for acceptance criteria
Better reporting and readability of the UI tests
Webview And Native context
The AYS Mobile application is a hybrid application. Meaning it will be packaged and deployed as native app so we can access Native API's. But it will accually run inside a webview. By using Cordova our webview can communicate with Native API's (f.e. Camera).

When the Camera is launched, we enter a Native Context, if we exit the Camera and go back to our Hybrid application we return to the Webview Context.

Appium helps us to easily switch between these contexts since locating and interacting with UI elements are very different in both contexts.

For example there are no DOM elements in the Native Context. To locate a native UI element you need to use an Accessibility ID. At the same time, AccessibilityID's are not available in a Webview context.

TouchEvents
TouchEvents like Tap / Swipe / Drag 'n Drop are only supported in the Native context. You can not use them in the Webview Context.

Protractor configuration
Android

{ 
capabilities: { 
browserName: '', 
autoWebview: true, 
autoWebviewTimeout: 20000, 
platformName: 'Android', 
platformVersion: '7.0', 
deviceName: 'nex6', 
app: '/Users/.../ays/mobileapp/platforms/android/build/outputs/apk/android-debug.apk', 
'app-package': 'be.kbc.appyourservice', 
'app-activity': 'MainActivity', 
nativeWebTap: true, 
autoAcceptAlerts: true, 
autoGrantPermissions: true, 
newCommandTimeout: 300000 
}, 
baseUrl: 'http://localhost:8100/', 
framework: 'jasmine', 
jasmineNodeOpts: { 
showColors: true, 
defaultTimeoutInterval: 30000
}, 
useAllAngular2AppRoots: true, 
seleniumAddress: 'http://0.0.0.0:4723/wd/hub', 
onPrepare: function () { 
require('ts-node').register({ 
project: './tsconfig.protractor.json' 
}); 
}};

iOS
Make sure to point to the .app file and not the .ipa if you are using simulators.



{ 
capabilities: { 
browserName: '', 
baseUrl: 'http://localhost:8100/',
automationName: 'XCUITest', 
platformName: 'iOS', 
platformVersion: '11.2', 
autoWebview: true, 
deviceName: 'iPhone 5s', 
app: "/Users/.../mobileapp/platforms/ios/build/emulator/AppYourService.app", 
autoWebviewTimeout: 20000, 
nativeWebTap: true, 
autoGrantPermissions: true, 
autoAcceptAlerts: true 
}, 
framework: 'jasmine', 
jasmineNodeOpts: { 
showColors: true, 
defaultTimeoutInterval: 30000
}, 
useAllAngular2AppRoots: true, 
seleniumAddress: 'http://0.0.0.0:4723/wd/hub', 
onPrepare: function () { 
require('ts-node').register({ 
project: './tsconfig.protractor.json' 
}); 
}};
Investigation
While investigating and hands-on experiencing Appium for the first time, we noticed the following:

Native context is better supported than the Webview context
Flaky tests
Documentation can be outdated and is scattered around the web
Setting up an environment for iOS and Android took a lot of time initially
UI tests can differ for each platform
Sending key events can be very slow, which make test run very slow
You need good knowledge of Webdriver API's to write good tests
Debugging is hard, we mostly rely on console.log statements. There are remote debugging options with Visual Code, but I did not invest time configuring this.
Testing on Android needs to happen with Chrome Browser version 54+.
Cloud testing providers
The following providers offer the best support for Appium tests in the cloud:

Saucelabs (Only simulators and emulators)
TestObject (Only real devices, has been purchased by Saucelabs)
Kobiton (Only real devices, allows you to connect your local mobile device farm)
We only tested one cloud provider: Saucelabs. Configuration was fairly simple.

To consider:

Simulator startup on iOS is slow
Tests run slow
Simulators and emulators always start fresh (you cannot save any phone state, f.e. preferred browser)
Tests can be flaky (Simply rerunning a failing test can make it succeed)
FET & ACC environments will not be accesible
Pricing (Kobiton is the cheapest)
Conclusion
For Android we are limited to recent Android API's and devices with Chrome browser version 54+, this means we can not test older devices, or devices with older Android versions.

Device farms are less valuable because of this.

Since we lack the experience writing Selenium / Appium tests, getting to know the Webdriver API's and writing tests will take extra time and effort.

Setting up a local Appium server also takes a lot of setup and configuration, but this can be circumvented if you decide to go for a cloud testing provider like Saucelabs.

But still, I believe Appium offers a lot of value because we can write UI tests both for Android and iOS using a single programming language, And It would definitely help with Regression testing.

If I had the time and budget to integrate it I would add it to our tech stack.