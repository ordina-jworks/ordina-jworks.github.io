# Ordina JWorks Tech Blog

## Running the blog with Docker

    - When running on Windows, make sure your drive is shared with Docker (docker settings)
    - Execute `docker-compose up -d`
    - Browse to [http://localhost:4000/](http://localhost:4000/)
    - After making changes in the blog run, the blog is automatically rebuilt

## Setting up Jekyll on your Mac or Linux
You need to have at least Ruby 2.4.0 installed, this can be easily accomplished by using [rvm](https://rvm.io).

Execute the following commands:

    $ rvm install 2.4.0
    $ rvm use 2.4.0
    $ (sudo) gem install bundler
    $ bundle install

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
- Make sure the image has a size of 500x293 or has at least the same ratio
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
