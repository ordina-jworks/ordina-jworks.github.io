---
layout: post
authors: [orjan_de_smet]
title: "Managing the size of your shiny monorepo"
image: /img/2020-03-31-nx-sparse-checkout/header.png
tags: [Monorepo, Nx, Git]
category: Architecture
---

## The problem

Using a monorepo has some great advantages, including no longer having to manage npm dependencies for each individual project and the ability to easily create libraries and reuse them between applications.
You can create libraries for example about authentication that each team in your organisation can include in their application and if an update should be needed to that library, the tooling you use can automatically build each (and only those) application that include that library.

When talking about monorepo's within frontend development communities, Nrwl's Nx solution will certainly be mentioned.
It allows to create a workspace in which all your applications might exist together, using one single `package.json`, no longer solely focused on Angular, but also React, simple web applications or NodeJS applications.
It also includes some useful tslint extensions and scripts to automate build steps using a dependency graph.

But what happens when you have a lot of applications in your organisation?
Your IDE might start to work slower, it's intellisense might get cluttered, or when searching for a specific file you receive a lot of results you don't need for the application you're working on.
This happens because there are just too much files in your repository.

## The solution

Git has a little-known (experimental) feature called sparse checkout.
From the [git-scm.com](https://www.git-scm.com/docs/git-sparse-checkout):

> "Sparse checkout" allows populating the working directory sparsely.
> It uses the skip-worktree bit (see git-update-index) to tell Git whether a file in the working directory is worth looking at.
> If the skip-worktree bit is set, then the file is ignored in the working directory.
> Git will not populate the contents of those files, which makes a sparse checkout helpful when working in a repository with many files, but only a few are important to the current user.

In short, it allows you to checkout only a part of the repository, and when committing, only those folders that are checked out will also be committed to.
It's a bit like `.gitignore`, but local only.
It doesn't affect the repository itself.

The information for which files to checkout is stored in a file `$GIT_DIR/info/sparse-checkout` and the contents have a similar syntax of the `.gitignore` file.
So using a line like `!/folder/my-folder-to-ignore` would remove that folder from your working directory, while never affecting it on the remote repository.

Now the idea is to remove those folders that are irrelevant to the project you're working on by adding their paths to the `sparse-checkout` file.
When a new checkout is performed, the changes in the file are applied and you would have a little less clutter in your workspace.

If you want to know more details and some extra commands, read [this GitHub blog post](https://github.blog/2020-01-17-bring-your-monorepo-down-to-size-with-sparse-checkout/) from Derrick Stolee.

## The tool

Of course it's always better to automate these things to reduce errors.
I developed a tool [nx-sparse-checkout](https://www.npmjs.com/package/nx-sparse-checkout), which can be added to a workspace using Nx 8.11 and above.
I borrowed the idea from [KwintenP](https://twitter.com/kwintenp), updated it for use in Nx 8 and made some other enhancements to better the user experience.

<div style="text-align: center;">
  <img src="/img/2020-03-31-nx-sparse-checkout/example.gif" alt="Example of nx-sparse-checkout" width="100%" height="100%">
</div>

The tool allows you to choose the projects you want to checkout (either comma-separated or interactive) and then uses Nx's dependency graph to determine which projects your selection is depending on and adds those to the list of projects to checkout.
It then sets all projects that are not needed to be ignored using the `sparse-checkout` file.
This way all other files (like package.json, tsconfig.json, etc...) and other folders (like tools) are still available to you.
Resetting can be done by either selecting everything or passing the `--all` parameter.

Using this technique, you have the advantages of a monorepo, while not having to deal with an enormous folder structure.
