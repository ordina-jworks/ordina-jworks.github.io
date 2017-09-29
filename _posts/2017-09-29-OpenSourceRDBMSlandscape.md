Open Source RDBMS landscape

This article will focus on the 2 most popular open source RDBMS systems MySQL and PostgreSQL. 
WHen discussing MySQL we will also treat the forks that have been derived from the most popular Open Source RDBMS, as those forks 
are becoming more and more popular as well (especially MariaDB) 




1. MySQL

1.1. Brief history

     MySQL is the most popular open Source RDBMS system today. It exist for more than 22 years now. Release 1.0 was released in 1995 togheter with the 
     creation of the MySQL AB company, who owned and sponsered the MySQL project. 
     In 2001 InnoDB became the storage engine of MySQL. Today InnoDB is still the default storage engine of MySQL.
     InnoDB was a product of Innobase Oy a rather small Finnish company that was acquired by Oracle back in October 2005.

     Sun Microsystems acquired MySQL AB in 2008
     Oracle acquired Sun Microsystems on 27 January 2010
     InnoDB provides the standard transaction features and Foreign key support

1.2 Forks of MySQL

   1.2.1 MariaDB

         MariaDB is a database server that offers drop-in replacement functionality for MySQL. Just like Percona Server
         It was started by the founder of MySQL, Michael Widenius, after Oracle acquired Sun Microsystems (which had bought MySQL in 2008) in late 2009, early 2010.


         By default, until MariaDB 10.1, MariaDB uses the XtraDB storage engine

         From MariaDB 10.2, InnoDB is the default.

    1.2.2 Percona

         Percona is the company that hosts the yearly Open Source Database Conferences in the US and in Europe.
         Percona Server for MySQL is a variant of the MySQL relational database management system and is a drop-in MySQL replacement.
         Percona created an enhanced storage engine for MySQL & MariaDB, namely XtraDB. XtraDB is part of the Percone Server and MariaDB




2. PostgreSQL


https://www.percona.com/software/mysql-database/percona-server/feature-comparison


 Storage engines

 Storage engines are MySQL components that handle the SQL operations for different table types

 InnoDB 


350 attendees
140 speakers

MySQL / MariaDB Sessions

Monitoring MySQL Performance with Percona Monitoring and Management (PMM)
Hands on ProxySQL
MySQL in a Nutshell! (Part 1 & 2)
Percona XtraDB Cluster 5.7 Tutorial
Practical Orchestrator Tutorial
Implementing MySQL Security Features
InnoDB Architecture and Performance Optimization
MySQL InnoDB Cluster and Group Replication in a Nutshell: Hands-On Tutorial
ORM: friend or foe?
Recursice Common Table Expresssions in MySQL 8.0 (Part 1 & 2)
MySQL on Docker (Containerizing the Dolphin)
Why choose Percona Server for MySQL
ProxySQL Use Case Scenarios
Advanced Sharding Solutions with ProxySQL
Moving data in Real Time into Cassandra, Kafka and Elasticsearch
Heterogeneous Replication Between MySQL and MongoDB Using Tungsten Replicator
Inexpensive Datamasking for MySQL with ProxySQL - Data Anonymization for Developers
Why MySQL Replication Fails, and How to Get it Back
Migrating to Vitess at (Slack) Scale
Migrating from MariaDB to Percona Server: An E-Commerce Web Story
How to Make MySQL for the Cloud
Percona XtraDB Cluster 5.7 Enhancements - Performance, Security and More
MySQL 8.0: Atomic DDLs - Implementation and Impact
MySQL Replication Performance Tuning for Fun and Profit!
MySQL Backup Best Practices and Case Study: .IE Continuous Restore Process
Visualize Your Data With Grafana
Utilizing ProxySQL for Connection Pooling in PHP
MySQL Troubleshooting and Performance Optimization with PMM
MySQL Document Store and Node.JS
Collations in MySQL 8.0
MySQL Load Balancers - MaxScale, ProxySQL, HAProxy, MySQL Router & nginx - a close up look
How to Backup at Petabyte Scale When Every Transaction Counts
Rolling out Database-as-a-Service using ProxySQL and Orchestrator
MyRocks Internals and Production Deployment at Facebook





History of MySQL

MySQL is 22 years old (May 1995), it is an mature ecosystem. 

Percona Server 9 year old (november 2008)

MariaDB server (7 years old - February 2010)

2001 - InnoDB Storage engine






MongoDB Shootout : MongoDB Atlas, Azure CosmosDB and Doing It Yourself

Elasticsearch (R)Evolution - You Know, for Search...



