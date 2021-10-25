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

## test_E2E_AssertVisibleHtmlElements()
The first E2E test is a basic test that covers all the HTML elements that are visible (or, should be visible) on the main page.
In this test, various methods and approaches are used to find the desired elements and then to assert attributes like visiblity, text, colors, ... .
Notice how the `WebDriverWait` pauses the test and waits for the image to load before proceeding.
By far the best approach to find elements on the page is to use XPath, which is a language that provides an easy way to find HTML elements on the page.
`//table[@class='table']` means that we want to find a `table` element on the page that contains the class `table`.

```java
    @Test
    void test_E2E_AssertVisibleHtmlElements() {
        // Find the content of the title by going through various HTML attributes on the page
        // You can go step-wise through your HTML elements to find the right one by chaining findElement()
        var title = driver
                .findElement(By.id("header"))
                .findElement(By.className("navbar"))
                .findElement(By.tagName("a")).getText();

        assertThat(driver.getTitle()).isEqualTo(APP_TITLE);
        assertThat(title).isEqualTo(APP_TITLE);

        // Find the CSS value of a HTML element
        var navColor = driver
                .findElement(By.id("header"))
                .findElement(By.className("navbar")).getCssValue("background-color");
        var navColorHex = Color.fromString(navColor).asHex();

        assertThat(navColorHex).isEqualTo(COLOR_HEX_ORANGE);

        // We can ask the WebDriverWait to wait until the logo is done loading so we can proceed with the test
        // No chaining needed here, because 'logo' is only used by the img tag
        waitDriver.until(ExpectedConditions.elementToBeClickable(By.className("logo")));
        // Find the image through the class name 'logo'
        var image = driver.findElement(By.className("logo"));

        assertThat(image.getTagName()).isEqualTo("img");
        assertThat(image.isDisplayed()).isTrue();

        // Easily find the table and the button on the page through XPath
        var thead = driver.findElement(By.xpath("//table[@class='table']/thead"));
        var theadRows = thead.findElements(By.tagName("th"));

        assertThat(theadRows.size()).isEqualTo(2);
        assertThat(theadRows.get(0).getText()).isEqualTo("Description");
        assertThat(theadRows.get(1).getText()).isEqualTo("Delete");

        var tbody = getTableBody();
        assertThat(tbody.findElements(By.tagName("tr")).size()).isZero();

        var addButton = getAddTodoButton();
        assertThat(addButton.getText()).isEqualTo(ADD_NEW_TODO_BUTTON);

        captureScreenshot();
    }
``` 

## test_E2E_addNewTodoToTable_And_DeleteTodoFromTable()
The second (and last) E2E test actually interacts with the browser and asserts various elements based on these interactions.
The test is responsible for clicking on the "Add" button, fill in an item in the description text box and confirming the item, adding it to the table of TODO's.
Right after adding the item to the table, the test assures that the table contains an item and has the correct content, then deletes the item from the table.
Again, we use XPath in order to find the correct element because of the simple approach.
This time, the syntax is a little bit more advanced but definitely still easy to  use.
`//div[@class='modal-body']/form/button[@type='submit']` searches for a button of type `submit` in a form in a div with class `modal-body`.
We can find the first element in the table by using `//td[1]`. Notice how it says `[1]` and not `[0]`. The starting index in XPath is always 1.
The "Delete" button is found by searching for the text inside the button (`//button[@type='submit' and text() = 'Delete']`).

```java
    @Test
    void test_E2E_addNewTodoToTable_And_DeleteTodoFromTable() throws InterruptedException {
            var addButton = getAddTodoButton();
            // interact with the button
            addButton.click();

            // Wait two seconds to show visible changes
            Thread.sleep(2000);

            // Find an element on the page by using its id in the HTML element
            var formTitle = driver.findElement(By.id("modalTitle"));
            assertThat(formTitle.getText()).isEqualTo(MODAL_TITLE);

            var descriptionBox = driver.findElement(By.id("todoDescription"));
            assertThat(descriptionBox.getTagName()).isEqualTo("input");
            // Type "this is an E2E test" in the input field
            descriptionBox.sendKeys("This is an E2E test");

            // Wait two seconds to show visible changes
            Thread.sleep(2000);

            var confirmButton = driver.findElement(By.xpath("//div[@class='modal-body']/form/button[@type='submit']"));

            // Interact with the "Add todo" button
            confirmButton.click();

            captureScreenshot();

            var tbody = getTableBody();
            var rows = tbody.findElements(By.tagName("tr"));
            assertThat(rows.size()).isEqualTo(1);

            // Use CSS selectors to find the columns of the TODO entry on the page
            assertThat(tbody.findElement(By.cssSelector("tr:nth-child(1)"))
            .findElements(By.tagName("td")).size()).isEqualTo(2);

            assertThat(rows.get(0).findElement(By.xpath("//td[1]")).getText()).isEqualTo("This is an E2E test");

            // Wait two seconds to show visible changes
            Thread.sleep(2000);

            // Find the delete button based on the input type and the text in the button
            var deleteButton = tbody.findElement(By.xpath("//button[@type='submit' and text() = 'Delete']"));
            deleteButton.click();

            // Verify that the item is removed from the table by checking if there are no <tr> elements
            assertThat(getTableBody().findElements(By.tagName("tr")).size()).isEqualTo(0);
            }

```
