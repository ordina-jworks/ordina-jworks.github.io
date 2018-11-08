---
layout: post
authors: [chris_de_bruyne, nick_van_hoof, dock]
title: "MongoDB Europe 2018"
image: /img/2018-11-08-mongodb-europe-2018/main-image.png
tags: [Development,MongoDB,DBA]
category: Development
comments: true
---

> MongoDB Europe is a yearly conference where MongoDB shows of their latest features and new products.
> This year the venue took place in Old Billingsgate Walk, London


# Table of contents
1. [Talk1](#what-is-crowdin)
2. [Talk1](#key-features)
5. [Conclusion](#conclusion)

## What is Crowdin
Crowdin is an online platform that allows you to do translations through a visual interface.
You can appoint people as translators for any natural language.
Either an integration with your Git repository or a CLI tool can be used to get the source strings into Crowdin.
After uploading the source strings, the translators can get to work.
They'll be notified whenever there's something new to translate.
When they're done, approvers can start proof-reading with the help of some thorough quality assurance functionalities.
You'll never miss a translation again because it will clearly be marked as not being translated.
Strings that are removed from the source file will also be removed from all translations.
The translated files can be downloaded at any moment and will be in the exact same format as the source file.
In other words, clean and up-to-date translation files!

Translator view:
<img class="image fit" style="margin:0px auto; max-width: 1422px;" alt="Crowdin translator view" src="/img/2018-11-05-managing-translations-with-crowdin/translator_mode.png">

Approver view:
<img class="image fit" style="margin:0px auto; max-width: 1439px;" alt="Crowdin approver view" src="/img/2018-11-05-managing-translations-with-crowdin/approver_mode.png">

## Key features
* A large number of file formats are supported, ranging from `json` files to `csv` and `properties` files.
It can thus be used for Angular, React, Vue ... applications as well as a Spring Boot service and so on.
* Crowdin has a very clever parser and detects thing such as HTML tags and variables.
It will warn you if they are translated and no longer match the original tags/names.
* Quality assurance checks will help the approver in verifying the translations.
* Extra context can be provided for each source string to help translators understand what exactly they need to translate.
* Integration with source control systems is very easy and will make sure that the source strings are up-to-date with your Git repository. 
Translations will automatically be pushed to your Git repository.
* There's even the possibility to integrate it with your website and have people do the translations on your website directly.
That way the translators get a lot of context of what to translate.
* If you're unable to do the translation for a certain language, 
Crowdin allows you to easily hire professional translators!

## Getting started
### Account
To start using Crowdin, you of course need an account at [Crowdin.com](https://crowdin.com){:target="_blank" rel="noopener noreferrer"}. 
There's a limited free trial. 
After that you can choose from a variety of payment plans depending on the number of source strings and projects you'll have.
> The number of projects you need on Crowdin depends on your setup.
> However, it's recommended to create a project for each Git repository.
> So if your front- and backend application live in the same repository, you can configure multiple source files within one project.
> If not, you'll need to create two separate projects on Crowdin.

Once logged in, you can create a new project. 
You can choose the source language and the languages you wish to translate to. 
Then go to the project's settings and then to `API`.
There you'll find a project identifier and a API key. 
We'll need those later when setting up Crowdin in our project.

<img class="image fit" style="margin:0px auto; max-width: 744px;" alt="Crowdin project settings" src="/img/2018-11-05-managing-translations-with-crowdin/languages.png">

### Setup in your project
First we need to install the Crowdin CLI. 
For Mac you can run `brew install crowdin`. 
For Windows an [installer](https://support.crowdin.com/cli-tool/){:target="_blank" rel="noopener noreferrer"} is available.

Once installed, open a terminal and go to the root of your project and run `crowdin generate`.
This will generate a `crowdin.yml` file that is used to configure Crowdin in your project.
In that file four things need to be changed:
* `project_identifier`: the one you find under `API` on the Crowdin site
* `api_key`: also under `API`
* `source`: this should point to the source translation file (e.g. in an Angular app `/src/assets/i18n/en.json`)
* `translation`: the translated files will end up here (e.g. `/src/assets/i18n/%two_letters_code%.json`)

> I don't recommend selecting the source language as a target language, because it will then be overwritten when downloading the translations.
> You could put the source language file in a separate directory if you prefer the source language being editable on Crowdin as well.
> However, you would have to update the source file manually when there are changes.

> There are [more options](https://support.crowdin.com/configuration-file/){:target="_blank" rel="noopener noreferrer"} and regexes available, but these are the only ones required to set up Crowdin in an Angular app for example.

### Upload and download translations
There are two options here: either you integrate Crowdin with your Git repository or you up and download the translations manually (or automate it using CLI commands).
I personally prefer integrating it with Git so we'll get to that first.
> It's not possible to use both at the same time because you'll end up with multiple source files on Crowdin.com.

#### Git integration
On the Crowdin website, go to the project's settings again, then to `Integration`.
Choose the source control system you're using and click on `Set Up Integration` (or choose `Enterprise` if you're on a self-hosted version).
For GitHub and GitLab you'll be redirected to their website to authorize Crowdin to use your account.
If you chose `Enterprise` you'll need to generate a token yourself and paste it into the correct field together with the URL to your self-hosted source control system.
Next you can choose which branches you want to watch for changes to the source language file and choose a name of the branch to where translations should be pushed.
> Which source branch you wish to use depends on your workflow. 
> In my case, we work with short-lived feature branches and once they are done, we merge them to the `master` branch.
> So, the `master` branch is the one being watched by Crowdin, since it will have all the correct source strings.

<img class="image fit" style="margin:0px auto; max-width: 903px;" alt="Crowdin Git integration" src="/img/2018-11-05-managing-translations-with-crowdin/git_integration.png">

With this setup, each change to the source language file will be reflected on the Crowdin site.
When a source string is translated and approved, Crowdin will push the translation to the target branch (e.g. `i18n_master`) and even open up a merge request for your review!

A great benefit of this is that your stories don't have to wait for all translations to be done.
Translations are now the responsibility of the people that you appointed to do the translations.
When they do, you'll be notified with a merge request!

#### Manual up- and download
If you don't want to integrate with your Git repo, you can use the Crowdin CLI.
There are two simple commands that let you upload the source files and download the translations.

Upload: 
```
crowdin upload sources
```

Download: 
```
crowdin download
```

## In app translations
Another nifty feature is that you can do translations directly in you webapp.
All you need to do is add a JavaScript snippet to your `index.html` and select a pseudo language called `Acholi`.
Crowdin will give unique identifiers to all of your source strings and use those as translations.
Because of the snippet, these IDs will be located and replaced with translated strings for the language you're translating to.
You will also be able to edit the translations inline in your application and they will immediately be reflected on Crowdin.

<img class="image fit" style="margin:0px auto; max-width: 960px;" alt="In context localization" src="/img/2018-11-05-managing-translations-with-crowdin/in_context_animation.gif">

Now, this isn't something you want to do in your production environment.
Ideally you'd only have a specific environment setup that loads the JavaScript snippet.
If the snippet is loaded you'll always see the Crowdin tools in your webapp,
so it's up to you whether you want to use it and where.

More info [here](https://support.crowdin.com/in-context-localization/){:target="_blank" rel="noopener noreferrer"}.

## Conclusion
Crowdin has really helped me and my team in the way we manage our translations.
At first we were sending out emails for every label to get it translated.
Of course we missed quite some translations in various languages.
The variables in the translated string would sometimes be translated as well which meant that they wouldn't work.

With Crowdin we now have a clear overview of what is translated and what isn't.
Instead of sending emails, translators get notified and can do the translations through a nice UI.
Because of the thorough quality assurance tools, less mistakes are made and those translated variables can be fixed before approving the translation and bringing it to production.

In short, it's a must-have tool when you need to manage translations, especially for languages you do not speak yourself!
