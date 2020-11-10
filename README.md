# Ordina JWorks Tech Blog

The JWorks Tech Blog is powered by [Jekyll](https://jekyllrb.com).
The blog posts are written in [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) and are converted to HTML by Jekyll.
Most code editors and IDEs have support for Markdown files.
Some of them, such as IntelliJ, offer a preview view to see the result as you type.

For running the blog locally you can either opt for using Docker or setting up Jekyll yourself.

## Running the blog with Docker

    - When running on Windows, make sure your drive is shared with Docker (Docker settings)
    - Execute `docker-compose up -d`
    - Browse to [http://localhost:4000/](http://localhost:4000/)
    - After making changes in the blog, the blog is automatically rebuilt

## Setting up Jekyll on your Mac or Linux

Prerequisites: 
- Ruby (>= 2.4.0): this can be easily accomplished by using [rvm](https://rvm.io).
- ImageMagick: this can be easily accomplished by using [Homebrew](https://brew.sh/).

After installing RVM and Homebrew, execute the following commands to install Ruby and ImageMagick and set up Jekyll:

    $ rvm install 2.4.0
    $ rvm use 2.4.0
    $ (sudo) gem install bundler
    $ bundle install
    $ brew install imagemagick

Note that setting the Ruby version via `rvm use 2.4.0` is only active for the current session.
In order to set 2.4.0 as the default Ruby version you can use the following command:

    $ rvm --default use 2.4.0
    
If you are unable to run `rvm install 2.4.0` execute the following:

    $ /bin/bash --login 
    $ source ~/.rvm/scripts/rvm; 
    $ rvm use 2.4.0

## Running Jekyll on your Mac or Linux
- Run `jekyll serve` in the root directory of the tech blog
    - If your post is to be published in the future, run `jekyll serve --future`
- Browse to [http://localhost:4000/](http://localhost:4000/)

## Add yourself as an author
- Create a **feature branch**, starting from **source**: feature/author-update-john-doe
- Add yourself to the **_data/authors.yml** file
- Add a picture of yourself to the **img** folder
- Create a **pull request**, this will be reviewed and merged by one of the competence leaders

## Create a new blog post
- Create a **feature branch**, starting from **source**: `feature/yyyy-mm-dd-john-doe-hello-world`
- Add a blog post image to the **img** directory
- Use any (online) **Markdown editor** (for example [brackets](http://brackets.io) or [classeur.io](http://classeur.io))
- Add following [**FrontMatter**](http://jekyllrb.com/docs/frontmatter/) tags on the top of your post (you can also copy-paste this from another post)
    - layout: post
    - authors: {author(s)}
    - outbound: {outbound(s)} - optional, see `outbound.yml` file. It is possible to point to external pages or related internal pages. Never point to (external) pages that are likely to be non-existent in the future, since this is bad for our SEO. Images must be placed in the `img/outbound/` folder and must be 480 x 360. When pointing to *Ordina* pages don't forget to add the following query param for statistics: `&utm_source=ordina_jworks_tech_blog`.
    - title: {title}
    - image: {image_path}
    - tags: {tags}
    - category: {category}
    - comments: true
- Write your blog post
- Save your file in the **_posts** directory using the following file format: *{year}-{month}-{day}-{title}.md*
	- **example**: *2015-11-09-Awesome-Blog-Post.md*
- Be sure to publish as **plain text**! (Jekyll will generate the static HTML for us)
- Make sure the image is a JPEG file and has a resolution of 500x293 or has at least the same ratio
- Tweak and commit your changes until you feel satisfied with it
- Be sure to verify that your blog post is shown correctly on mobile (most desktop browsers support mobile view or just reduce your window's width to test this), it is important that images, videos and presentations scale down correctly. 
On images this can be achieved by specifying: `class="image fit"`.

### Tabset for codeblocks

Codeblocks can be shown parallel from each other. When selecting a coding language the selection will be applied for the whole blog post.

Each tabset exists of two main blocks
- tab headers: an ul, appended with the css class `tabs`, consisting of link elements, appended with an id  
- tab content: all corresponding codeblocks, appended with the corresponding tab header id and the css class `tab-content`
 
<pre>

{: .tabs } 
- [Java](#/){: #tab-1 }
- [Kotlin](#/){: #tab-2 }


```java
// hello
System.out.println("Hello");
```
{: #tab-1 .tab-content }

```kotlin
// hello world
println("Hello World!")
```
{: #tab-2 .tab-content }

</pre>

Make sure the corresponding ids for the header and the content block for the same language are consistent throughout the blog post.
This provides the possibility of different tabsets with different coding languages.  
For an example, check the [Keycloak blogpost from 22/08/2019](_posts/2019-08-22-Securing-Web-Applications-With-Keycloak.md). 
There is an example of Regular install / Docker and also Gradle / Maven.

## Table of contents

You can auto-generate the table of contents:

```md
# Table of contents
{:.no_toc}
- TOC
{:toc}
```
  
## Style guide

Write a blog post as if you were writing code.
Adopt the [**one sentence per line** method](https://raw.githubusercontent.com/brandon-rhodes/blog/master/texts/brandon/2012/one-sentence-per-line.rst).

By starting a new line at the end of each sentence,
and splitting sentences themselves at natural breaks between clauses,
a text file becomes far easier to edit and version control.

This allows commenting on specific sentences in a pull request.
If a change is made to a sentence,
the diff will only show the difference between the old and new sentence,
and not the complete paragraph.

## SASS usage

When giving layout to components in your blog,
please take a look in the existing stylesheets if there isn't a class which you can reuse.
This way we keep our stylesheet files clean.

If you want to add styling,
please use the SASS files,
otherwise the SASS compilation process will overwrite your changes.

You can find SASS files in two locations:

- Partial files (beginning with `_`) need to go in the `_sass` directory
- Main files,
which need to be picked up by Jekyll and converted to CSS,
need to go in the `css` directory.
These files need to begin with two lines of `---` for Jekyll to pick them up for later compilation.

You can read more on Jekyll and SASS integration [here](https://jekyllrb.com/docs/assets/).

## Submit your blog post for publication
- Create a **pull request** and ask people to proof read your new blog post (we don't want to have any spelling mistakes, do we? ;))
- If changes need to be made, you can just commit and push to the original feature branch
- When your blog post has been reviewed, one of the competence leaders will approve and merge your pull request.
- Congratulations! Your blog post is now visible to the whole world! :)
- Don't forget to share your post with your colleagues and the social media (Twitter, LinkedIn, ...)!

## Reviewing blog posts
The reviewing of blog posts is not only limited to competence leads, everybody may review blog posts!
We even appreciate it if you would like to review a blog post.
Reviewing is done on GitHub itself by navigating to the **Files changed**-tab of a pull request.
Once there you can add comments to each line of a specific file.
Feel free to use GitHub's new **suggestion** functionality to suggest changes as this allows the author to easily merge your suggestions into their post.

We want our blog posts to ooze quality.
As a reviewer you should verify the following things:
- Professional English is used without any typos
- The styling fits both on desktop browsers and mobile devices (images, videos and presentations must scale down correctly)
- Links to external websites should open in a new tab as we want our readers to stay on our Tech Blog as long as possible
    - eg: `[foo](http://bar.com){:target="_blank" rel="noopener noreferrer"}`

Feel free to share your opinion about something for example if you would like see a specific part explained more clearly or if you want the author to cover something that is missing.
