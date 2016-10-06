# Ordina JWorks Tech Blog

## Setting up and running Jekyll on your Windows (with docker)

    - Make sure your drive is shared with docker (docker settings)
    - Make sure your cloned repo is on the path C:\Users\
    - Open a command prompt inside your cloned repo
    - Execute `docker run --name jekyll --label=jekyll --volume=%cd%:/srv/jekyll -it -p 127.0.0.1:4000:4000 jekyll/jekyll`
    - Browse to [http://localhost:4000/](http://localhost:4000/)
    - After making changes in the blog run `docker start jekyll -i` to rebuild and watch the blog
    
## Setting up Jekyll on your Mac or Linux
Execute following commands:
    
    Make sure you have the ruby headers installed.
    for Ubuntu and other distributions using Debian style packaging
    - sudo apt-get install ruby2.3-dev(make sure this matches your ruby version)
    
    then
    - `(sudo) gem install bundler`
    - `bundler install`

## Running Jekyll on your Mac or Linux
- Run `jekyll serve` in the root directory of the tech blog
- Browse to [http://localhost:4000/](http://localhost:4000/)

## Add yourself as an author
- Create a **feature branch**, starting from **source**: feature/author-update-john-doe
- Add yourself to the **_data/authors.yml** file
- Add a picture of yourself to the **img** folder
- **Rebase** your changes onto the **source** branch
- Create a **pull request**, this will be reviewed and merged by one of the competence leaders

## Create a new blog post
- Create a **feature branch**, starting from **source**: feature/yyyy-mm-dd-john-doe-hello-world
- Add a blog post image to the **img** directory
- Use any (online) **Markdown editor** (for example [brackets](http://brackets.io) or [classeur.io](http://classeur.io))
- Add following [**FrontMatter**](http://jekyllrb.com/docs/frontmatter/) tags on the top of your post (you can also copy-paste this from another post)
    - layout: post
    - authors: {author(s)}
    - title: {title}
    - image: {image_path}
    - tags: {tags}
    - category: {category}
    - comments: true
- Write your blog
- Save your file in the **_post** directory using the following file format: *{year}-{month}-{day}-{title}.md*
	- **example**: *2015-11-09-Awesome-Blog-Post.md*
- Be sure to publish as **plain text**! (Jekyll will generate the static HTML for us)
- Tweak and commit your changes until you feel satisfied with it

## Submit your blog post for publication
- **Rebase** your changes onto the **source** branch
- Create a **pull request** and ask people to proof read your new blog post (we don't want to have any spelling mistakes, do we? ;))
- If changes need to be made, you can just commit and push to the original feature branch
- When your blog post has been reviewed, one of the competence leaders will approve and merge your pull request.
- Congratulations! Your blog post is now visible to the whole world! :)

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
