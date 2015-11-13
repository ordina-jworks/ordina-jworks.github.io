# Ordina ORAJ Tech Blog
## Simplest way to blog
- Request write access to [the github repository](https://github.com/ordina-oraj/ordina-oraj.github.io)
- Go to any online Markdown editor (for example [classeur.io](https://app.classeur.io))
- Write your blog
- Don't forget the [FrontMatter](http://jekyllrb.com/docs/frontmatter/) tags at the top of your page
	- layout: post
	- category: {category}
	- author: {author}
	- title: {title}
	- image: {image_path}
- Publish the file to the github repository using the following file format:
	- *_posts/{year}-{month}-{day}-{title}.md*
	- **example**: *_posts/2015-11-09-Awesome-Blogpost.md*
- Be sure to publish as **plain text**! (Jekyll will generate the static HTML for us)
- Tweak your post and publish until you feel satisfied with it
- Add a post image to the *img* folder

## Add yourself as an author
- Add yourself to the **_data/authors.yml** file
- Create an **index.md** Markdown file in **authors/your-name** folder (your-name must match the key you created in the **_data/authors.yml** file
- Add a picture of yourself to the **img** folder
- Whenever you want to set yourself as an author to a post, add the **author: your-name** Frontmatter tag at the top of the Markdown file
