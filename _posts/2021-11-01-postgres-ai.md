---
layout: post
authors: [pieter_vincken]
title: 'Testing with production data made easy'
image: /img/20211101-postgres-ai/db-lab.png
tags: [cloud, automation, testing]
category: Cloud
comments: true
---

- What's the problem?
- What is DBLab?
- How does it work?
- End user interaction
- Behind the curtains
- How to setup
- How to use it
- More cool features
- Why should I use it?
- Links

## What's the problem?

Testing software is a whole discipline on its own. 
Writing automated tests has been a best practice for long enough now that we can assume it to be everywhere.
Writing good automated tests is hard, writing software that's testable is even harder. 
Properly combining the two is a challenge for every company and project. 

A trade-off has to be made between investing in writing test code and time. 
As we all know and have seen time and time again, finding this balance is a hard challenge. 
Spending too much time on testing eats into your feature development.
But spending too little time on testing creates more bugs, which leads to incidents which, you guessed it, eats into your feature development budget.

So the ideal world is the one where we can write tests to maintain high enough code quality to prevent bugs, but also not writing so many that feature development completely halts. 

Testing data migrations is one of the cases where investing in good testing is crucial but it's really hard to cover all the scenarios and it can be very time consuming to write test code for all of the scenarios you need to cover.
Moreover, if the data quality of your production system isn't 100%, it's very easy to miss a few scenarios in the analysis, which leads to missed migration scenarios that lead to bugs and incidents. 

## What is DBLab?

DBLab is software that allows you to easily and quickly create thin clones of databases.
At the time of writing, it supports PostgreSQL databases.
It has been created by Postgres.ai which was founded by Nikolay Samokhvalov.
They are specialised in creating solutions to assist with database management.

The software exists in 4 main parts, their engine, their CLI, a GUI and the SaaS platform.
This post will mostly discuss the DBLab Engine (DLE) community edition, so without the SaaS platform.

### End user interaction

Let's start with what DBLab can ultimately bring you. 

Let's say a developer, Neal, wants to validate a data migration he has created. 
Performing an export and import from one database to another isn't that hard, especially in PostgreSQL.
You run `pg_dumpall` on the exporting database and just run a `pqsl` with the dump on the importing one and you're done. 
Now imagine that the dataset he's using is not just a few megabytes in size, but consists of 100s of 1000s of rows across a multitude of tables. 
That import is going to take a while, more than just a coffee break, let's say 30 minutes. 
After the import completes, since he's working on another data migration, he runs his migration script against the clone and as we, developers, aren't perfect, he finds a bug halfway through his migration. 
He fixes the bug and wants to run the migration again. 
To do that, he needs to re-run the import (provided he kept the export) and restart his migration.
Again 30 minutes plus his migration time are lost.

This is a scenario where DBLab shines.
Let's say Neal's company has a DBLab setup for the database he wants to use. 
The same scenario would look like this: 

Neal requests a DBLab clone: `dblab clone create neals-special-clone --username neal --password nealisawesome` or through the GUI.
This takes seconds to complete. 
Later in this post, we'll discuss how that's possible with so much data.
Next, Neal runs his migration script, as before, it fails halfway through and he needs to fix the bug. 
After the fix, he wants to retest the migration with the original data.
To do this, he simply runs `dblab clone reset neals-special-clone` and the clone will be reset to the original state before the failed migration was executed.
Again, taking just seconds to complete. 

## Behind the curtains

The scenario described earlier almost sounds too good to be true, doesn't it?
In this section, we'll discuss how DBLab can achieve this and where the magic happens. 

The magic is mostly done by the use of a [ZFS](https://en.wikipedia.org/wiki/ZFS){:target="_blank" rel="noopener noreferrer"} filesystem underneath the PostgreSQL instances used by DBLab. 
Specifically the copy-on-write and snapshotting features are primarily used. 
This is combined with running the instances themselves in Docker containers, which allows multiple PostgreSQL instances to easily exist on a single system. 
More info on the details can be found [here](https://postgres.ai/docs/database-lab#database-lab-engine){:target="_blank" rel="noopener noreferrer"}

DBLab Engine has 2 operating modes for enabling clones: physical or logical. 

With the physical mode, a replica of the source PostgreSQL database is created and managed by DLE. 
This database is treated as the `sync instance` from which all copies are created.
The replication can be set up just like any other PostgreSQL replication.

In logical mode, the copy of the original data is achieved by a regular dump (`pg_dumpall`) from the source PostgreSQL instance. 
This phase is called the logical dump in the [DLE documentation](https://postgres.ai/docs/reference-guides/database-lab-engine-configuration-reference#job-logicaldump){:target="_blank" rel="noopener noreferrer"}.
This dump is `restored` onto a local PostgreSQL install and from there clone could be created. 
This is called the logical restore phase in the [documentation](https://postgres.ai/docs/reference-guides/database-lab-engine-configuration-reference#job-logicalrestore){:target="_blank" rel="noopener noreferrer"}.
After this has been completed a ZFS snapshot will be created for the database which is used later for creating clones. 
This last phase is called [logical snapshot](https://postgres.ai/docs/reference-guides/database-lab-engine-configuration-reference#job-logicalsnapshot){:target="_blank" rel="noopener noreferrer"}.

After the initial copy has been created, in whichever mode, clones can be created.
These clones are created by first creating a new (ZFS) snapshot of the restored instance. 
Next, a Docker container with a modified PostgreSQL instance is used in combination with a volume bind of the created snapshot. 

This results in a seemingly regular PostgreSQL instance running in Docker with some data preloaded in it. 
When executing changes on the database, the copy-on-write feature of ZFS makes sure that the new changes are only made to the snapshot volume that's attached to the clone. 

When a reset is requested on a clone, the snapshot is simply restored to its original state by ZFS and the PostgreSQL instance is restarted. 

## How to setup

The setup process is highly dependent on your starting situation. 
The first choice you'd need to make is if you want to use a physical or logical setup. 

The physical setup has the advantage of being an always-online solution. 
This means that DLE manages a live (async replication) copy of the source instance you want to clone.
The downside of this approach is that you need to be able to change some configuration on your source instance to set up the replication and that you need to be able to create a replicated instance from your source instance. 
For managed PostgreSQL databases provided by cloud providers, for example, this might be an issue.

Luckily there is a secondary approach available: the logical mode.
In this mode, an initial clone is created by dumping the original database to the DBLab instance and restoring it locally onto the main clone instance. 
The advantage here is that you don't need additional configuration on the source instance. 
Unfortunately, due to the nature of the point-in-time copy of the dump, it's not possible to have a real live clone available. 

For the example we'll show here, we'll use the logical mode as we're copying from an Azure Database for PostgreSQL managed database. 
All code for the example is available [here](https://github.com/pietervincken/dblab-azure-demo){:target="_blank" rel="noopener noreferrer"}

NOTE: This code is only provided for demo purposes and is not to be used as-is for any production systems.
All ports are opened by default on the instance and a public IP will be assigned to the VM.
The scripts also include cleanup steps that remove **ALL DATA** from the instances. 
Use at your own risk.

The demo code will create a database and a VM. 
Next, it will configure the VM to act as a DBLab Engine instance.
Some random test data will be automatically injected into the PostgreSQL database.
Finally, you can use the UI or the CLI to interact with the instance.
A brief use case will be shown in the next paragraph.

## How to use it

DBLab allows three ways of interaction with the engine: SaaS, CLI, local UI. 
For the scope of this demo, we'll only show the local UI and mention the CLI counterparts.

Once the instance is deployed, you can access the DLE UI through a web browser.
You'll be prompted to enter the token to access the instance.
Next, you'll see the dashboard which provides an overview of all the active clones, the state of the DLE engine and a calendar that shows the available snapshots.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/20211101-postgres-ai/clones-dashboard.png' | prepend: site.baseurl }}" alt="Dashboard" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

{:refdef: style="text-align: center;"}
<img src="{{ '/img/20211101-postgres-ai/instance-status.png' | prepend: site.baseurl }}" alt="Instance status" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

For this demo, we'll create a new clone of the database that's linked to this instance
We do this by clicking "Create Clone" and filling out the form that's prompted next.
After completing the form, click "Create Clone" and take a very fast sip of coffee as your clone will be available in a matter of seconds.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/20211101-postgres-ai/create-clone.png' | prepend: site.baseurl }}" alt="Create clone" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

This same process can be achieved by executing the following commands through the DBLab CLI:
```
dblab init --token <secret-token> --url <public ip of the instance> --environment-id local --insecure
dblab clone create --username jworks --password rocks --id testclone 
```

Now in a real use-case, you'd connect the thin clone to your application in a development environment or local setup. 
We'll simulate the changes being made by connecting to the database using your favourite PostgreSQL client.
Make some changes to the database (create a table, delete or change some rows in the provided users table, ...).
Now let's imagine we're testing a migration script and we discovered a bug (like the scenario mentioned earlier).
We fix the bug, but now our data in the thin clone is corrupted and useless for further testing.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/20211101-postgres-ai/clone-details.png' | prepend: site.baseurl }}" alt="Clone details" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

Now a cool feature of DBLab comes into play: clone resetting.
Because the database is running on a ZFS snapshot, we can easily revert to the original snapshot and continue working from there again.

{:refdef: style="text-align: center;"}
<img src="{{ '/img/20211101-postgres-ai/reset-clone.png' | prepend: site.baseurl }}" alt="Reset clone" class="image fit" style="margin:0px auto; max-width:100%">
{: refdef}

We do this by going back to the local UI and selecting our thin clone.
Next, we click on reset clone and confirm in the dialogue.
Only seconds later, our database is reset to the original snapshot and we can start testing again.
From the same view, you can destroy the clone as well if you don't need it anymore.

## More cool features

DBLab has added some additional features on top of the cloning process. 
A very helpful feature is their support for [data masking and obfuscation](https://postgres.ai/docs/database-lab/masking){:target="_blank" rel="noopener noreferrer"}.
In short, they support multiple scenarios for using production data in a development environment without exposing any Person Identifiable Information (PII) to the developers using the test systems. 
This makes it possible to use the clones during normal development without risking overexposing PII and therefore making it easier to adhere to guidelines like GDPR while still being able to test with production-like data.

The mechanism to do this is quite simple.
DLE supports writing preprocessing scripts that are executed on the main copy during the restore phase.
Using this, data can be obfuscated or masked using predefined scripts, which you'll have to provide yourself. 
By making it part of the restore phase of DLE, it's ensured that no data is ever exposed without being obfuscated first.

Another option that DLE support is using [PostgreSQL Anonymizer](https://postgresql-anonymizer.readthedocs.io/en/stable/static_masking.html){:target="_blank" rel="noopener noreferrer"}. 
This is a well known PostgreSQL extension that can be used to mask and obfuscate data in a PostgreSQL database. 
The nice advantage of this solution is that the obfuscation configuration can be part of the original data creation in the original database. 
It allows DevOps teams to create the obfuscation code directly with the table creation code which of course makes it way easier to maintain properly and correct judge with data should be obfuscated and in which way. 

## Why should I use it?

If you're in a project where access to production systems is not available and/or testing migration scenarios is very time consuming, this might be a good tool for you to investigate, provided of course that you're using PostgreSQL databases.
It provides an easy, scalable and safe way to provide copies of large databases without having to wait hours or days to copy over data from one database to the next to test something. 

Adding to that the possibility to obfuscate the data with the same tool and allow developers to work with obfuscated data during their developer, makes it an even more compelling choice.

The software is opensourced on [Gitlab](https://gitlab.com/postgres-ai){:target="_blank" rel="noopener noreferrer"} and the community on [Slack](https://slack.postgres.ai/){:target="_blank" rel="noopener noreferrer"} is very helpful and response if you have any questions or issues with the software.

If you want a more in-depth post about how to configure DBLab and which pitfalls we found, let me know on [LinkedIn!](https://www.linkedin.com/in/pieter-vincken-a94b5153/){:target="_blank" rel="noopener noreferrer"}

### Links

- [Postgres AI website](https://postgres.ai/{:target="_blank" rel="noopener noreferrer"}
- [Source code](https://gitlab.com/postgres-ai){:target="_blank" rel="noopener noreferrer"}
- [SaaS offering](https://postgres.ai/docs/platform){:target="_blank" rel="noopener noreferrer"}
- [Anomization setup](https://postgres.ai/docs/database-lab/masking){:target="_blank" rel="noopener noreferrer"}

Feel free to reach out to [me](https://www.linkedin.com/in/pieter-vincken-a94b5153/){:target="_blank" rel="noopener noreferrer"} or directly to lovely people of [Postgres.ai](https://postgres.ai/){:target="_blank" rel="noopener noreferrer"} if you want to look into this solution. 