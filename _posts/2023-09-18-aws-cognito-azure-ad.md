---
layout: post
authors: [yolan_vloeberghs, nicholas_meyers]
title: 'Cognito Azure AD'
image: /img/2023-09-18-cognito-azure-ad/banner.jpg
tags: [ Cloud, AWS, Terraform, Azure, Cognito, Security, Authentication ]
category: Cloud
comments: true
---
# Introduction
In today's interconnected digital landscape, enterprises are increasingly relying on a mix of cloud solutions to meet their diverse needs.
One common challenge is efficiently managing user identities and authentication across these platforms.
But what happens when you're already invested in Azure Active Directory as your primary identity provider?

While many companies utilize Azure AD, they may not fully adopt the entire Azure ecosystem.
However, based on our experience, integrating Cognito with AWS services offers a cleaner solution, especially if your application operates on AWS.
Although an AWS Lambda function could authenticate with Azure AD, AWS Cognito provides a convenient approach to incorporate authentication within AWS services like API Gateway and CloudFront.

In this article, we'll explore how to efficiently integrate users from your Azure AD environment into AWS Cognito.
Can these two seemingly distinct systems work together to provide a unified authentication experience?
Let's delve into the details and discover how this integration can be seamlessly achieved.

To keep things straightforward, we will utilize [Terraform](https://www.terraform.io/) to establish the infrastructure.
This setup can be easily replicated across various AWS and Azure accounts for convenience.

# Infrastructure setup
## Azure AD
We should create an App Registration within Azure AD which will be utilized in a later stage by AWS Cognito.
Every authentication request should redirect back with a response to our Cognito domain.

Optionally, you are able to synchronize Azure AD groups with AWS Cognito.
This synchronization involves utilizing the `required_resource_access` block.
This synchronization can be valuable for permissions administration linked to distinct groups like MANAGEMENT.
More information about the different resource apps and which ID's to use can be found [here](https://learn.microsoft.com/en-us/troubleshoot/azure/active-directory/verify-first-party-apps-sign-in#application-ids-of-commonly-used-microsoft-applications){:target="_blank" rel="noopener noreferrer"}.
For Microsoft Graph, the ID that we should use is `00000003-0000-0000-c000-000000000000`.
More information about the different roles for Microsoft Graph and which ID's to use can be found [here](https://learn.microsoft.com/en-us/graph/permissions-reference#all-permissions-and-ids){:target="_blank" rel="noopener noreferrer"}.
For the `Directory.Read.All role`, the ID should be `7ab1d382-f21e-4acd-a863-ba3e13f7da61`.

Additionally, it's essential to generate a client secret for the application with the `azuread_application_password` resource.
This secret facilitates Cognito's authentication with Azure AD and enables configuring your identity provider within the Cognito environment.
```terraform
resource "azuread_application" "application" {
  display_name = "example-application-for-aws"

  web {
    redirect_uris = [
      "https://example-application-for-aws.auth.eu-west-1.amazoncognito.com/oauth2/idpresponse"
    ]
  }

  required_resource_access {
    resource_app_id = "00000003-0000-0000-c000-000000000000" # Microsoft Graph
    resource_access {
      id   = "7ab1d382-f21e-4acd-a863-ba3e13f7da61" # Directory.Read.All
      type = "Role"
    }
  }
}

resource "azuread_application_password" "application_password" {
  application_object_id = azuread_application.application.object_id
}
```

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2023-09-18-cognito-azure-ad/azure-ad-overview.jpg' | prepend: site.baseurl }}" alt="Azure AD: Overview" class="image fit" style="margin:0px auto; max-width:100%">
_Overview_
{: refdef}

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2023-09-18-cognito-azure-ad/azure-ad-redirect.jpg' | prepend: site.baseurl }}" alt="Azure AD: Redirect" class="image fit" style="margin:0px auto; max-width:100%">
_Redirect URL_
{: refdef}

{:refdef: style="text-align: center;"}
<img src="{{ '/img/2023-09-18-cognito-azure-ad/azure-ad-secret.jpg' | prepend: site.baseurl }}" alt="Azure AD: Client secret" class="image fit" style="margin:0px auto; max-width:100%">
_Client secret_
{: refdef}

## AWS Cognito

# Conclusion