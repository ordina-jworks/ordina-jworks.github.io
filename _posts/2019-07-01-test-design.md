---
layout: post
authors: [pieter_van_hees]
title: 'Design your tests!'
image: /img/devoxx-fr-2019/devoxx-fr.png
tags: [Test Driven Development, Test Design, Architecture]
category: Testing
comments: true
---

# Table of contents

* [Why should we design our tests](#why-should-we-design-our-tests)
* [The most basic test design](#the-most-basic-test-design)
* [Fragile tests example](#fragile-tests-example)
* [Implementing the API](#implementing-the-api)
* [Advantages of using an API](#advantages-of-using-an-api)
* [Conclusion](#conclusion)

## Why should we design our tests

We spend quite some time thinking about the design of our production code.
We do this because we want our code to be readable and maintainable.
The easier our code can be maintained, the easier we can implement new features and perform the necessary refactorings to implement those features.

The absurd thing is that we only design our *production code* and not our tests.
Our tests should be equally readable and maintainable as our production code, because if we don't, we'll spend too much time fixing and rewriting our tests.

If we successfully create readable tests, they will also serve as very good documentation, describing the functionality of our code, and how it is expected to behave.

## The most basic test design

A common practice in writing tests is creating a test class for each production class. 
The reason why it is such a popular practice, is because;
* it's easy to find tests for the production code you're looking at,
* it's a quick way to write new tests because you don't have to think about how and where to write tests.


Although this approach does have advantages, it can also be harmful for the maintainability of your application.
The disadvantage of this approach becomes clear when you need to refactor some classes.
If you move logic from one class to another, or even multiple other classes, you need to create new tests to test each of those classes, if you want to keep your 'one class means one test class' strategy.

In performing such a refactoring we should not need to change any test because we are not adding or changing any functionality, only moving logic around. 
However, if we want to keep our *design* of having a test class for each production class, we need to refactor our tests as well.

Even if we don't want to keep this design, our tests will have to be modified because chances are big that the API of our production code changed. 
The parameters of methods might have changed, the fields of objects might have changed, constructors might have changed, etc.
If we are lucky, the tests still compile, but they will very likely fail. 
And the larger your application becomes, the more work it will be to get all tests compiling and green again.

This phenomenon is known as [fragile tests](http://xunitpatterns.com/Fragile%20Test.html){:target="_blank" rel="noopener noreferrer"}.

## Fragile tests example

An example of this phenomenon that we encountered on a project is the creation of an instance of an [aggregate](https://martinfowler.com/bliki/DDD_Aggregate.html){:target="_blank" rel="noopener noreferrer"}.
A lot of the tests in our project needed an instance of an aggregate. 
This was not a problem at first, we just created aggregates by using the constructor of the class and passing all the necessary data in it.
We created these instances in every test where we needed them, or sometimes created a method in the test class to not duplicate the construction too much in that class.

To illustrate the issue we will look at a fictional simplified example about order creation.
```java
public class Order {
    
    private final UUID customerId;
    
    public Order(final Customer customer) {
        Assert.notNull(customer, "Customer should not be null");
        Assert.isTrue(customer.isActive(), "Customer should be active");
        this.customerId = customer.getId();
    }
    
    public UUID getCustomerId() {
        return this.customerId;
    }
}
```

```java
public class OrderTest {
    
    @Test
    public void given_an_active_customer_then_order_creation_should_be_successful() {
        final UUID customerId = UUID.randomUUID();
        final Customer customer = mock(Customer.class);
        when(customer.getId()).thenReturn(customerId);
        when(customer.isActive()).thenReturn(true);
        
        final Order order = new Order(customer);
        
        assertThat(order.getCustomerId()).isEqualTo(customerId);
    }
    
    @Test
    public void given_an_inactive_customer_then_order_creation_should_result_in_an_illegal_argument_exception() {
        final Customer customer = mock(Customer.class);
        when(customer.isActive()).thenReturn(false);
 
        assertThrows(IllegalArgumentException.class, () -> new Order(customer));
    }
}
```

Our problems began when we realised that the constructor of our aggregate was becoming too large. 
To resolve this issue we decided to create a class that contains all the data needed to call the constructor.

```java
public class Order {
    
    private UUID customerId;
    
    public Order(final CreateOrderData data) {
        Assert.notNull(data.getCustomer(), "Customer should not be null");
        Assert.isTrue(data.getCustomer().isActive(), "Customer should be active");
        this.customerId = data.getCustomer().getId();
    }
    
    public UUID getCustomerId() {
        return this.customerId;
    }
}
```

However when we tried to run all the tests, most of them didn't compile anymore, which makes sense because we changed the contract.
Now we could have made it easier for ourselves by using some IntelliJ refactoring tools, but nevertheless, it's absurd that so many tests could break by just changing the way we construct our aggregates.

When we finally got all our tests green again by just creating the data class parameter, we were so happy and sick of the refactoring that we just stopped there, instead of addressing the underlying issue.

```java
public class OrderTest {
    
    @Test
    public void createOrder_happyPath() {
        final UUID customerId = UUID.randomUUID();
        final Customer customer = mock(Customer.class);
        when(customer.getId()).thenReturn(customerId);
        when(customer.isActive()).thenReturn(true);
        
        final CreateOrderData data = new CreateOrderData();
        data.setCustomer(customer);
        
        final Order order = new Order(data);
        
        assertThat(order.getCustomerId()).isEqualTo(customerId);
    }
    
    @Test
    public void createOrder_customerInactive() {
        final Customer customer = mock(Customer.class);
        when(customer.isActive()).thenReturn(false);
 
        final CreateOrderData data = new CreateOrderData();
        data.setCustomer(customer);
        
        assertThrows(IllegalArgumentException.class, () -> new Order(data));
    }
}
```

A few months later, after adding some more features, we noticed that there was too much logic inside the constructor of our aggregate. 
The constructor became too big and complex so we decided to use the factory pattern to create new instances of the aggregate. 

As we didn't change the input parameters of the constructor, all our tests still compiled and we were happy.
That is, until we ran our tests. 

Because we moved all construction logic from the constructor to the factory, the tests still compiled, but as they relied on this construction logic to create the instance the way we need it, they now failed.
Again we were faced with the issue of a large amount of tests that we had to refactor. 

Not having learned from our previous mistakes and being under time pressure, we decided to use the factory to create instances in all our tests. 
For the factory we needed some other services, repositories etc. which we all mocked.
This was a huge amount of work because of all the mocking we had to do just so we could create a consistent aggregate.
And we had to do this, again, in every test that needs an aggregate.

After everything worked again, we were happy that the pile of work was done and we could move on with other things.

In the weeks that followed, however, we started to notice that every time we changed the logic of the factory, we needed to change all the tests again because we had to add some extra mocks, data, etc. in all the tests.

After a few of these iterations where we had to spend too much time fixing tests, we were fed up and decided (way too late of course) to free up some time for a more structural solution.

We got some inspiration from a [blogpost](https://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html){:target="_blank" rel="noopener noreferrer"} from Uncle Bob about his opinion on the statement that *TDD harms architecture*.
One of the things he mentions in his post is that we shouldn't make the mistake of coupling every test to the implementation of our production code.
Instead it would be better to put some sort of API in between our tests and the production code.

## Implementing the API 
We didn't take Uncle Bob's solution too literally and gave our own twist to it.

For the specific problem of creating aggregate instances we decided to create a class that acts as a scenario builder.
In this CreateOrderScenario we have a static factory method that will create a scenario that returns a valid Order when executed.
This means that when you need an order that is consistent and it doesn't matter for your test which data is in the order, you can just use the default scenario when it's executed.

You could also create other default scenarios.
For example an order with an invalid customer, or with specific data that triggers a certain flow in the order process.

This is very convenient for most tests.
However, in some tests we want to influence how the Order is constructed, so we can test some custom cases other than a default scenario, specific for certain tests.
We implemented this by adding some methods to our scenario class that allows the scenario to be modified to the test's needs.

```java
public class CreateOrderScenario {

    public static final UUID customerId = UUID.randomUUID();

    private CreateOrderData createOrderData;
    private CustomerRepository customerRepository;

    public static CreateOrderScenario defaultScenario() {
        final CreateOrderScenario scenario = new CreateOrderScenario();

        final Customer customer = mock(Customer.class);
        when(customer.isActive()).thenReturn(true);

        scenario.customerRepository = mock(CustomerRepository.class);
        when(scenario.customerRepository.findById(customerId)).thenReturn(Optional.of(customer));

        scenario.createOrderData = new CreateOrderData(customerId);

        return scenario;
    }

    public CreateOrderScenario modifyCreateOrderData(Consumer<CreateOrderData> modifier) {
        modifier.accept(createOrderData);
        return this;
    }

    public CreateOrderScenario overrideCustomerRepository(Consumer<OrderRepository> modifier) {
        customerRepository = mock(CustomerRepository.class);
        modifier.accept(customerRepository);
        return this;
    }

    public Order execute() {
        final OrderValidator orderValidator = new OrderValidator(customerRepository);
        final OrderFactory orderFactory = new OrderFactory(orderValidator);

        return orderFactory.createOrder(createOrderData);
    }
}
```

In the following example we created two tests that verify that the construction of an order works correctly.
In the first test, we use the default scenario without modifying anything, meaning, we test the happy path and verify that all data in the created order is correct.

In the second test we verify that if we try to create an order for a customer that doesn't exist, we get a validation exception.
We do this by creating a default scenario, then modifying the input data to use a `customerId` defined in the test, and then overriding the behaviour of the `CustomerRepository` mock.

```java
class CreateOrderTest {
    
    @Test
    void createOrder_happyPath() {
        final Order order = CreateOrderScenario
            .defaultScenario()
            .execute();
        
        assertThat(order.getCustomerId()).isEqualTo(CreateOrderScenario.customerId);
    }
    
    @Test
    void createOrder_customerInactive() {
        final UUID customerId = UUID.randomUUID();
        final CreateOrderScenario scenario = CreateOrderScenario
            .defaultScenario()
            .modifyCreateOrderData(orderData -> orderData.setCustomerId(customerId))
            .overrideCustomerRepository(repository -> 
                when(repository.findById(customerId)).thenReturn(Optional.empty()));
        
        assertThrows(InvalidCustomerException.class, () -> scenario.execute());
    }
}
```

## Advantages of using an API

The advantage of this design is that our tests are not aware of:
* the use of a factory to create orders,
* a validator class, used by the factory to validate the input for creating an order,
* and how the constructor of the `Order` aggregate should be called. 

With this example, it's easy to see that our new tests are much less likely to break than our original **design**. 
There is a clean layer between the implementation/design of our application, and the tests.
This lower coupling makes it easier to refactor the application, and implement new features at a higher pace.

Also notice that we didn't create a test class that maps one-to-one to a production code class.
Rather than testing our `Order` object, or our `OrderFactory`, or our `OrderValidator`, we test the creation of an aggregate instance. 
We test what we expect our application to do, not what we expect our class to do.

Whenever we have to change the logic of how an `Order` is created, we know that we have to look in the `CreateOrderTest` class.
We don't have to look at the `OrderTest` class, the `OrderFactoryTest` class, or the `OrderValidator` test class to see where we should add some tests.

## Conclusion
In no way is this design perfect, nor will it be suitable in every project.
However, it is a good starting point to have a lower coupling between tests and production code.
And it's also a good way to take your test design further and make it more applicable and relevant to your specific project.

This creates the opportunity to make a higher level language to express your tests, making them more readable, and express your intent of what your test is verifying more clearly.

And even if you're not convinced of this design, think about a design of your own, and start to improve the readability and maintainability of your tests.
