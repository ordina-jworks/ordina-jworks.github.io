---
layout: post
authors: [pieter_vincken]
title: 'Istio Service Mesh'
image: /img/2019-04-01-istio-service-mesh/istio.jpg
tags: [Istio, Service Mesh, Kubernetes, Cloud]
category: Microservices
comments: true
---

> Short summary of the post
>
>

# Table of content

* [What is a service mesh?](#what-is-a-service-mesh)
* [What is Istio?](#what-is-istio)
* [Why do I need RBAC for services?](#why-rbac-for-services)
* [How does this work in Istio?](#how-does-this-work-in-istio)
* [What are ingress and egress?](#what-are-ingress-and-egress)
* [Show me the code](#show-me-the-code)

## What is a service mesh?

* Microservices
* Kubernetes / OpenShift platform
* Cattle (deployments might disappear / relocate ...)
* Service discovery
* Benefits
   * Insight into service to service communication
   * Need for distributed tracing capabilities
   * Service to service encryption (required for GDPR (encryption of data in transit))

## What is Istio?

* Implementation of a service mesh
* Created at Google, IBM and Lyft.
* Relies on Envoy (Lyft) as a proxy
* Sidecar proxy approach
   * All network traffic through the proxy

## Why do I need RBAC for services?

* Good authorization is defined on 4 levels (find link!)
   * Who can access an endpoint
   * Who can do what action on the endpoint
   * Who can access a given resource
   * What data can they access for that resource
* Defence in depth
   * Least privileged access
   * Attacker in network -> still no real access
* Discover misconfiguration easily

## How does this work in Istio?

* Authentication -> mTLS -> citadel?
* Authorization -> proxy policies -> mixer
* Service Role
* Service Role Binding

## What are ingress and egress?

* Ingress
   * Front end reverse proxy
   * Maps incoming requests to the proper 'backend'
* Egress
   * Gateway for contacting external services
   * Provides insight and control to what services are accessed
   * Provides the same level of control over accessing external services as internal services
   * Handle external services like internal once
   * Provide ingress style definition for external services

## How does Istio provide ingress and egress support?

* Envoy proxy
* Gateway object
   * ingress
   * egress
* Virtual service object
* Destination Rule object
* Service entry object

## Show me the code

* Show diagram of final setup of the demo ( 2 databases, 3 services ) 

Service 1 -> Database 1
Service 2 -> Database 2
Service 2 /-> Database 1
Service 3 -> External source
Service 3 /-> Service 1
Service 3 /-> Service 2

* How to setup Istio
   * 1.0.5 -> What to configure and how. (https://gitlab.com/pieter.vincken1/istio-authn-authz-demo) consider moving this to github
* How to enable mTLS (required to do RBAC)
* Deploy the demo services
* Show that access to the services (diagram!)
* Create service roles
   * Explain how they work -> they define what access the role provides
* Create service role binding
   * How to connect the roles to a service account
   * A service account can have multiple roles
* Apply the roles and bindings to the setup
* Show that the access changed. 



* Enable ingress objects
   * Create an ingress gateway
   * Create virtual services for the services (2)
* Enable egress support

## Usefull links 
* https://istio.io/docs/reference/config/authorization/istio.rbac.v1alpha1/
* https://istio.io/docs/examples/advanced-egress/egress-gateway/


### Conclusion

## Summing it all up
