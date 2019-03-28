---
layout: post
authors: [gert_vermeersch]
title: 'How to create a blog post on this blog'
image: /img/how-to-blog/git-logo.png
tags: [git,blog]
category: Git
comments: false
---

# How to blog on this blog

In the SAP world, not everyone needs or uses Git everyday. This short introduction aimed at Ordina SAP members will teach you how to write a blog post on this site. During this tutorial, you will also learn the basics of Git.

## Table of contents
- [How to blog on this blog](#how-to-blog-on-this-blog)
  - [Table of contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Clone the blog](#clone-the-blog)
  - [Create a new feature](#create-a-new-feature)
  - [Write your blog entry](#write-your-blog-entry)

## Prerequisites

To write a new blog post, you only need one tool: Git, you can get it [here](https://git-scm.com/downloads). To make life easier, I also recommend to install [Sourcetree](https://www.sourcetreeapp.com/) or another graphical git tool. It is especially useful for new git users or people who don't feel at home on the command line.

You can write the blog post just using notepad or any editor, but I recommend a more savvy editor like Visual Studio Code with a Markdown plugin.

You need to have an accout on Github and be a member of the SAP team on Github before you can really do anything.

If you want to test and run the blog locally, you need to install Docker. In the Readme file of the repository is described how to run it.

## Clone the blog

By cloning the blog, you will take a copy of the source code (the repository) from Github and put it on your local drive. After you have written your article, you can 'push' the changes to Github again. Another person who has cloned the repository before can then 'pull' your changes into his local copy. This way everyone stays in sync.

You can either clone the repository using the git command line:
```
git clone https://github.com/ordina-sap/ordina-sap.github.io.git
```

Using Sourcetree:

<img alt="Create site" src="{{ '/img/how-to-blog/git-clone.jpg' | prepend: site.baseurl }}" class="image fit">

After the clone operation, you will have a local copy of the blog on your computer.

## Create a new feature

Git works with branches, this means that you can kind of split of code and work on something entirely isolated from other people's changes. This is not the entire story but enough to work on a new blog post ;-). 

```
git checkout -b feature/2019-03-27-how-to-blog
```

or using Sourcetree

<img alt="Create site" src="{{ '/img/how-to-blog/create-branch.jpg' | prepend: site.baseurl }}" class="image fit">

<img alt="Create site" src="{{ '/img/how-to-blog/create-branch-dialog.jpg' | prepend: site.baseurl }}" class="image fit">

After creating the branch you can start writing the actual article.

## Write your blog entry

Go to the folder where you cloned the git repository, or open it with Visual Studio Code. Create a new file in the '_posts' folder, e.g.

```
2019-03-27-how-to-blog.md
```

If you're unfamiliar with MarkDown, try looking at existing articles to see how it works. For instance, you will see that every post starts with a header.

```markdown
---
layout: post
authors: [gert_vermeersch]
title: 'How to create a blog post on this blog'
image: /img/how-to-blog/git-logo.png
tags: [git,blog]
category: Git
comments: false
---
``` 


