---
layout: post
authors: [dennis_herremans, koen_vandenbossche]
title: 'Data Warehouse in the Cloud'
image: /img/2020-04-29-datawarehouse_in_cloud/datascience.jpg
tags: [Architecture]
category: Architecture
comments: true
---

# Introduction

Almost all the companies have a kind of data warehouse available for reporting purposes. 
Those reporting environments are most of the time hosted in an on-premise infrastructure, nowadays a lot of companies are investing money to upgrade their existing environment to a more flexible and scalable infrastructure that is hosted in the cloud. 
This can be the Azure Cloud, AWS, Google Cloud, etc.
Not only the Data Warehouse itself is important, we need to look at the complete picture.

# DataOps

DataOps can help to give better insights, reduce the time to go to production and help in creating the whole package due to its process-oriented methodology. 
Different teams will work more intense together to im-prove the quality of the delivered value. 

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2020-04-29-datawarehouse_in_cloud/dataops.png' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto; max-width:100%">
{: refdef}

Data is moved from the source to the Factory (Data Warehouse). 
In this factory a lot of steps and processes will take place to improve the quality of the data and gain us insights into how the data flows.

<b>Quality:</b> The quality of data must be guaranteed; this can be done through automated tests during the processing of the data. Statistical Process Control (SPC) is there to monitor and control the data analytics pipeline.

<b>Centralization & Freedom:</b> The data is stored in a central place, which will give the different users (Data Engineer, Data Analysts. Data Scientists, Data Visualization users, Business users) the ability to play with the data to create insights on the data. Those new insights can result in new processes that needs to be implemented to make them available for all users.

<b>Catalog:</b> A data catalog will be one of the crucial parts. The catalog maps the complete data lineage. It gives visibility on how the data has been transformed during the whole process, and the catalog contains all the definitions.

<b>Automation:</b> The days of installing new versions of software or processing logic manually must be mini-mal. Automation can be implemented to improve the time to go to production. Continuous Integration (CI) and Continuous Delivery/Deployment (CD) are key here. Azure DevOps can be used for creating the CI/CD pipelines.

<b>Security & Privacy:</b> Data needs to be protected to make sure that not everybody may/can see all the data. Also, the data must be GDPR complaint. Some questions to ask here: “Can we restore production data on our other environment without anonymization?”, “Do we need all the data in another environment?”, “Who can access what data?”

<b>Monitor & Improve:</b> In every process monitoring is key to improve the quality of the implemented pro-cesses and helps to guide the team to deliver more and better products. 

At the end of the factory chain Value is delivered to the end-users in the form of Actionable dashboards that will provide them insights on the data that can be used for further analysis. 


# Data Warehouse
 
When a new modern Data Warehouse needs to be designed. 
It is important to create a cloud and technology agnostic architecture. 
The tools to use, the platform that is needed, are less important. 
The picture below shows the different phases and how the data flows

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2020-04-29-datawarehouse_in_cloud/dataphases.png' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto; max-width:100%">
{: refdef}
 
### Source Systems
You need to consider all the sources that are available for designing the data warehouse. 
It can be existing sources that are hosted on on-premise infrastructure or already in the cloud. 
IoT devices are becoming more and more popular these days. 
These devices generate a lot of data and the system needs to be able to process/store large amounts of data.
### Data Ingestion
What technology can we use to ingest the data from the sources to a Information Reservoir (Storage system)? 
Processing Streaming Data requires a different approach than data that only needs to be processed once or several times a day/week.
### Information Reservoir & Processing
Where do we need to store the Ingested data? 
That depends on the kind of data that is processed. 
When processing structured data, a relational database might be a good idea. 
But what to do with unstructured data? 
This data shouldn’t be stored in a database and the choice should maybe better go to a kind of file system.  
### Information Consumption & Analytic Methods
This phase in the process is not always required, because the business is not ready to do some Data Science and Machine learning. 
When in the design phase it might be a good idea to think about it. 
What is not needed now may be applicable within a few weeks or months. 
### Data Access & Target Applications
The main question here is: How will the processed data be made available to all the end users? 
It is possible that you need to support different kind of tools. 
MS Excel is the most used BI-tool for analyzing data if you want attractive and interactive dashboards another visualization tool is needed like Power BI or Tableau.

# Choosing the Technology and Tools

After the global picture is completed, and all the phases are cleared out, it is time to choose the platform and components that are needed. 
The picture below shows an example of a Modern Data Warehouse in the Azure Cloud. 

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2020-04-29-datawarehouse_in_cloud/moderndwh.png' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto; max-width:100%">
{: refdef}

1.	The structured and unstructured data will be ingested in the Data Lake Storage Gen2 using Azure Data Factory.
-	Data Lake Storage Gen2 is the world’s most productive Data Lake. It combines the power of a Hadoop compatible file system with the integrated hierarchical namespace with the massive scale and economy of Azure Blob Storage to help speed your transition from proof of concept to production
-	Azure Data Factory is a cloud-based data integration service that allows you to create data-driven workflows in the cloud for orchestrating and automating data movement and data transformations.
2.	Ingested data needs to be clean and maybe the data must be transformed and combined with oth-er data. For example, some unstructured and structured data must be combined to create a clean dataset.
-	Azure Databricks is an Apache Spark-based analytics platform optimized for the Azure cloud platform. It is an interactive workspace that can be set up in minutes, auto scales and collabo-rates on shared projects. It supports languages such as SQL, Java, Python, Scala and R as well as other Data Science libraries such as TensorFlow and PyTorch. 

3.	The cleaned data must be ingested in the DWH, as DWH we choose Azure Synapse Analytics (Former Azure SQL Data Warehouse). For filling the Data Warehouse PolyBase or Azure Data Fac-tory can be used. 
The stored data in the DWH can be modelled with Data Vault 2.0, or a star schema. Our preferred choice is storing the data in a Data Vault model. This gives us much more flexibility.
Optionally one or more Data Marts can be created. It is not required to store the Data Marts physi-cally, virtual Data Marts are also possible
-	Azure Synapse Analytics is the fast, flexible and trusted cloud data warehouse that lets you scale, compute and store elastically and independently, with a massively parallel processing architecture.
4.	The stored data, from the DWH or the Data Marts is the source of our data visualization tool. Be-cause we have chosen to use the Microsoft stack, Power BI is our chosen tool for this purpose.

The picture above does not contain all the needed components. 
Another component that is required in all our approaches is Azure Key Vault. 
This component will store all our connection strings, Certificates, Secrets and Keys. 
To secure your resources, Azure Private links enables you to access resources over a private endpoint in your own virtual network.

The architecture can easily be extended to enable Data Science.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2020-04-29-datawarehouse_in_cloud/dwhdatascience.png' | prepend: site.baseurl }}" alt="Workspace" class="image" style="margin:0px auto; max-width:100%">
{: refdef}

Scalable machine learning/deep learning techniques will derive deeper insights in the data using Python, Scala or R using notebooks in Azure Databricks. 
To create insights the (un)cleaned data and even the data stored in our DWH is used. Results can be stored back in the Data Lake or in the DWH, and Power BI is also be able to connect directly to your Databricks environment.