---
layout: post
authors: [xana_rasquin]
title: 'Unit testing for ABAP 101 and why you should do it'
image: /img/unit-testing-101/Unit-Testing.png
tags: [ABAP,Unit Testing,Eclipse]
category: ABAP Unit Testing
comments: false
---

# Unit testing for ABAP 101 and why you should do it

As a developer, you can spend quite a lot of time validating your work. 
This can mean that you run through your developments step by step, 
by F5'ing your way through an entire new business process. 
While this method provides added value in small scenario's, 
this still requires your invested attention and errors can still take place. You're only human after all.
In today's world, SAP applications need to be developed and changed at a faster pace. 
All the while, continuance also needs to be guaranteed. 
More and more SAP projects also follow an agile flow and DevOps is a more common feature in many organizations. 
This way of working requires an adjustment in the way developers handle their work.

## Table of contents
1. [Unit what?](#unit-what)
2. [How to implement](#how-to-implement)
3. [Benefits and drawbacks](#benefits-and-drawbacks)
4. [Summary](#summary)


## Unit what?

ABAP unit is an SAP testing tool that enables the ABAP developer to test individual blocks of a process. 
This can also be automated, to provide a backbone in bigger systems and ensure continued successful processes. 
Unit tests are defined and implemented as local classes inside a main program. 
It can be defined for a class, function pool, executable program, or module pool. 
We will focus on the implementation for class-based programming. 
A test is organized into classes which contain test methods. Small units are tested within the setup. 
The purpose of a test method is to check if a certain block in logic returns the desired result. 
The service class CL_ABAP_UNIT_ASSERT contains methods that can compare actual values 
that are calculated in the logic with the expected value you provide in the test. 
When you run a unit test, the results are described in the ABAP Unit result display screen. 
Here you can see which test methods have failed or succeeded and what the calculated values were.

 
## How to implement

Now, let's try to implement a simple unit test for a class. 
We'll work with a simple class that simulates a scoreboard. 
The score can be gained or lost.

```abap
---
CLASS ycl_test_scoreboard DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC .

  PUBLIC SECTION.
    DATA: mv_score TYPE i.
    METHODS: add_score IMPORTING iv_score TYPE i iv_type TYPE string.

  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.
```

The implementation of the method could look like this:

```abap
---
CLASS ycl_test_scoreboard IMPLEMENTATION.

    METHOD add_score.
        mv_score = SWITCH #( iv_type
                        WHEN 'win'  THEN mv_score + iv_score
                        WHEN 'loss' THEN mv_score - iv_score
                        ELSE 0 ).
    ENDMETHOD.

ENDCLASS.
```

Now, let's get started with our unit tests. Before I start implementing, 
I like to first determine the scenarios I want to test. 
For this example, I immediately recognize 3 situations. 

1.	Does the addition of a score work?
2.	Does the loss of some score points work?
3.	Furthermore, I'd like to test the result for trying to give an unrecognized type for adding a score.

For this tutorial, I'm working in Eclipse. At the bottom of the class editor, 
there's a ribbon from which you can navigate to the editor for test classes.

<img alt="Ribbon unit test" src="{{ '/img/unit-testing-101/ribbon-unit-testing-eclipse.png' | prepend: site.baseurl }}" class="image fit">

If you feel more comfortable working in the SAP GUI, 
you can locate the button at the top right of the screen in SE24:

<img alt="SE24 Test Class" src="{{ '/img/unit-testing-101/se24-test-class.png' | prepend: site.baseurl }}" class="image fit">
 
We start by defining the test class, as we would for a regular class. The definition does look a bit different though.

**PRO TIP**: If you're working in Eclipse, there is a handy template to generate the basic definition of a test class. Just type 'testclass' and trigger the auto-complete.

<img alt="Eclipse Test Auto-Complete" src="{{ '/img/unit-testing-101/eclipse-test-class-auto.png' | prepend: site.baseurl }}" class="image fit">

In the public section, define the methods that will execute the tests. Also define an instance of the class you're testing. This instance will call the method that contains the logic you want to test. 
How the definition could be written:

```abap
CLASS lcl_ DEFINITION FINAL FOR TESTING
  DURATION SHORT
  RISK LEVEL HARMLESS.

  PRIVATE SECTION.
    METHODS:
      setup,
      teardown,
      score_test_win     FOR TESTING,
      score_test_loss    FOR TESTING,
      score_test_unknown FOR TESTING.

    DATA: mo_cut TYPE REF TO ycl_test_scoreboard.

ENDCLASS.
```

Notice that we also have a 'setup' and 'teardown' method. These are predefined methods in ABAP unit and are respectively called before and after each test method in the test class. 
In setup( ) you can setup your test data which can be leveraged by various different test within the same test class. In our example, we instantiate the object for our scoreboard class and setup a default value for the score attribute.
In teardown( ) you can clear the test data that is used in the test. It is common practice to use this method to clear objects and attributes and make a clean slate for the next test method.
The implementation of the test class could look like this:

```abap
CLASS lcl_ IMPLEMENTATION.

  METHOD setup.
    mo_cut = NEW #( ).
    mo_cut->mv_score = 50.
  ENDMETHOD.

  METHOD teardown.
    CLEAR mo_cut.
  ENDMETHOD.

  METHOD score_test_win.
    mo_cut->add_score( iv_score = 25 iv_type = |win| ).
    cl_abap_unit_assert=>assert_equals( act = mo_cut->mv_score exp = 75 ).
  ENDMETHOD.

  METHOD score_test_loss.
    mo_cut->add_score( iv_score = 25 iv_type = |loss| ).
    cl_abap_unit_assert=>assert_equals( act = mo_cut->mv_score exp = 25 ).
  ENDMETHOD.

  METHOD score_test_unknown.
    mo_cut->add_score( iv_score = 25 iv_type = |kick| ).
    cl_abap_unit_assert=>assert_equals( act = mo_cut->mv_score exp = 50 ).
  ENDMETHOD.

ENDCLASS.
```

Now let's execute a test run. Go to the class in Eclipse and retrieve the context menu:

<img alt="Execute Test Run" src="{{ '/img/unit-testing-101/execute-test-run.png' | prepend: site.baseurl }}" class="image fit">

There's a result window that displays the number of test methods that were executed and the result of each test. In our case, all methods were successful.  

<img alt="Test Result" src="{{ '/img/unit-testing-101/test-result.png' | prepend: site.baseurl }}" class="image fit">

If we change an expected value, the method will fail and the result will also be shown in the ABAP Unit Runner overview.

```abap
 METHOD score_test_unknown.
    mo_cut->add_score( iv_score = 25 iv_type = |kick| ).
    cl_abap_unit_assert=>assert_equals( act = mo_cut->mv_score exp = 50 ).
 ENDMETHOD.
```

This would fail as the logic we implemented in our scoreboard class would return zero for an unknown type of score. 
The overview displays which method failed, what the actual value is, and at what line the code went wrong.
 

## Benefits and drawbacks

A huge benefit that I have personally experienced, is that a process logic remains tested during refactoring. 
As a consultant, you're often placed in an environment with existing code. You don't always get the luxury of creating new stuff from scratch. 
When an existing solution needs to be adjusted, I find It's very helpful if it's been unit tested. This helps to ensure continuation of existing processes.

It can also be that through upgrades, new syntax and processing capabilities are introduced that you might want to use in certain developments. 
Here it can be useful if you've written some unit tests to aid the refactoring process.

When you're writing unit tests, it can sometimes be difficult to find all the scenario's you want to test. 
In a big process, it's not always easy to compartmentalize logic into smaller blocks for unit tests. 
Another drawback is that the performance or quality of a unit test is directly dependent on the developer responsible for writing it. 

## Summary

ABAP unit is a testing tool that provides developers the opportunity to test their code. Unit tests are defined and 
implemented as local classes inside a main program and can be used for a class, function pool, executable program, or module pool. 
Test methods are used to check if a certain part of the process returns the desired result. 

Unit tests are easy to implement. It helps developers to distinguish capabilities of existing code and aids them in refactoring operations. 
The determination of scenario's can be a challenge and the quality of the tests depends on the covered scenario's. 
It's the developer's responsibility to provide a good test which covers the most relevant process outcomes. 
