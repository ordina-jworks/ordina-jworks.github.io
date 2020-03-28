---
layout: post
authors: [martin_kwee]
title: 'Healthcare on FHIR'
image: /img/2020-03-28-Healthcare-on-FHIR/FHIR_logo.png
tags: [eHealth, Architecture, FHIR, Interoperability]
category: eHealth
comments: true
---

# And then there was FHIR
The healthcare industry is currently buried under mountains of data, and much of it is unorganized or out of reach. For instance, care givers who are responsible for emergency care may not always have the patient's history they need.
This might force them to resort to guessing or basing their treatment on the information the patient provides. If the patient is unable to give a medical history or other information such as allergies, the problem gets worse.

Exchanging healthcare information in a safer and faster manner is therefore a primary goal in the healthcare industry.
Software developers and IT professionals in this industry are tasked with integrating software applications without sacrificing security of sensitive patient information.

Today's health IT environment is also very fragmented. 
Integrating with different health systems as well as sharing data has been a difficult and expensive process.
Each of these systems tend to favor flexibility of their specific function or department over interoperability with external applications.

**Fast Healthcare Interoperability Resources** (FHIR, pronounced “fire”) is a set of standards providing a mechanism for exchanging data between healthcare applications. 
It was first sponsored by [Health Level Seven International (HL7)](http://www.hl7.org/){:target="_blank" rel="noopener noreferrer"} in 2011, and now incorporates the best features from previously developed standards.

The introduction of the FHIR specification was driven by the following:
- Patient-centric healthcare: the patient is in control of his own medical data therefore sharing data across organizations and disciplines becomes more important.
- Shift from offline to online, from desktop to cloud and from desktop to tablet.
  FHIR is based on the REST architectural style, thus being suitable for lightweight devices.
- Data transparency becomes more and more important. 
  FHIR acts as an ‘Open API’ to access data silos so systems can more easily collaborate with each other.
- Data analytics is a hot topic and requires data transparency but also for the data itself to be in a format which is optimized for analysis.
  Standardized and well-documented models as well as support for JSON-like formats by modern databases make FHIR an interesting choice.

> “The intended scope of FHIR is broad, covering human and veterinary, clinical care, public health, clinical trials, administration and financial aspects. The standard is intended for global use and in a wide variety of architectures and scenarios.”
> 
>  *- HL7 (Health Level Seven International)*

This relatively new protocol has several advantages:
- The FHIR specification is free for use, open source with no restrictions and entirely available online at [https://www.hl7.org/fhir/](https://www.hl7.org/fhir){:target="_blank" rel="noopener noreferrer"}.
  It has been licensed under the Creative Commons Public Domain License, a license that permits the following: “You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission.”
- It has a strong focus on fast and easy implementation by using common tools, formats and web-based technologies without a steep learning curve. 
  Multiple implementation libraries are available with many examples to kickstart development.
  For instance, the [HAPI FHIR library](https://hapifhir.io){:target="_blank" rel="noopener noreferrer"} is an open source implementation of the HL7 FHIR specification for Java.
- The FHIR format is human-readable.
  Although it is not intended for direct human viewing, being directly understandable helps both implementers and medical personnel.
  The base out-of-the-box interoperable resources can be used as is, but can also be extended and adapted for local or regional requirements.
- FHIR leverages modern web-based communication technologies such as XML, JSON, HTTP, Atom, OAuth, ...
  It supports RESTful architectures, but other information exchange architectures/paradigms as well. The Document paradigm allows a system to send over a collection of resources about a Patient, for instance a referral to a specialist which involves the patient's history including medications and diagnoses. FHIR also supports the Messaging paradigm which is often based on real-world events like a Patient being discharged from the hospital.

# Why should you be excited about FHIR?
FHIR has the potential to make healthcare much more similar to other internet-based experiences that consumers nowadays enjoy in different industries.  
The Internet of Medical Things (IoMT) is a subset of IoT devices that captures and transmits patient-generated health data (PGHD). 
IoMT represents one of the largest technology revolutions and is growing at a lightning pace. 
The mountains of PGHD are growing every day but remain meaningless to healthcare providers if they're not able to access the essence of the data quickly and easily. 
FHIR may be the glue between your electronic health record (EHR) on the one hand and your smart electric toothbrush, blood glucose monitor and fitness tracker on the other hand.
It allows connecting PGHD to streamlined healthcare provider workflows and filtering the bulk-load of data in a way that makes the data useful and actionable for your care provider.

Patients who see multiple care providers in different health systems might no longer have to worry about having three or four patient portals from organizations using different EHRs.
One single personal health record, which integrates data from different formats, can deliver a comprehensive view of all medications, problems, and allergies. 

FHIR includes all aspects of healthcare-related interoperability through RESTful APIs and a common format for hundreds of clinical data models. This is useful ...
- for healthcare integrators: Transitioning to FHIR formatted XML/JSON objects in a RESTful architecture will enable you to have atomic data access to individual items within a resource, for example the Patient demographics or Observations for lab results.
- for healthcare systems: Building and running applications on this API standard will result in richer products with data connected from external systems.
- as a patient: You can get and share your medical data in more ways than ever before, including with apps that you use.

# What about the tech giants?
- Microsoft recently released [FHIR server for Azure](https://docs.microsoft.com/en-gb/azure/healthcare-apis/overview){:target="_blank" rel="noopener noreferrer"}, an easy way to manage and persist health information in the cloud.
  It allows you to create and deploy a FHIR service in minutes, and leverage the elastic scale of the cloud.
- [Google Healthcare API](https://cloud.google.com/healthcare){:target="_blank" rel="noopener noreferrer"} bridges the gap between care systems and applications built on Google Cloud.
  It supports the industry standard interoperability protocols such as HL7, DICOM, and of course FHIR.
  Google lets its customers use this medical data for analytics and machine learning in the cloud which can unlock insights that lead to clinical improvements for patients.
- [Apple's Health Records app](https://www.apple.com/healthcare/health-records/){:target="_blank" rel="noopener noreferrer"} uses FHIR to let consumers download data from their health care providers in the U.S.
- [Amazon Comprehend Medical](https://aws.amazon.com/comprehend/medical/){:target="_blank" rel="noopener noreferrer"} works through [Amazon Web Services](https://aws.amazon.com/){:target="_blank" rel="noopener noreferrer"} and is a natural processing service that uses machine learning to extract relevant medical information from unstructured text and map it to FHIR resources.

# ... and the community?
A community is important for knowledge sharing and connecting experts to people and teams that need help. 
Luckily the FHIR specification has a strong community that helps connecting people for both giving and getting value:
- Lots of [public FHIR servers](https://wiki.hl7.org/Publicly_Available_FHIR_Servers_for_testing){:target="_blank" rel="noopener noreferrer"} are available for testing.
- FHIR developers participate actively on [StackOverflow](https://stackoverflow.com/questions/tagged/hl7_fhir){:target="_blank" rel="noopener noreferrer"}.
- [DevDays](https://www.devdays.com/){:target="_blank" rel="noopener noreferrer"} is the most important and largest FHIR-only event in the world.
  The DevDays mission is to give health IT professionals around the the world the opportunity to learn about FHIR, to meet with colleagues and exchange ideas, and to apply what they have learned in their day-to-day work.

# What does FHIR look like?
The following patient browser application gives an idea of what FHIR looks like and how easy it is to exchange data: [https://patient-browser.smarthealthit.org](https://patient-browser.smarthealthit.org){:target="_blank" rel="noopener noreferrer"}. 
Definitely check out this demo app!

## FHIR Resources
A resource is the smallest unit of exchange with a defined behavior and meaning in interoperability, such as a Patient, a Device, an Observation, an Allergy Intolerance, ... .
It has an identity and location (URI) where it can be found.
Furthermore is it made up of elements of a particular datatype, and can be represented either as an XML document or a JSON document.

An exhaustive list of FHIR base resources is described here: [http://www.hl7.org/implement/standards/fhir/resourcelist.html](http://www.hl7.org/implement/standards/fhir/resourcelist.html){:target="_blank" rel="noopener noreferrer"}. 
The FHIR development team has adopted the 80% rule for resources: only define and include concepts applicable to 80% of normal implementations.
Adherence to the 80% rule is key to keeping the standard usable and not too overwhelming.
What about the other 20%? FHIR has a built-in extensibility capability for specific requirements of a particular region, discipline or organizational process.
To make extensions manageable, a set of requirements is defined that must be met as part of their use and definition. 

Each resource is annotated with a number or an N letter.
This is the FMM (FHIR Maturity Level) which goes from 0 to 5 and finally N (Normative).
_0_ means that the resource is still a draft.
_5_ means that it has been published in two formal publication release cycles and has been implemented in at least five independent production systems in more than one country.
A resource is _Normative_ when it is considered stable.
Other metadata also include a Security Category which represents the sensitivity level (i.e Anonymous, Business, Individual, Patient).
The Boundaries and Relationships metadata describe when to use it and which resources are related to or referenced from this one.

Example of a Patient:
{:refdef: style="text-align: center;"}
<img src="{{ '/img/2020-03-28-Healthcare-on-FHIR/resource-structure.png' | prepend: site.baseurl }}" alt="FHIR Resource structure" class="image" style="margin:0px auto; max-width:70%">
{: refdef}
{:refdef: style="text-align: center;"}
FHIR Resource structure
{: refdef}
The [full specification](https://www.hl7.org/fhir/patient.html){:target="_blank" rel="noopener noreferrer"} can be found on the HL7 FHIR website.

## Example FHIR architectures
Building your solution with FHIR does not change your development process nor does it enforce a specific architecture or technology stack. FHIR can be used in a lightweight or heavyweight client, in a monolith or a microservices architecture, in a push or pull-based design, ...
In any case, you will still need to complete a project discovery phase, formulate a project vision and scope. You can continue to use your favorite agile practices, test driven development, CQRS and Event Sourcing, DevOps and Continuous Integration. 

The following section gives an example of 2 possible FHIR architectures.

### FHIR server with existing back-end
This is the most common scenario where you supply an interoperable FHIR API on top of an existing solution so it can be easily understood and consumed by clients.
This approach results largely in a mapping effort as the existing data model needs to be converted to FHIR resources.
It is possible to have a mix of both a FHIR and a proprietary API.
This can have several reasons like:
- the backend does not (yet) support the FHIR capabilities the client needs
- the FHIR specification does not describe your healthcare domain or use case

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2020-03-28-Healthcare-on-FHIR/fhir-existing-backend.png' | prepend: site.baseurl }}" alt="Mixed FHIR/Proprietary API with existing back-end" class="image" style="margin:0px auto; max-width:100%">
{: refdef}
{:refdef: style="text-align: center;"}
Mixed FHIR/Proprietary API with existing back-end
{: refdef}

### Native FHIR server with FHIR back-end
This architecture is a FHIR-native solution because FHIR becomes the central design element of the system. 
FHIR is used as a platform specification that is stored directly in the SQL or NoSQL back-end data store and comes with some powerful features:
- a healthcare domain model (aka the Resources) and its extension capabilities
- description of the types of search capabilities supported by a FHIR server
- description for a FHIR server to advertise its capabilities to other systems

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2020-03-28-Healthcare-on-FHIR/fhir-fhir-backend.png' | prepend: site.baseurl }}" alt="Native FHIR server with FHIR back-end" class="image" style="margin:0px auto; max-width:100%">
{: refdef}
{:refdef: style="text-align: center;"}
Native FHIR server with FHIR back-end
{: refdef}

# Summary
Today, there's lots of buzz about FHIR.
You might find it anywhere from federal agencies to major technology companies.
Google, Microsoft and Apple all have thrown their considerable weight and cloud-based resources behind FHIR and are improving interoperability in healthcare.
The underlying concepts behind FHIR are important drivers of the push towards interoperability.
It supports the exchange of data between software applications in healthcare, combining the best features of HL7’s existing interoperability protocols while leveraging the latest web standards and applying a tight focus on implementability. 
FHIR is worth paying attention to because it is a huge step forward in working with healthcare data and is likely to have a significant impact on health IT.