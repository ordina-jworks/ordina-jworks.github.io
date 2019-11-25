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

When we try to do the same thing as we did in spring data jpa in spring data jdbc, then you need to go at it differently.
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

There are also different ways to update the data inside the applications.

#### Spring jdbc

Spring jdbc again only provides a framework when updating data from the database. 
The jdbc template exposes an update method. This method can accept a query and optional parameters.

##### Example

A simple code example where we update the color of a given car. 

{% highlight java %}

    String query = "update Car set color = ? where id = ?";
    jdbcTemplateObject.update(query, color, id);

{% endhighlight %}


#### Spring data jpa

Spring data jpa provides more tools to update the data. As already mentioned does spring data jpa have an abstraction layer above the data, entities.
The state of these entities is stored in a persistence context.
By using this, spring data jpa is able to keep track of the changes to these entities.
It uses the information of these changes to keep the database up to date. 
Spring data jpa makes from these entities, managed entities.
Instead of always needing to create queries to update data in the database, we can edit these entities. 
These changes will than always be persisted automatically. 
This tracking is called dirty tracking because when you change the entities, these updates are making the entity "dirty" because the state is different than the data from the database.
When the hibernate session will be flushed, these changes will be persisted so they will be clean again.
This will only be done in transactional methods. 
If methods are not in a transactional context, it is the responsibility of the program to persist the changes.
This can be done by calling the save method on the repository. 

If you want to make bigger changes, it is also possible to create update methods in the repositories. 
Like querying the database and creating entities, you can also create methods in the repository. 
Using jpql you can create a query which can update multiple entities at once. 
Please make sure to add the @modifying annotation. 
This is a security measure so you can not modify something by mistake.

##### Example

If you should want to change the color on all hatchback cars, you can do this in different ways. I will give three.

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
           }
       }

{% endhighlight %}

if you do it without a transaction, you need to also add implementation to instruct hibernate to persist the changes.

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
               List<Car> carsWithType = carRepository.updateColorOfCarsWithCarType(rentalCompanyId, carType);
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


#### Spring data jdbc
Spring data jdbc does not have a persistence context like spring data jpa.
This makes Spring data jdbc in my opinion more straightforward than spring data jpa.
If you want to make changes to the data, you are responsible for handling the persistence.
If you do not call the save method in the repository, the changes will not be persisted.

You also have the choice to update the aggregates using self written queries. 
Like I already mentioned are these queries executed directly on the jdbc instead of using a hibernate layer.

Upating the data is done with the help of the aggregate abstraction where the aggregate root is responsible for persisting the aggregates under this root.
If you call the save method on the aggregate root, the entire aggregate will be persisted.

##### Examples

If we want to change the colors of all colors of a same type like we did in the example of spring data jpa.

You can do it like example 2 of spring data jpa.

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
           }
       }
       
       public interface CarRepository extends CrudRepository<Rental, Long> {
              
          @Query(value = "SELECT * "
                  "FROM Car car " +
                  "WHERE car.type = :carType ")
          List<Car> findByCarType(@Param("color") String color, @Param("carType")String carType);
      }

{% endhighlight %}

A other way you can do this is by an update query which is the same to spring data jpa in this example. 
If we would have wanted to update a part of an aggregate apart from the aggregate root, 
we would have needed to go through the aggregate root since the aggregate root manages the aggregate and there are only repositories for the aggregate roots.

{% highlight java %}

       @Service
       public class CarService {
       
           public CarRepository carRepository;
       
           public CarService(CarRepository carRepository){
               this.carRepository = carRepository;
           }
       
           @Transactional
           public List<Car> updateColorOfCarsWithCarType(CarType carType, String color) {
               List<Car> carsWithType = carRepository.updateColorOfCarsWithCarType(rentalCompanyId, carType);
           }
       }
       
       public interface CarRepository extends CrudRepository<Rental, Long> {
       
           @Query(value = "UPDATE Car car " +
                   "SET car.color = :color
                   "WHERE car.type = :carType ")
           List<Rental> updateColorOfCarsWithCarType(@Param("color") String color, @Param("carType")String carType);
       }

{% endhighlight %}


## Advantages of using spring data jdbc
### Better design
One of the biggest advantages that you can get from using spring data jdbc is that it will force you to follow the rules of DDD design like using aggregates.
A great explanation why this design can help you can be found here: https://dddcommunity.org/library/vernon_2011/

Because only one-to-many relationships are used, it makes it more easy to see what exactly are the relationships between the classes.
Classes can only be part of 1 aggregate. Together with the one-to-many rule makes it also impossible to create circle dependencies.
If you need to create relationships between aggregates, you need to use id's. This makes the coupling between the aggregates as small as possible.

I is also clear where the logic of the interactions with the data can be found because only the aggregate roots have repositories because they are responsible for these interactions.


### Easier to understand
Only the aggregate roots are responsible for handling the persistence. This makes it clear what needs to be persisted and who is responsible for doing this.
Because the persistence always needs to be initiated by calling the save method, it makes it easier to understand when changes will be persisted than with spring data jpa.

It is easy to see what classes are part of of an aggregate since aggregates are connected using object references. When id's are used, those classes are part of different aggregates.
When you query the database, instead of the lazy loading which is standard in spring data jpa, every call using spring data jdbc is done using eager loading. 
Every time you need data, a call to the database will be done because no caches are used.
Together these rules give that it is easy to know when a call to the database will be done (always), what parts of the data are returned from the database calls (entire aggregate) and it is easy to know what these aggregates are composed of.

Because you are responsible for saving when something needs to be saved, and when you do a call trough a repository, the entire aggregate is returned. 
This makes that you need to do a little bit more yourself, but it also makes that you are in complete control of the entire data flow.

### Performance
With spring data jdbc you have a little more control which query will be executed on the database since it is executed directly on the jdbc instead of going through a middle layer.
All the queries are eager, this is also an advantage because less queries need to be sent to the database.
With spring data jpa you have more possibilities for fine tuning performance because of the possibility of using the lazy loading and the usage of a cache.
Because of these possibilities it is also more difficult to create a configuration for a good performance.

## Should I use it?
Spring data jdbc is in my opinion a very nice addition to the spring data family with lots of potential. 
With the release of spring data jdbc 1.1 it became a lot more stable. If you know the rules to follow, it is now very easy to create a simple application using this technology.
There are already a lot of advantages of using spring data jdbc and these advantages will only grow when features will be added to it.

There are also some drawbacks. The biggest drawback is that it is rather new, version 1.0 was released less than 2 years ago. 
It is also still rather difficult to find a lot of information about this technology so if you will use this technology you will need to reserve some time to experiment.

In this case I would advise to at least try the technology out because of the big potential.
I have had a lot of fun trying out this technology and I noticed that it really helped me creating a good application.
This technology hits a sweet spot between spring jdbc and spring data jpa by using the good parts of both. On top of that they also added some nice DDD principles.

So in short, go out and try out this technology!