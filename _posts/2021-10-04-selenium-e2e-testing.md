---
layout: post
authors: [yolan_vloeberghs]
title: 'Writing End-to-End Tests in Java with Selenium'
image: /img/2021-10-04-selenium-e2e-testing/banner.jpg
tags: [Java, Selenium, Testing, End-To-End, E2E, Test]
category: development
comments: true
---
# Table of contents
1. [End-To-End Testing](#end-to-end-testing)
2. [Selenium](#selenium)
3. [Practical Example](#practical-example)

# End-to-End Testing
<img src = "/img/2021-10-04-selenium-e2e-testing/end-to-end.png" class = "image right medium">
End-to-end (often referred to as E2E) testing is a testing methodology used to test a complete flow from the beginning to the end of one or more specific use cases within your application.
Its main goal is to test your full application from an end user's perspective and simulate everything that a real user would do.
This includes typing stuff, clicking buttons and/or links and test how your application responds to this behaviour. 

End-to-end testing can avoid, if done correctly, many complex situations and ensures that your application is stable and keeps working how it is intended to work.
If a button suddenly does not respond or does not behave in a way that you expect it to behave, end-to-end testing can detect this and warn you that your application is not functioning correctly.
Thanks to this, you can drastically improve stability, which gives you more time to implement features and reduces development costs.

End-to-end testing often starts with a user interacting with a user interface which then interacts with your backend that executes code behind-the-scenes in order to display the correct information on the user interface.
This is done through an automated browser where the end-to-end test clicks and types for you.
# Selenium
[Selenium](https://www.selenium.dev/documentation/en/){:target="_blank" rel="noopener noreferrer"} is an end-to-end testing framework which is available in many popular programming languages including Java, Python, JavaScript, ... .
It provides a set of tools that allows you to connect with an automated browser that interacts with your frontend.
<img src = "/img/2021-10-04-selenium-e2e-testing/selenium-logo.png" class = "image right medium">

Some of Selenium's features are:
- Cross-platform testing (PC, Android, iPhone, ...);
- Locating web elements on a page with advanced filtering such as XPath;
- Selecting and interacting with found elements;
- Capture screenshots at critical moments such as adding an entry in a table, submitting a form, ...;
- Keyboard & mouse emulation;

Selenium offers other products such as Selenium IDE and Selenium Grid, but at the core of Selenium, there is [WebDriver](https://www.selenium.dev/documentation/webdriver/){:target="_blank" rel="noopener noreferrer"}.
WebDriver is an API provided by Selenium which controls the automated browser and is used to fluently write your test code. 
Each browser (Firefox, Chrome, ...) has its own implementation of WebDriver. WebDriver then interacts with your browser's driver in order to execute the behaviour that you have specified in your test.

# Practical example
This post comes with [a repository](https://github.com/yolanv/spring-boot-todo-demo/tree/selenium){:target="_blank" rel="noopener noreferrer"} (branch `selenium`) with a basic example of how Selenium works in a Spring Boot application.
This explains how you can use the WebDriver API to fetch and interact with certain elements and do various assertions or interactions to write your tests.
It also includes a small example of `WebDriverWait`, which allows to pause the test and wait until a specific condition has been met on the page (i.e. loading an image, adding an entry to a table, ...).
Both E2E tests capture a screenshot during interaction with the frontend and those screenshots can be found in the target folder. You can check in the implementation (`ScreenshotService`) on how easy it is to add screenshot support.
This can be combined with JUnit functionality (Rule for JUnit 4 and Extension for JUnit 5), for example when you can take a screenshot if your test ends or fails.

For simplicity, I chose to use the Firefox browser. You will need the browser installed (or change the WebDriver implementation to your browser) in order for the test to work.
You can run the tests yourself and watch how Selenium interacts with the automated browser. Make sure you changed the path of the [geckodriver](https://github.com/mozilla/geckodriver/releases){:target="_blank" rel="noopener noreferrer"} binary in `BaseSeleniumE2ETest`.

