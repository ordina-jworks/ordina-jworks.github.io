---
layout: post
authors: [martijn_willekens]
title: "Automated testing with Gauge"
image: /img/2017-12-30-gauge-automated-testing/gauge.png
tags: [Gauge,E2E,Testing,Test automation]
category: Testing
comments: true
---
# Intro
You may have a dedicated tester in your team or maybe you don't even have one at all and do the testing yourself.
When finishing a new feature, you test whether it works, but you may have broken something else.
To know for sure, you have to test everything.
Doing all that manually, filling in forms, clicking around... will take quite some time. 
So, you'll probably end up not doing it thorough or even not at all and assume everything else still works fine.
That's why you should have automated tests do it for you!

Gauge is yet another test automation tool that serves that purpose. 
The founder is ThoughtWorks, the company that also created Selenium and GoCD. 
It's still in beta at the moment of writing, but it all works fine!
Gauge is comparable with Protractor or JUnit extended with Cucumber (if you haven't heard of these, they are worth checking out).
In this blog we'll be mainly talking about automating browser testing using Selenium WebDriver, although that isn't the sole purpose of Gauge.
If you don't know WebDriver, it's what allows you to interact with the browser to traverse the DOM, click on elements and so on.

Now, unlike Cucumber, Gauge itself only supports three languages at the moment: Java, Ruby and C#.
Others may be supported by the community like JavaScript.
You can define steps written in either one of those languages. 
These are the actual tests and can be identified by a sentence you can choose yourself.
By combining these sentences, you can write test scenarios which are written in MarkDown.
That means you don't need any programming experience to write test scenarios.
You could create some sort of dictionary with the step sentences that others can use for the scenarios or the other way around.
In other words, anyone is able to read and write test scenarios.
The actual implementation of the steps does require some technical knowledge.

## Setup
Gauge offers an installer which can be downloaded [here](https://getgauge.io/get-started.html){:target="_blank"}.
During the install, you can select which core plugins to install.
In this blog the tests are written in Java, so we would need the Java core plugin.
After the install, you'll be able to run `gauge` from the command line. 
It can, for example, be used to install more plugins (as well as core plugins `gauge install java`).

Next, in order to use WebDriver in our tests, we'll need the Java SDK and Maven. 
When you're a Java developer, you probably already have those installed. 
If not, you'll find enough on Google on how to install those.

To start a new project, create a new folder and run `gauge init java` in it.
This will setup a basic Gauge project.
Then we need to add a [pom.xml](https://github.com/getgauge-examples/java-maven-selenium/blob/master/pom.xml){:target="_blank"} file ourselves, because we need some dependencies such as Selenium WebDriver.
Next, WebDriver needs to setup in our test code. 
A good example of how you could do that can be found [here](https://github.com/getgauge-examples/java-maven-selenium/tree/master/src/test/java/utils){:target="_blank"}.
There, they created a `DriverFactory` so you can easily switch between browsers using environment variables (we'll get to that).
Gauge hooks are used to start and stop WebDriver when running the test suite.
Just copy those pieces of code into your own project.
Or, you could start from the _Maven + Selenium_ example provided by Gauge which can be found on [GitHub](https://github.com/getgauge-examples/java-maven-selenium){:target="_blank"}.
That way you'd have some examples to start from.

Now we can start writing tests.

## Writing tests
On the lowest level we have our Java functions that control the browser using WebDriver commands.
To these functions we can assign an `@Step` annotation to be able to identify it.
It's usually a sentence describing the action being performed.
The sentences can then be used to write the scenarios of our tests (or specs).
If you'd like to combine multiple steps into once sentence, you can do so by creating so called "concepts".

A typical folder structure for a Gauge setup using WebDriver and Java is as follows:
<p>
    <img class="image fit" style="max-width:194px" alt="Gauge Maven project structure" src="/img/2017-12-30-gauge-automated-testing/files.jpg" />
</p>
  
### Writing the specs
The specs are written in MarkDown.
Each spec file starts with a title and is underlined with `===`.
Next, some steps can be defined that will be run before each scenario.
When listing steps, you need to prefix each step with an asterix (*) as in a MarkDown list.
After that, the actual scenarios can be written.
They start with a title and are underlined with `---`.
Again, the steps for a scenario should be listed as in a MarkDown list.
You can also add some tags which can be used to only run certain specs and to search in the HTML reports.
Here's an example specification:

```markdown
Customer sign-up
================

* Go to sign up page

Customer sign-up
----------------
tags: sign-up, customer

* Sign up a new customer with name "JWorks" email "jworks@ordina.be" and "password"
* Check if the sign up was successful
```

### Writing the steps
The sentences we wrote in the specs still need to be linked to Java functions.
We can do so by simply adding an `@Step` annotation to a Java function.
It doesn't matter in which class you put the functions, you're free to choose how to organize them.
As long as they are under the `src/test/java` folder.
You could, for example, group them per page or per feature.

```java
public class CustomerSignup {

    @Step("Sign up as <customer> with email <customer@example.com> and <password>")
    public void registerCustomerWith(String customer, String email, String password) {
        WebDriver webDriver = Driver.webDriver;
        webDriver.findElement(By.linkText("Sign up")).click();
        WebElement form = webDriver.findElement(By.id("new_user"));
        form.findElement(By.name("user[username]")).sendKeys(customer);
        form.findElement(By.name("user[email]")).sendKeys(email);
        form.findElement(By.name("user[password]")).sendKeys(password);
        form.findElement(By.name("user[password_confirmation]")).sendKeys(password);
        form.findElement(By.name("commit")).click();
    }

    @Step("Check if the sign up was successful")
    public void checkSignUpSuccessful() {
        WebDriver webDriver = Driver.webDriver;
        WebElement message = webDriver.findElements(By.className("message"));
        assertThat(message.getText(), is("You have been signed up successfully!"));
    }
}
```

As shown in the example above, you can easily pass parameters to steps.
You simply have to wrap the keywords in `<>` in the `@Step` annotation 
and list the same keywords as parameters in the actual Java function.
Obviously, you can then use them in your Java code.

### Page object pattern
A clean way to organize all your code would be to use the page object pattern.
This means that for every page in you web app, you should create a class.
Such a class contains all code to interact with that specific page.

The example we saw earlier, could be transformed into this:

Page object:
```java
public class SignUpPage {
    public WebElement usernameField;
    public WebElement emailField;
    public WebElement passwordField;
    public WebElement passwordConfirmField;
    public WebElement commitButton;
    
    SignUpPage() {
        WebDriver webDriver = Driver.webDriver;
        webDriver.findElement(By.linkText("Sign up")).click();
        WebElement form = webDriver.findElement(By.id("new_user"));
        this.usernameField = form.findElement(By.name("user[username]"));
        this.emailField = form.findElement(By.name("user[email]"));
        this.passwordField = form.findElement(By.name("user[password]"));
        this.passwordConfirmField = form.findElement(By.name("user[password_confirmation]"));
        this.commitButton = form.findElement(By.name("commit"));
    }
}
```

Step definition:
```java
public class CustomerSignup {
    
    private SignUpPage signUpPage = new SignUpPage();

    @Step("Sign up as <customer> with email <customer@example.com> and <password>")
    public void registerCustomerWith(String customer, String email, String password) {
        this.signUpPage.usernameField.sendKeys(customer);
        this.signUpPage.emailField.sendKeys(email);
        this.signUpPage.passwordField.sendKeys(password);
        this.signUpPage.passwordConfirmField.sendKeys(password);
        this.signUpPage.commitButton.click();
    }
}
```

The great benefit of this approach is that you can reuse a lot of the code.
You only have to locate the elements once instead of in every step.
Functions can be added to the page objects as well.
Suppose you have a dropdown, you first have to click to open it and then select an option from the list.
You can write a function doing all that.
In your step definition, you then simply have to call that function to select something from a dropdown.
It's a good way to avoid too much code duplication.

### Concepts
If you find yourself repeating the same sequence of steps over and over, 
you could combine those steps into one step using concepts.
These are also written in MarkDown and you can pass arguments the same way as in the Java `@Step` annotations.
They should be placed in the `/specs/concepts` folder and use the *.cpt extension.

```markdown
# Sign up a new customer with name <name> email <email> and <password>
* Sign up as <name> with email <email> and <password>
* Show a message "Thank you for signing up! You are now logged in."
```

Cucumber only offers this feature in some implementations, they don't in Cucumber.js for example.
They refuse to implement it because they believe this creates too much abstraction and makes you lose sight of the overall picture.
Gauge does offer it, so it's up to you whether you want to make use of it or not.

## Running the specs
Since the project is setup with Maven, the tests can be run with `mvn test`. 
However, if you want to pass any arguments, you'll need to use `mvn gauge:execute` instead.

### Tags

You may have noticed in the spec files that tags can be added. 
They can be used to run only certain specs.

`mvn gauge:execute -DspecsDir=specs -Dtags="sign-up & customer"`

### Parallel
So far, Gauge didn't stand out from other automated testing solutions.
Although there's one thing that really does stand out and that's how easy it is to use parallel execution! 

`mvn gauge:execute -DspecsDir=specs -DinParallel=true`

Running this command will look how many CPU cores your computer has and start up that many streams.
For each stream it will open a browser window and execute the specs.
So if you have four CPU cores, four browser windows will be opened.
You can overwrite the number of parallel executors, but it's recommended not to exceed the number of CPU cores.

`mvn gauge:execute -DspecsDir=specs -DinParallel=true -Dnodes=2`

Now, some specs may take longer to run than others. 
By default specs are divided dynamically over the streams.
So when a spec has finished, it will take the next one from the list of specs that still need to be executed.
It's possible to change this so the specs are divided on startup, but the command is deprecated and will be removed.

### Making tests independent
To make use of this parallel execution, you'll have to make sure your tests don't rely on each other.
I think it's pretty clear why you shouldn't do that.
Anyway, suppose you test the sign up and sign in.
If your sign in relies on the user being signed up through a previous test, these tests should be run synchronously.
However, if you would want to test whether a user can sign in after having signed up, you should do so in one test.
That immediately solves our problem and we are safe to use the parallel execution!

## Environments and configuration
The config files are located under `env/default`.
You should have three files in that folder: `default.properties`, `java.properties` and `user.properties`.
In the [example by Gauge](https://github.com/getgauge-examples/java-maven-selenium){:target="_blank"}, they have an `APP_URL` parameter in that last file.
I recommend using that approach as well, you can get parameters in your Java code using `System.getenv("APP_URL")`.

It's possible to create different environments by simply creating a new folder and add the configuration files that you want to change there.
If you need a different configuration for you CI-tool, you can create a folder named `ci`.
When running the specs, you can pass an argument stating the environment.

`mvn gauge:execute -Denv="ci"`

Environments can also be used to run gauge with another browser like in the [example by Gauge](https://github.com/getgauge-examples/java-maven-selenium){:target="_blank"}. 
Create a folder named `firefox` for example and add a file called `browser.properties`. 
In that file you add `browser = FIREFOX`. 
When you then run the tests with the `firefox` environment, it will use FireFox as a browser instead.
(This only works if you have your project setup like in the example, the [Driver](https://github.com/getgauge-examples/java-maven-selenium/tree/master/src/test/java/utils/driver){:target="_blank"} and [DriverFactory](https://github.com/getgauge-examples/java-maven-selenium/tree/master/src/test/java/utils/driver){:target="_blank"} file are required here.)

## Report
To get a HTML report, the plugin has to be installed first: `gauge install html-report`.
That's about it!
After running the specs, a nice HTML report will be outputted to the `/reports` folder.
It shows which tests succeeded and which failed with some additional graphs.
In the report you'll even find how long it took to run a test and each of its steps.
There's also a search functionality to quickly find a certain spec. 

<p>
    <img class="image fit" style="max-width:768px" alt="Gauge HTML report" src="/img/2017-12-30-gauge-automated-testing/gauge-report.jpg" />
</p>

# Conclusion
It's a good idea to write automated tests. 
If you do it well, you don't have to spend a lot of time manually testing your application. 
The chance of something being broken by your changes will decrease dramatically.
Also, be sure to use the page object pattern and create functions for repetitive actions.
It avoids code duplication and having to update the same code in multiple places.

If you're starting a new project or starting from scratch with writing browser tests, you should consider using Gauge.
Even though it's still in beta. 
With ThoughtWorks as the main force behind this tool, it's here to stay!
