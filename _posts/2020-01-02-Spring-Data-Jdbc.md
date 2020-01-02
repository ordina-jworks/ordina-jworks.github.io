---
layout: post
authors: [wout_meskens]
title: 'An Introduction to Spring Data JDBC'
image: /img/spring.png
tags: [Java, Spring, Data, JDBC, JPA]
category: Java
comments: true
---

> A new member is added to the Spring Data family. Spring Data JDBC is positioned between Spring Data JPA and Spring JDBC using the best elements of both.
> This post will describe the current state and the future of this product. It will also explain which problems this product is trying to solve and how.

# Table of content

* [Spring JDBC vs Spring Data JDBC vs Spring Data JPA](#product-comparison)
* [Current state](#current-state)
* [DDD principles](#ddd-principles)

## Introduction
Spring Data JDBC is a new member of the Spring Data family. 
It is created to fill a void that sits between Spring JDBC and Spring Data JPA.
If you look at Spring JDBC, you could argue that it is too low level to work because it only helps with the connection to the database.
Spring Data JPA could seem too complex because it gives you a lot of options and it can be difficult to master all these options. 
Spring Data JDBC is a framework that tries to give you the same power you get from using Spring Data JPA but makes it more understandable by using DDD principles.
It also gives you more control by working on a lower level and by letting you decide when database interactions need to be done like Spring JDBC, but in an easier way. 
In the rest of this article the differences between Spring Data JPA, Spring Data JDBC and Spring JDBC will be shown.
This will hopefully show you that Spring Data JDBC is a very nice product with a lot of potential that is designed to help you.

## Spring JDBC vs Spring Data JDBC vs Spring Data JPA

### Project Differences
Spring JDBC, Spring Data JPA and Spring Data JDBC are all three based on a different mindset. 
Based on these mindsets, you can see differences on how these technologies need to be used and how some parts need to structured.
Spring JDBC only helps with the connection to the database and with executing queries on this database.
Spring Data JPA want to help you with managing your jpa based repositories. 
It wants to remove boilerplate code, make implementation speed higher and provide help for the performance of your application.
Spring Data JDBC wants to also provide help with access to relational databases, but wants to keep the implementations less complex.

#### Spring JDBC
The help that Spring JDBC provides is by providing a framework to execute SQL. 
Spring JDBC handles the connection with the database and lets you execute queries using JdbcTemplates.
This solution is very flexible because you have complete control over the executed queries.
You are also free to define your class structure because you are in complete control of the mapping.

#### Spring Data JPA
Spring Data JPA uses entities, so the class structure needs to be comparable with the database structure because some mapping is done automatically.
In the most simple form, the database tables will each represent an entity and can be mapped almost directly on an entity class.
This mapping can be done by using java configuration. By using annotations you can define on which table the class is mapped but also how the tables are linked together.

A class is seen as an Entity when it is annotated with the @Entity annotation.
The most common links are @OneToMany, @ManyToOne and @ManyToMany.
For example if class A has a @OneToMany relationship to class B then the database scheme will have a foreign key in table B to table A and the JPA implementation will keep a list of linked B elements in entity A.
There are almost no restrictions on how entities can be linked together.
This means there is total freedom to design your class structure how you want, but it also means that you need to be wary that you don't cause problems like circular dependencies.
It also means that nothing prevents you from creating a complex structure which is not easily understandable, especially understanding how your class structure translates to your database structure.
So you will always need to think how your class structure decisions impact your database.

For example it is easy to define a data structure with a many-to-many relationship or with bi-directional relationships. 
When you translate this to your database structure you will need intermediate tables and create references to the unidirectional relationships.

##### Example:

In this example there are some classes that can be used in Spring Data JPA. 
They represent a part of the domain model that will also be used in the rest of this article.
A RentalCompany contains rentals. These rentals hold the information about which Car is rented and when.

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


#### Spring Data JDBC
When you use Spring Data JDBC, you will also need to create entity classes which will be mapped to the database.
The big difference is that there are more rules that you need to follow when you create the class structure.
The class structure needs to follow the rules of aggregate design of DDD.
Spring data enforces this because this will lead to the creation of more simple and understandable projects.
If you don't know this concept or why it is useful, you can check some very good article about this: [Effective Aggregate Design by Vaugn Vernon](https://dddcommunity.org/library/vernon_2011/){:target="_blank" rel="noopener noreferrer"}.
Basically we group different entities together which have a strong coupling and we call them aggregates.
The top entity of the aggregate is called the aggregate root.
There are some other rules that needs to be followed:
An entity can only be part of 1 aggregate and all relations inside an aggregate need to be unidirectional and the aggregate root need to manage the top relation.

This means that by following links starting from the aggregate root, every entity inside the aggregate can be found.
Because of this, we do not need a repository for each entity like in Spring Data JPA, but only for the aggregate roots.
To link entity classes together to form an aggregate, you need to use object references.
Entity classes inside an aggregate can only have one-to-one relationships and one-to-many relationships. 
If you have a one-to-one relationship your entity only needs an object reference to the other object. 
When you have a one-to-many relationship your entity needs to contain a collection of object references.
To create relations to entities outside the aggregate, id's need to be used to get a low coupling between these classes.

A big difference in creating the classes used by Spring Data JDBC versus Spring Data JPA is that no @Entity and no relation annotations like @OneToMany need to be used.
Spring Data JDBC knows a class is an aggregate root when it contains a repository for that class. 
And because of the rules that the aggregate entities are connected through object references, Spring Data JDBC also knows what the aggregates are and can transfer data to the database as aggregates.

##### Example:
In the following example you can see how the domain model that was introduced in the example of Spring Data JPA can be implemented in Spring Data JDBC.
In this implementation there are 2 aggregate roots RentalCompany and Car. 
Rental is part of the aggregate of RentalCompany. 
This domain model will also be used in the other examples inside this article to compare the differences between the three frameworks.

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

### Inserting data
For the insertion of data you need to use the tools that were created in the previous section. 
If you use Spring JDBC you will write queries that are executed directly on the database by JdbcTemplate.
If you insert data with Spring Data JPA or Spring Data JDBC, you can use the entity or aggregate system that was created.

#### Spring JDBC
With Spring JDBC you write your insert statements yourself and execute them with a JdbcTemplate.
The advantage of writing all the queries yourself, is that you have complete control over them.

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

#### Spring Data JPA
If you use Spring Data JPA for inserting data, you will need to use the repositories and the entities.
This makes it possible to think on a higher level and let Spring Data JPA handle the creation of queries.
When you want to create data for an entity, the only thing you need to do is create an object with the correct values and call the save method on your Spring Data repository.
Spring Data JPA will then look at your entities with all their annotations to map them to the necessary insert or update statements.

##### Example

The example below shows how to insert `Rental` data in the database with Spring Data JPA.

{% highlight java %}

    @Service
    public class RentalService{
        
        private RentalRepository rentalRepository;
        
        public RentalService(RentalRepository rentalRepository){
            this.rentalRepository = rentalRepository;
        }
        
        public Rental create(Rental rental){
            return rentalRepository.save(rental);
        }
    }
    
{% endhighlight %}

#### Spring Data JDBC
Spring Data JDBC uses a syntax that is comparable to Spring Data JPA.
The biggest differences are under the hood.
The management of the persistence is handled by the repository like in Spring Data JPA, but only the aggregate root has a repository.
This means that if you want to insert or update data, the entire aggregate needs to be saved.
You will need to to call the save method of the repository of the aggregate root and this will first save the aggregate root and then all of the referenced entities get saved.
If you want to insert only a part of an aggregate, for example only create a new Rental, then the whole aggregate will be updated and the referenced entities will be deleted and inserted again.

##### Example

The example shows how a `Rental` is added. If you want to create a new instance of the aggregate root, then the code is comparable to that of Spring Data JPA.

{% highlight java %}

    @Service
    public class RentalCompanyService{
        
        private RentalCompanyRepository rentalCompanyRepository;
        
        public RentalCompanyService(RentalCompanyRepository rentalCompanyRepository){
            this.rentalCompanyRepository = rentalCompanyRepository;
        }
        
        public RentalCompany addRental(Rental rental, Long rentalCompanyId){
            RentalCompany rentalCompany = rentalRepository.findById(rentalCompanyId);
            rentalCompany.getRentals().add(rental);
            return rentalRepository.save(rentalCompany);
        }
    }

{% endhighlight %}


### Querying the database
To retrieve data from our database, we write queries.
Spring JDBC will let you use the `JdbcTemplate` and let you map the result with a rowmapper.
Spring Data JDBC and Spring Data JPA will also let you create queries, using JPQL or SQL queries, but you will write them in the repositories and the frameworks will help you with the mapping.

#### Spring JDBC
The main tool that Spring JDBC uses for querying is the `JdbcTemplate`.
The downside of using this is that it only provides the connection, everything else you need to do yourself.
If you search for objects, you will need to map the results to java objects by implementing a `RowMapper`.
You will also need to do the exception handling by creating a ExceptionTranslator.

I will show you a simple example of how a query is created.

##### Examples

This response needs to be mapped by implementing a `RowMapper`.

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

This mapper can be passed to the `JdbcTemplate` that will use it to create populated java objects.

{% highlight java %}

    List<Car> cars = jdbcTemplate.queryForObject(
        "SELECT * FROM CAR WHERE ID = ?", new Object[] {id}, new CarRowMapper());
    
{% endhighlight %}

#### Spring Data JPA

When you use the Spring Data framework, it will help you with building your queries and fetching the right data.
The Spring Data JPA framework uses implementations of the jpa specifications like Hibernate. They make it possible to query the database using user friendly interfaces.
When you want to query the database, instead of writing the entire query yourself, Hibernate will help you. 
There are multiple ways to query the database using Spring Data JPA, but they all need you to extend the repository of the entity you want to query.

Some basic queries can be written using derived queries. An example of this is findById. 
For these methods Spring Data will generate the SQL entirely on its own. More information about how derived queries can be defined can be found in the [spring data documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.query-methods.details){:target="_blank" rel="noopener noreferrer"}.

If you need to write more advanced queries that can't easily be defined as a derived query, you can define the query yourself using the @Query annotation.
Inside the @Query annotation you write JPQL or SQL statements. JPQL is an SQL like syntax that provides an abstraction layer on top regular SQL. 
When JPQL is used, it is possible for Spring Data to help you with handling the data. For example paging and sorting can be done by simply adding a parameter.

If you want to have a bit more control, you can use SQL by setting the native property of the `@Query` annotation to true. 
Then you don't use this extra layer, but it then also can't help you anymore.
Be aware that even though you use SQL directly, you will still return entities that are managed by Hibernate.

Apart from helping you with more easily defining which query you want to execute, it also helps you with fine tuning performance.
You are using entities when you query using Spring Data JPA. These entities have connections to other entities.
Spring Data JPA will help you with defining whether you want to return these connected entities directly or not. 
It can help you with searching for these entities when you do need them.
This is called eager and lazy loading and this can all be managed by Spring Data JPA.

It will also try to improve performance by giving you the option to turn on the query cache.
When this is turned on, Spring Data JPA will try to reuse the generated SQL queries, and if possible the results of these queries.

##### Examples

The service that calls a repository to get all rentals with a given CarType.

{% highlight java %}

    @Service
    public class RentalService {
    
        private RentalRepository rentalRepository;
    
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

#### Spring Data JDBC
Spring Data JDBC has less abstractions than Spring Data JPA, but uses Spring Data concepts to make it easier to do CRUD operations than Spring JDBC.

It sits closer to the database because it does not contain the most part of the Spring Data magic when querying the database.
Every query is executed directly on the JDBC and there is no lazy loading or caching, so when you query the database, it will return the entire aggregate.

Currently when you want to add a method to your repository in Spring Data JDBC, you need to add an @Query annotation which contains the query.
This needs to be pure SQL instead of JPQL which is used in Spring Data JPA. You can compare this best with the native queries that are added to Spring Data JPA.
Because Spring Data JDBC sits so close to the database, it is like native queries in Spring Data JPA not possible to have paging and sorting repositories.
These types of repositories will be added in the future. This is like the derived queries functionality which is also not yet implemented but will be in the future.

When you query the application using Spring Data JDBC, instead of entities, you will receive the entire aggregate. 
This makes the application easier to understand. 
The application doesn't need to rely on an application context to get the state of properties of returned entities.
Because the entire objects are fetched, there are no extra calls needed to receive the field values of objects that were not loaded yet because all the fields are already filled in.
The disadvantage of this system could be that too much data will be loaded. 
But if that happens, it could be that the boundary of your aggregate is too big and it is possible that you need to split up your aggregate.

##### Examples

When we try to do the same thing as we did in Spring Data JPA in Spring Data JDBC, then you need to go at it differently.
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

    public interface RentalCompanyRepository extends CrudRepository<RentalCompany, Long> {
    
        @Query(value = "SELECT * " +
                "FROM Rental rental " +
                "JOIN Car car ON car.id = rental.car_id " +
                "WHERE rental.rental_company = :companyId " +
                "AND car.type = :carType")
        List<Rental> findRentalsByIdAndCarType(@Param("companyId") Long companyId, @Param("carType")String carType);
    }
    
{% endhighlight %}

### updating an instance

When you want to update an instance in the database, you will need to write a query and execute it using the `JdbcTemplate` or use the domain model in Spring Data JPA or Spring Data JDBC.

#### Spring JDBC

Spring JDBC again only provides a framework when updating data from the database. 
The `JdbcTemplate` exposes an update method. This method can accept a query and optional parameters.

##### Example

A simple code example where we update the color of a given car. 

{% highlight java %}

    String query = "update Car set color = ? where id = ?";
    jdbcTemplateObject.update(query, color, id);

{% endhighlight %}


#### Spring Data JPA

Spring Data JPA provides more tools to update the data, like the proxy around the entities.
The state of these entities is stored in a persistence context.
By using this, Spring Data JPA is able to keep track of the changes to these entities.
It uses the information of these changes to keep the database up to date. 
Spring Data JPA makes managed entities from these entities.
Instead of always needing to create queries to update data in the database, we can edit these entities. 
These changes will than always be persisted automatically. 
This tracking is called dirty tracking because when you change the entities, these updates are making the entity "dirty" because the state is different than in the database.
When the Hibernate session is flushed, these changes will be persisted, and the entity will be "clean" again.
This will only be done for changes within a transaction. 
If the changes are not done within a transactional context, you will have to call the save method of the repository to persist those changes.

If you want to make bigger changes, it is also possible to create update methods in the repositories. 
Like querying the database and creating entities, you can also create methods in the repository. 
Using JPQL you can create a query which can update multiple entities at once. 
Please make sure to add the @modifying annotation. 
This is a security measure so you can not modify something by mistake.

##### Example

If you want to change the color on all hatchback cars, you can do this in different ways. I will give three.

If you do it in a transaction, the dirty tracking will take care of the changes.

{% highlight java %}

       @Service
       public class CarService {
       
           public CarRepository carRepository;
       
           public CarService(CarRepository carRepository){
               this.carRepository = carRepository;
           }
       
           @Transactional
           public List<Car> updateColorOfCarsWithCarType(CarType carType, String color) {
               List<Car> carsWithType = carRepository.findByCarType(rentalCompanyId, carType);
               for(Car currentCar : carsWithType){
                    currentCar.setColor(color);
               }
               return carsWithType;
           }
       }

{% endhighlight %}

If you do it without a transaction, you need to also add an implementation to instruct Hibernate to persist the changes.

{% highlight java %}

       @Service
       public class CarService {
       
           public CarRepository carRepository;
       
           public CarService(CarRepository carRepository){
               this.carRepository = carRepository;
           }
       
           public List<Car> updateColorOfCarsWithCarType(CarType carType, String color) {
               List<Car> carsWithType = carRepository.findByCarType(rentalCompanyId, carType);
               for(Car currentCar : carsWithType){
                    currentCar.setColor(color);
                    carRepository.save(currentCar);
               }
               return carsWithType;
           }
       }

{% endhighlight %}

A third way you can do this is by queries.

{% highlight java %}

       @Service
       public class CarService {
       
           public CarRepository carRepository;
       
           public CarService(CarRepository carRepository){
               this.carRepository = carRepository;
           }
       
           @Transactional
           public List<Car> updateColorOfCarsWithCarType(CarType carType, String color) {
               return carRepository.updateColorOfCarsWithCarType(rentalCompanyId, carType);
           }
       }
       
       public interface CarRepository extends CrudRepository<Rental, Long> {
       
           @Modifying
           @Query(value = "Update Car car " +
                   "SET car.color = :color "
                   "WHERE car.type = :carType ")
           List<Car> updateColorOfCarsWithCarType(@Param("color") String color, @Param("carType")String carType);
       }

{% endhighlight %}


#### Spring Data JDBC
Spring Data JDBC does not have a persistence context like Spring Data JPA.
This makes Spring Data JDBC in my opinion more straightforward than Spring Data JPA.
If you want to make changes to the data, you are responsible for handling the persistence.
If you do not call the save method in the repository, the changes will not be persisted.

You also have the choice to update the aggregates using self written queries. 
Like I already mentioned, these queries are executed directly on the database, without the use of an abstraction like Hibernate.
Updating the data is done by calling the save method on the repository of the aggregate.

Because Spring Data JDBC does not contain a persistence context like Spring Data JPA, it does not know which part of the aggregate is updated. 
Therefore it will update the aggregate root and delete all the referenced entities and save them all again.
This has as a downside that sometimes entities will be deleted and inserted event if they were not updated, which could be a waste of resources.
The big advantage is that you are sure that the entire entity will be up to date after saving the aggregate.

##### Examples

If we want to change the colors of all colors of a same type like we did in the example of Spring Data JPA.

You can do it like example 2 of Spring Data JPA.

{% highlight java %}

       @Service
       public class CarService {
       
           public CarRepository carRepository;
       
           public CarService(CarRepository carRepository){
               this.carRepository = carRepository;
           }
       
           public List<Car> updateColorOfCarsWithCarType(CarType carType, String color) {
               List<Car> carsWithType = carRepository.findByCarType(rentalCompanyId, carType);
               for(Car currentCar : carsWithType){
                    currentCar.setColor(color);
                    carRepository.save(currentCar);
               }
               return carsWithType;
           }
       }
       
       public interface CarRepository extends CrudRepository<Rental, Long> {
              
          @Query(value = "SELECT * "
                  "FROM Car car " +
                  "WHERE car.type = :carType ")
          List<Car> findByCarType(@Param("color") String color, @Param("carType")String carType);
      }

{% endhighlight %}

Another way you can do this is by an update query which is the same as the Spring Data JPA example. 
If we want to update a part of an aggregate, 
we would need to go through the aggregate root since the aggregate root maintains consistency for the whole aggregate.

{% highlight java %}

       @Service
       public class CarService {
       
           public CarRepository carRepository;
       
           public CarService(CarRepository carRepository){
               this.carRepository = carRepository;
           }
       
           @Transactional
           public List<Car> updateColorOfCarsWithCarType(CarType carType, String color) {
               return carRepository.updateColorOfCarsWithCarType(rentalCompanyId, carType);
           }
       }
       
       public interface CarRepository extends CrudRepository<Rental, Long> {
       
           @Query(value = "UPDATE Car car " +
                   "SET car.color = :color
                   "WHERE car.type = :carType ")
           List<Rental> updateColorOfCarsWithCarType(@Param("color") String color, @Param("carType")String carType);
       }

{% endhighlight %}


## Advantages of using Spring Data JDBC
### Better design
One of the biggest advantages that you can get from using Spring Data JDBC is that it will force you to follow the rules of DDD design like using aggregates.
A great explanation why this design can help you can be found here: https://dddcommunity.org/library/vernon_2011/

Because only one-to-many relationships are used, it makes it more easy to see what exactly are the relationships between the classes.
Classes can only be part of 1 aggregate. Together with the one-to-many rule this makes it impossible to create circular dependencies.
If you need to create relationships between aggregates, you need to use id's. This makes the coupling between the aggregates as small as possible.

It is also clear where the logic of the interactions with the data can be found because only the aggregate roots have repositories because they are responsible for these interactions.


### Easier to understand
Only the aggregate roots are responsible for handling the persistence. This makes it clear what needs to be persisted and who is responsible for doing this.
Because the persistence always needs to be initiated by calling the save method, it makes it easier to understand when changes will be persisted than with Spring Data JPA.

It is easy to see what classes are part of of an aggregate since aggregates are connected using object references. When id's are used, those classes are part of different aggregates.
When you query the database, instead of the lazy loading which is standard in Spring Data JPA, every call using Spring Data JDBC is done using eager loading. 
Every time you need data, a call to the database will be done because no caches are used.
Together these rules give that it is easy to know when a call to the database will be done (always), what parts of the data are returned from the database calls (entire aggregate) and it is easy to know what these aggregates are composed of.

Because you are responsible for saving when something needs to be saved, and when you do a call trough a repository, the entire aggregate is returned. 
This makes that you need to do a little bit more yourself, but it also makes that you are in complete control of the entire data flow.

### Performance
With Spring Data JDBC you have a little more control which query will be executed on the database since it is executed directly on the JDBC instead of going through a middle layer.
All the queries are eager, this is also an advantage because less queries need to be sent to the database.
But because Spring Data JDBC does not have a persistence context, when creating or updating entities in an aggregate, currently this is accomplished by deleting and again saving these entities which could mean that sometimes unnecessary operations will be executed.
With Spring Data JPA you have more possibilities for fine tuning performance. For example with the possibility of using the lazy loading and the usage of a cache.
Because of these possibilities it is also more difficult to create a configuration for a good performance.

## Should I use it?
Spring Data JDBC is in my opinion a very nice addition to the Spring Data family with lots of potential. 
With the release of Spring Data JDBC 1.1 it became a lot more stable. If you know the rules to follow, it is now very easy to create a simple application using this technology.
There are already a lot of advantages of using Spring Data JDBC and these advantages will only grow when features will be added to it.

There are also some drawbacks. The biggest drawback is that it is rather new, version 1.0 was released less than 2 years ago. 
It is also still rather difficult to find a lot of information about this technology so if you will use this technology you will need to reserve some time to experiment.

In this case I would advise to at least try the technology out because of the big potential.
I have had a lot of fun trying out this technology and I noticed that it really helped me creating a good application.
This technology hits a sweet spot between Spring JDBC and Spring Data JPA by using the good parts of both. On top of that they also added some nice DDD principles.

So in short, go out and try out this technology!