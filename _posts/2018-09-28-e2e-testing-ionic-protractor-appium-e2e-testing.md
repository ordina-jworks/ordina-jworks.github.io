---
layout: post
authors: [ryan_de_gruyter]
title: "Automated E2E (End-to-End) testing on Android and iOS with Ionic, Protractor and Appium."
image: /img/ionic-protractor-appium.jpg
tags: [ionic,protractor,appium,angular,typescript,javascript,jasmine,testing,E2E,end-to-end,android,ios]
category: Ionic
comments: true
---

Sample application: https://github.com/ryandegruyter/ordina-ionic-appium-protractor

# Introduction

Many articles related to E2E testing Cordova/Ionic applications are about applications which only run in the browser. 
But what if your application run's on native mobile devices?

This article will cover how to get started with E2E testing your Ionic application on native Android and iOS devices.

To follow along, I recommend having a basic understanding of Javascript, Typescript, Jasmine and automated testing in general.

# Automated testing

When releasing an application, we need to make sure it was thoroughly tested.
Making sure of discovering any bugs before reaching production.
These tests or test scenarios can be done manually, but this would consume a lot of time and resources.
The more cost-effective solution would be to automatically run these test scenario's completely by an programmable agent.

Thanks to a few technologies, we can script a bot that can perform most user interface interactions, such as clicking on a button, performing touch gestures (f.e. swiping), etc.

The most popular solution for automated E2E tests is called Selenium which is based on the [WebDriver protocol](https://w3c.github.io/webdriver/).

While Selenium is a great solution for browsers, there is a better solution for native mobile apps called [Appium](http://appium.io/).
# Appium

Appium is a tool for automating mobile applications and writing cross-platform UI tests. It is very similar to Selenium. The difference is that Selenium is a tool for automating browsers and web applications, whereas Appium is a tool for automating Native / Hybrid mobile applications.

Appium allows developers to write UI tests for mobile applications in any number of programming language (Javascript, Java, .NET, etc.), as it uses a superset of the Selenium WebDriver specification, called the MJSONWP protocol.

## Cross-platform UI testing

Because we are using Ionic with Cordova, we can write our codebase using only web technologies but still build, deploy and run on multiple platforms.
Our mobile application can be packaged and deployed as a native application for both iOS and Android.
We can achieve the same cost-savings strategy "Write once, run anywhere" for our UI tests using Appium.
To automate our UI tests there needs to be an agent that programmatically drives the UI of your mobile application.

For each platform there are different agents:

- **iOS**: XCUITest
- **Android**: UIAutomator, Selendroid, Espresso

Controlling these agents requires a developer to write platform-specific code.
Appium with MJSONWP (Webdriver spec) provides an abstraction layer to drive these agents programmatically in a platform agnostic way.

We will explain how to set up your Appium server and run automated UI tests in your Ionic application on Android and iOS mobile devices.

# Getting started with Appium

## Environment

The first step is to setup your environment.
Because we are targeting Android and iOS we will only describe the setup for **macOS**, 
but it shouldn't be too different compared to other platforms once you have followed the 
official ionic resources guide below, they have guides for all platforms.

[Again: On the developer resources page of the official ionic documentation](https://ionicframework.com/docs/developer-resources/), you wil find guides on how to setup your machine depending on the OS you are working on.

Next:

- Install [appium-doctor](https://github.com/appium/appium-doctor) using npm.
- Run appium-doctor --ios and fix any issues
- Run appium-doctor --android and fix any issues

## Appium server

There are multiple ways to start an Appium server:

- Appium Desktop
- webdriver-manager
- npm install -g appium && npm run appium

### Appium desktop

[Appium Desktop](https://github.com/appium/appium-desktop) is a graphical frontend for running an Appium server and starting sessions to inspect your applications.

Note: For macOS make sure to drop the downloaded package in the /Applications folder, otherwise you will encounter write permission issues.

Appium desktop has 2 advantages:

- It comes with an inspector to show and inspect all elements of your application
- Record user actions

The drawback is inspecting and recording user actions only supports the Native context. You cannot record actions for the Webview context.
Cordova applications always run in the webview context.

[https://appium.io/docs/en/writing-running-appium/web/hybrid/index.html](https://appium.io/docs/en/writing-running-appium/web/hybrid/index.html)

### webdriver-manager

Selenium and appium server manager.
https://github.com/angular/webdriver-manager

webdriver-manager is officially supported by Angular and works well together with Protractor, the official E2E testing framework for Angular applications. Ionic up untill version 3.x is built on top of Angular, from version 4 and on Ionic has decoupled from the Angular framework and recreated all of their components using [StencilJS](https://stenciljs.com/).

### NPM 

We will be using this package to start up our appium server.

# Language

Decide in which language you want to write your tests in. You need to have a client library that can send MJSONWP / JSONWP HTTP Requests to the Appium server.

For our application, we will write our tests in Typescript using Protractor since it has added support for Angular and type safety.

Other webdriver javascript clients:

- http://webdriver.io/guide/getstarted/modes.html
- https://github.com/admc/wd

Client libraries for different languages https://appium.readthedocs.io/en/stable/en/writing-running-appium/other/appium-bindings/

# Project setup

We are going to use Ionic 4 and the **super** template as our application to run our tests on.

First make sure your development machine has been set up correctly.

[On the developer resources page of the official ionic documentation](https://ionicframework.com/docs/developer-resources/), you wil find guides on how to setup your machine depending on the OS you are working on.

Once your machine is setup, install the Ionic cli.

```shell
npm i -g ionic
```

Next, generate the Ionic Cordova application using the Ionic CLI.

```shell
ionic start superApp super --type=ionic-angular --cordova
ionic cordova platform add android
ionic cordova platform add ios
```

Test if you can build the application by entering the following commands

### Android

``` shell
ionic cordova build android
```

### iOS

Note: You will have to open your ios project in xcode first 
to configure your code signing identity and provision profile. 

``` shell
ionic cordova build ios
```

If you were able to successfully run these commands, we can start E2E testing our application on both iOS and Android.

Before continuing, Make a folder **/e2e** in the root of your project. 

## Configure the E2E testing tools in your Ionic project

### Appium

1. Install Appium as a local dependency
2. Add the correct chrome driver
3. Create an NPM task in your package.json
4. Boot up the appium service

#### 1. Install Appium as a local dependency

Simply run the following command to add Appium as a local dependency, 
this will allow us to work with Appium using NPM scripts.

```shell
npm i -D appium
```

#### 2. Add the correct chrome driver

To be able and run your tests on Android devices, 
you need to match the correct chrome driver with the Chrome version running on the Android test devices.

[Here is an overview of all the chrome drivers and their respective Chrome versions](https://appium.readthedocs.io/en/stable/en/writing-running-appium/web/chromedriver/).

To download a chrome driver, go to the [Chrome Driver Downloads page](http://chromedriver.chromium.org/downloads).

Once you have selected your chrome driver, download it and put in the 

**/e2e** folder.

#### 3. Create an NPM task in your package.json

Before running Appium, you can provide the downloaded chrome driver as a cli argument:

```shell
"appium": "appium --chromedriver-executable e2e/chromedriver",
```

#### 4. Start your Appium server

Now you should have everything configured correctly to start your Appium server.
Simply run:

```shell
npm run appium
```

### Protractor

Protractor will be our test runner and testing framework. 
[Visit their website](https://www.protractortest.org/#/) for more information on Protractor.

1. Install protractor as a local NPM dependency
2. Configure typescript configs
2. Create your protractor config
3. Create NPM script for running your e2e tests

#### 1. Install Protractor as a local NPM dependency

Install the test runner with the following command:

```shell
npm install -D protractor
```

#### 1. Configure Typescript

We require a few extra tools to be able run and write our tests in Typescript. 

```shell
npm install -D ts-node @types/jasmine @types/node
```

Next, in your **/e2e** folder, Create a **tsconfig.json** file with the following configuration:

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "lib": [
      "es2016",
      "esnext.asynciterable"
    ],
    "outDir": ".",
    "module": "commonjs",
    "target": "es5",
    "types": [
      "jasmine",
      "node"
    ]
  }
}
```

This will be our tsconfig for our e2e test scripts.

It's also a good idea to write your configuration files in Typescript.
For our protractor configuration we will use a different typescript configuration file.

In your **/e2e** folder, create a file called

**/e2e/protractor.tsconfig.json**

This configuration file will extend the one we create earlier, 
we just want to overwrite the include and exclude parameters to make sure it only matches
and transpiles the ***protractor.config.ts*** file.

```json
{
  "extends": "./tsconfig.json",
  "include": [
    "**/*.config.ts"
  ],
  "exclude": [
    "./test"
  ]
}
```
#### 3. Configure protractor

Now one of the more interesting parts, configuring Protractor!
Create a file called **/e2e/protractor.config.ts** with the following contents:
To get an idea of all the configuration parameters and their description, visit
[The official Protractor Github repo](https://github.com/angular/protractor/blob/master/lib/config.ts)

```typescript
import {Config} from 'protractor';
import * as tsNode from 'ts-node';

const serverAddress = 'http://localhost:4723/wd/hub';
const testFilePAtterns: Array<string> = [
  '**/*/*.e2e-spec.ts'
];
const iPhoneXCapability = {
  browserName: '',
  autoWebview: true,
  autoWebviewTimeout: 20000,
  app: '/Users/${user}/ordina/e2e/superApp/platforms/ios/build/emulator/superApp.app',
  version: '11.4',
  platform: 'iOS',
  deviceName: 'iPhone X',
  platformName: 'iOS',
  name: 'My First Mobile Test',
  automationName: 'XCUITest',
  nativeWebTap: 'true'
};
const androidPixel2XLCapability = {
  browserName: '',
  autoWebview: true,
  autoWebviewTimeout: 20000,
  platformName: 'Android',
  deviceName: 'pixel2xl',
  app: '/Users/${user}/ordina/e2e/superApp/platforms/android/build/outputs/apk/android-debug.apk',
  'app-package': 'be.ryan.superApp',
  'app-activity': 'MainActivity',
  autoAcceptAlerts: 'true',
  autoGrantPermissions: 'true',
  newCommandTimeout: 300000
};

export let config: Config = {
  allScriptsTimeout: 11000,
  specs: testFilePAtterns,
  baseUrl: '',
  multiCapabilities: [
    androidPixel2XLCapability,
    iPhoneXCapability
  ],
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },
  seleniumAddress: serverAddress,
  onPrepare: () => {
    tsNode.register({
      project: 'e2e/tsconfig.json'
    });
  }
};
```

I will go over the points that took me the most effort to configure correctly.

#### Capabilities

Refers to the capabilities of a single E2E session, 
it describes which features a particular session should have, for example:

- Platform (Android / iOS / ...)
- Device Name
- Automation framework
- Location of the Application build (.apk, .ipa)
- etc.

If you want to spin up multiple E2E testing settings, 
you need to configure the **multiCapabilities** property 

##### Android Capability

- Run ***ionic cordova build android*** and configure the output path in the **app** property
- **app-package** should match the package name in your config.xml
- **app-activity** is always MainActivity by default, unless you have changed this in your config.xml

```typescript
const androidPixel2XLCapability = {
  browserName: '',
  autoWebview: true,
  autoWebviewTimeout: 20000,
  platformName: 'Android',
  deviceName: 'pixel2xl',
  app: '/Users/${user}/ordina/e2e/superApp/platforms/android/build/outputs/apk/android-debug.apk',
  'app-package': 'be.ryan.superApp',
  'app-activity': 'MainActivity',
  autoAcceptAlerts: 'true',
  autoGrantPermissions: 'true',
  newCommandTimeout: 300000
};
```

##### iOS Capability

- Run ***ionic cordova build ios*** and configure the output path in the **app** property
- Point to the .app file and not the .ipa if you are using simulators.
- Set automationName to **XCUITest** instead of the deprecated **UIAutomator**
- browserName is a mandatory parameter, but since we're targeting Native apps, we can leave
this as an empty string

```typescript
const iPhoneXCapability = {
  browserName: '',
  autoWebview: true,
  autoWebviewTimeout: 20000,
  app: '/Users/${user}/ordina/e2e/superApp/platforms/ios/build/emulator/superApp.app',
  version: '11.4',
  platform: 'iOS',
  deviceName: 'iPhone X',
  platformName: 'iOS',
  name: 'My First Mobile Test',
  automationName: 'XCUITest',
  nativeWebTap: 'true'
};
```

#### 4. Create an NPM script for running e2e tests.

In your package.json, add the following task:

```shell
"e2e": "tsc --p e2e/pro.tsconfig.json && protractor e2e/protractor.config.js --verbose"
```

## Running and Writing UI tests

For Protractor to know which tests to run, you need to configure the 
**specs** property, in our case all the files that end with .e2e-spec.ts

```typescript
const testFilePAtterns: Array<string> = [
  '**/*/*.e2e-spec.ts'
];
export let config: Config = {
  ...
  specs: testFilePAtterns
  ... 
};
```

If you followed along, you should be able to run your tests by entering the following command:

```shell
npm run e2e
```

Writing protractor tests is out of scope in this post, 
but here is an example test script that you should be able to run on both iOS and Android.

```typescript
import {browser, by, element, ElementFinder, protractor} from 'protractor';

describe('App', () => {
  describe('Tutorial Screen', () => {
    it('should skip to the welcome screen and have the correct button labels', async () => {
      const skipButton: ElementFinder = element(by.id('skip'));
      await browser.wait(protractor.ExpectedConditions.elementToBeClickable(skipButton));
      const skipButtonLabel: string = await skipButton.getText();
      expect(skipButtonLabel).toEqual('SKIP');

      skipButton.click();

      const loginBtn: ElementFinder = await element(by.id('btn-login'));
      await browser.wait(protractor.ExpectedConditions.elementToBeClickable(loginBtn));
      const loginBtnLabel: string = await loginBtn.getText();
      expect(loginBtnLabel).toEqual('SIGN IN');

      loginBtn.click();
    });
  });
});
```

There are seven basic steps in creating an Appium test script.

1. Set the location of the application to test in the desired capabilities of the test script.
2. Create an Appium driver instance which points to a running Appium server
3. Locate an element within the mobile application.
4. Perform an action on the element.
5. Anticipate the application response to the action.
6. Run tests and record test results using a test framework.
7. Conclude the test.

### Webview And Native context
Our example application is a hybrid application. Meaning it will be packaged and deployed as native app so we can access Native API's. But it will accually run inside a webview. By using Cordova our webview can communicate with Native API's (f.e. Camera).

When the Camera is launched, we enter a Native Context, if we exit the Camera and go back to our Hybrid application we return to the Webview Context.

Appium helps us to easily switch between these contexts since locating and interacting with UI elements are very different in both contexts.

For example there are no DOM elements in the Native Context. To locate a native UI element you need to use an Accessibility ID. At the same time, AccessibilityID's are not available in a Webview context.

TouchEvents
TouchEvents like Tap / Swipe / Drag 'n Drop are only supported in the Native context. You can not use them in the Webview Context.

### Behaviour-driven development with Cucumber
Cucumber is a tool for BDD. 
You can easily integrate Cucumber with Appium using [Protractor cucumber framework](https://www.npmjs.com/package/protractor-cucumber-framework) on NPM.

A typical workflow looks like this:

```text
Describe an app feature and corresponding scenarios in a .feature file. The contents are written in Gherkin

Feature: As an employee I want to access the application

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
```

Developers write an implementation for the feature in a step definitions file:

```javascript
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
```

Let protractor and Appium run the step definitions in an Automated way.

The advantage of using cucumber is that non-developers can easily write their own .feature files in plain english (Gherkin).

This offers:

- Better collaboration between Business & Developers
- Feature files can act as contracts for acceptance criteria
- Better reporting and readability of the UI tests

**Cloud testing providers**

The following providers offer great support for Appium tests in the cloud:

- Saucelabs (Only simulators and emulators)
- TestObject (Only real devices, has been purchased by Saucelabs)
- Kobiton (Only real devices, allows you to connect your local mobile device farm)

# Conclusion

While investigating and hands-on experiencing Appium for the first time, 
I noticed the following trade-offs:

- Tests can be flaky (Simply rerunning a failing test can make it succeed)
- Tests on iOS take awhile to run
- Appium is slower than for example running tests directly with Espresso or XCUITest 
- Documentation can be outdated and is scattered around the web
- Setting up an environment for iOS and Android takes a lot of time initially
- UI tests can differ for each platform
- Sending key events can be very slow, which make test run very slow
- You need good knowledge of WebDriver API's to write good tests
- Debugging is hard, I mostly relied on console.log statements.
- Testing on Android needs to happen with Chrome Browser version 54+.

For Android we are limited to recent Android API's and devices with Chrome browser version 54+, this means we can not test older devices, or devices with older Android versions.

Setting up a local Appium server also takes a lot of setup and configuration, but this can be circumvented if you decide to go for a cloud testing provider like Saucelabs.

Still, I believe Appium offers a lot of value because 
- We can write UI tests both for Android and iOS using a single programming language
- You can automate manual testing for multiple platforms
- There are quality cloud testing providers out there to help you with all your testing needs

And once you have everything set up, it works quit good. 

https://github.com/ryandegruyter/ordina-ionic-appium-protractor