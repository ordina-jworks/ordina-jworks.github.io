---
layout: post
authors: [wout_meskens]
title: 'An Introduction to Spring Data Jdbc'
image: /img/spring-ecosystem/spring-data.png
tags: [Java, Spring, Data, Jdbc]
category: Java
comments: true
---

> A new member is added to the spring data family. Spring data jdbc is positioned between Spring data jpa and Spring jdbc.
> This post will describe the current state and the future of this product. It will also explain what problems this product is trying to solve.

# Table of content

* [Spring jdbc vs Spring data jdbc vs Spring data jpa](#product-comparison)
* [Current state](#current-state)
* [DDD principles](#ddd-principles)

## Introduction
Spring data jdbc is a new member of the spring data family. 
It is created to fill a void that sits between spring jdbc and spring data jpa.
Spring data jdbc contains a lot of features that other spring data products also possess. 
The creators also wanted to make this product more easy to understand and use than spring data jpa and they want to force you to use DDD principles in your project.
In the rest of this article the differences with spring data jpa and sping jdbc will be shown.
This will hopefully show that spring data jdbc is a very nice product with a lot of potential that is designed to help you.

## Spring jdbc vs Spring data jdbc vs Spring data jpa

### Setting up the database
A lot of projects still use sql databases. The setup of these databases can be a lot of work especially if you have a more complex project. 
All these frameworks can help you with this, but they do it in a different way.

#### Spring jdbc
The help that Spring jdbc provides is by providing a framework to execute SQL. 
You can use jdbc templates to create tables and even fill them up. To do this, you need to write SQL statements and execute them with a JdbcTemplate.
When you use spring jdbc, you need to think about how you want that the database looks like and it will help you with creating these databases.
Because you are working on a rather low level, this also means that you have complete control over what will be created.

##### Example:
{% highlight java %}

    SingleConnectionDataSource dataSource = new SingleConnectionDataSource();
    dataSource.setDriverClassName("org.hsqldb.jdbcDriver");
    dataSource.setUrl("jdbc:hsqldb:data/jdbcexample");
    dataSource.setUsername("sa");
    dataSource.setPassword("");
        
    JdbcTemplate template = new JdbcTemplate(ds);
    template.execute("create table car (id int, model varchar)");
    template.execute("insert into car (id, model) values (1, 'Volkswagen Beetle')");
    
    dataSource.destroy();
    
{% endhighlight %}

#### Spring data jpa
Spring data jpa helps with the creation of your database structure. 
Spring data uses the concept of entities to determine which classes need to be saved to the database.
A class is seen as an Entity when it is annotated with the @Entity annotation.
The data of each entity class will standard be saved in a separate database table.
To define how the links in the classes need to be created in the database structure, other annotations can be added inside the entity classes.
The most common links are @OneToMany, @ManyToOne and @ManyToMany.
For example if class A has a @OneToMany relationship to class B then the database scheme will have a foreign key in table B to table A and hibernate will keep a list of linked B elements in entity A. 

These were just the basics of how to define your data structure. 
This was to illustrate how spring data jpa uses annotations on classes to create a database.
So with spring data jpa you don't have to write all the sql statements yourself to create your database schema, because this can be done automatically by spring data jpa.

This system has also some disadvantages. 
Spring data jpa gives you so many options that it is very easy to make a complicated, not easily understandable, schema.
For example it is easy to define a data structure with a many-to-many relationship or with bi-directional relationships, but when this is implemented in spring data jpa, you need to start thinking how this impacts the database.
In that example you need a intermediate table and reference use a reference to the unidirectional relationship.

##### Example:

{% highlight java %}

    @Entity
    public class Rental {
     
        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private Long id;
     
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "company_id")
        private RentalCompany company;
     
        // ...
     
    }
    
    @Entity
    public class RentalCompany {
     
        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private Long id;
     
        @OneToMany(fetch = FetchType.LAZY, mappedBy = "company")
        private List<Rental> rentals;
         
        // ...
    }

{% endhighlight %}


#### Spring data jdbc
When you use spring data jdbc, this will also help you with creating your database.
When you write spring data jdbc, like spring data jpa, you need to define a model and this model will be translated to create a database structure.
This model is somewhat different than the model of spring data jpa and you need to follow some other rules.
Before the explanation of the practical differences, you should know why the developers of spring data jdbc made most of the changes to this spring data framework.
They wanted to make a framework that is more understandable than spring data jpa and helps you with creating a better data design.
Therefore they tried to implements some concepts of DDD.

The first big difference is that we work with aggregates instead of entities.
If you don't know this concept or why it is useful, you can check some very good article about this: Effective Aggregate Design by Vaugn Vernon.
https://dddcommunity.org/library/vernon_2011/
Because we use aggregates we don't want a table for each class/entity, but one for each aggregate. 

We link classes together to form an aggregate with at the top the aggregate root, by using object references and the @ManyToOne annotation.
This makes it easy to define boundaries of the aggregate. 
If a class can't reach another class by using object references than they are not part of the same aggregate.
We can link aggregates together by using the id's of the aggregate roots. 

When spring data jdbc is used, @Entity annotations don't need to be used. 
When a class is used in a repository, spring data jdbc knows this is an aggregate root. 
Aggregate roots can also contain references to other classes, if they do, spring data jdbc knows that these are part of the aggregate.

You should also notice that only the @OneToMany and @OneToOne relations are supported in spring data jdbc.
This is done according to the theory behind aggregates. 
If spring data jdbc would allow to use @ManyToMany or @ManyToOne relations then it would be possible to reference aggregate root object from its child objects.
This would make it more unstructured than when only @OneToMany relations are allowed.
Again we don't use annotations to define what kind of relation it is, but it is implied when we use collections or reference another class.

In the following example you can see 2 aggregate roots RentalCompany and Car. 
Rental is part of the aggregate of RentalCompany.

##### Example:

{% highlight java %}

    public class RentalCompany {
    
        @Id
        private Long id;
    
        private String name;
        private Set<Rental> rentals;
    
    }
    
    public class Rental {
    
        @Id
        private Long id;
        
        private String renter;
        private Long carId;
        private LocalDate startDate;
        private LocalDate endDate;
    }
    
    public class Car {
    
        @Id
        private Long id;
        
        private String color;
        private String brand;
        private String model;
        private String licensePlate;
        private CarType type;
    }
    

{% endhighlight %}

### Querying the database
To know what information is stored inside our database, we need to query the database. The three frameworks I am comparing each have tools to help you with this.

#### Spring jdbc
The main tool that spring jdbc uses for querying is the jdbc template. You can use this for connecting to the jdbc and therefore the database.
The downside of using this is that it only provides the connection, everything else you need to do yourself.
If you search for objects, the mapping to java objects will need to be done by you using a self-written Rowmapper.
You will also need to do the exception handling yourself by creating a ExceptionTranslator.

I will show you a simple example of how a simple query is created that will contain data of objects.

##### Examples

This response coming from jdbc needs to be converted by using a mapper.

{% highlight java %}

    public class CarRowMapper implements RowMapper<Car> {
    
        @Override
        public Car mapRow(ResultSet resultSet, int rowNumber) throws SQLException {
            Car car = new Car();
     
            car.setId(resultSet.getInt("ID"));
            car.setColor(resultSet.getString("COLOR"));
            car.setBrand(resultSet.getString("BRAND"));
            car.setModel(resultSet.getString("MODEL"));
     
            return car;
        }
    }
    
{% endhighlight %}

This mapper can be passed to the jdbc template so the conversion can be used to get populated java objects.

{% highlight java %}

    List<Car> cars = jdbcTemplate.queryForObject(
        "SELECT * FROM CAR WHERE ID = ?", new Object[] {id}, new CarRowMapper());
    
{% endhighlight %}

#### Spring data jpa

When you use the spring data framework, it will help you with building your queries and getting the right information.
The spring data jpa framework uses hibernate. They make it possible to query the database using user friendly interfaces.
When you want to query the database, instead of writing the entire query yourself, hibernate will help you. 
To query the database you need to define a repository interface for the entity that you want to query. 
In that repository you need to define which methods you want to use. 

Some basic queries can be written using derived queries. An example of this is findById. 
For these methods spring data will generate the sql entirely on its own.

If you need to write more advanced queries that can't easily be defined as a derived query, you can define the query yourself using the @Query annotation.
Inside the @Query annotation you write jpql or sql statements. Jpql is an SQL like syntax which provides a layer on top regular sql. 
When jpql is used, it is possible for spring data to help you with handling the data. For example paging and sorting can be done by simply adding a parameter.

If you want to be a bit more in control, you can use sql by setting the the property native = true. 
Then you don't use this extra layer, but it then also can't help you anymore.

Apart from helping you with more easily defining which query you want to execute, it also helps you with fine tuning performance.
You are using entities when you query using spring data jpa. These entities have connections to other entities.
Spring data jpa will help you with defining if you want to return these connected entities directly or if you don't want to do that. 
It can help you with searching for these entities when you do need them.
This is called eager and lazy loading and this can all be managed by spring data jpa.

It will also try to improve performance by giving you the option to cache the results of these queries.
If you would have the same query, this cache can return the result instead of letting the database calculate it again.

Be aware that even though you use sql directly, you will still return entities that are managed by hibernate.

##### Examples

The service that calls a repository to get all rentals with a given CarType.

{% highlight java %}

    @Service
    public class RentalService {
    
        public RentalRepository rentalRepository;
    
        public RentalService(RentalRepository rentalRepository){
            this.rentalRepository = rentalRepository;
        }
    
        public List<Rental> getRentalsByCarType(Long rentalCompanyId, CarType carType) {
            return rentalRepository.findByCompanyIdAndCarType(rentalCompanyId, carType);
        }
    }
    
{% endhighlight %}

The repository uses a derived query to expose this functionality.

{% highlight java %}

    public interface RentalRepository extends PagingAndSortingRepository<Rental, Long> {
    
        List<Rental> findByCompanyIdAndCarType(Long rentalCompanyId, CarType carType);
    }
    
{% endhighlight %}

#### Spring data jdbc
@query is anders (jpql). Er is geen lazy loading. Geen caching.

Spring data jdbc sits closer to the database than spring data jpa but uses spring data concepts to make it easier for its users than spring jdbc. 

It sits closer to the database because it doesn't contain the most part of the spring data magic when querying the database. 
Currently when you want to add a method to your repository in spring data jdbc, you need to add an @Query annotation which contains the query.
This needs to be pure sql instead of jpql which is used in spring data jpa. You can compare this best with the native queries that are added to spring data jpa.
Because spring data jdbc sits so close to the database, it is like native queries in spring data jpa not possible to have paging and sorting repositories.
These types of repositories will be added in the future. This is like the derived queries functionality which is also not yet implemented but will be in the future.

When you query the application using spring data jdbc, instead of entities, you will receive the entire aggregate. 
This makes the application easier to understand. 
The application doesn't need to rely on an application context to keep the state of the entities updated. 
Because the entire objects are fetched, there aren't extra calls needed to receive the field values of objects that weren't loaded yet because all the fields are already filled in.
The disadvantage of this system could be that too much data will be loaded. 
But if that happens, it could be that the boundary of your aggregate is too big and it is possible that you need to split up your aggregate.

##### Examples

When we try to do the same thing as spring data jpa in spring data jdbc, then you need to go at it differently.
The first difference is that we can't use the RentalRepository because it does not exist. 
It does not exist because Rental is not an aggregate root, but is part of the aggregate with aggregate root RentalCompany. 
This is why we now need to use the RentalCompanyRepository.

{% highlight java %}

    @Service
    public class RentalCompanyService {
    
        public RentalCompanyRepository rentalCompanyRepository;
    
        public RentalCompanyService(RentalCompanyRepository rentalCompanyRepository){
            this.rentalCompanyRepository = rentalCompanyRepository;
        }
    
        public List<Rental> getRentalsByCarType(Long rentalCompanyId, CarType carType) {
            return rentalRepository.findByIdAndCarType(rentalCompanyId, carType);
        }
    }
    
{% endhighlight %}

The other difference is that we cannot use derived queries, so we need to use the @Query annotation.

{% highlight java %}

    public interface RentalRepository extends PagingAndSortingRepository<Rental, Long> {
    
        List<Rental> findByCompanyIdAndCarType(Long rentalCompanyId, CarType carType);
    }
    
{% endhighlight %}

### updating an instance

There are also different ways to update the data inside the applications.

#### Spring jdbc


#### Spring data jpa

#### Spring data jdbc
Geen dirty tracking


## Advantages of using spring data jdbc
### Better design
I have mentioned multiple times that spring data jdbc will help you with following Domain driven design principles. A great explanation why this design can help you can be found here: https://dddcommunity.org/library/vernon_2011/
small entities, only one-to-many relationships. Otherwise you need to use id's. You can easily see what is in aggregate. When you use objects it is in aggregate. 
If it is an id, it is not part of the aggregate. 1 repository per aggregate.


### Easier to understand
No lazy loading, no caches, ... You need to do more yourself. If you want to save something, you will need to call save. If you want to update something you 


### Performance
You can write your queries yourself which will executed exactly as you specified them into the database. 
This is for example different to spring data jpa which uses jpql.

## Should I use it?
Spring data jdbc is in my opinion a very nice addition to the spring data family with lot of potential. But currently I wouldn't yet recommend to use it in a live project because it still has some "children diseases" like some bugs.
It still doesn't offer named queries and some other functionalities that are very usefull when you want to use is.
But I would recommend to already play with it a bit because I think that it will have a bright future and currently the basis is already laid so when it breaks through you will have an advantage because you looked at it.