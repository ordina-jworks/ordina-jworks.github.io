Jekyll::Hooks.register :site, :post_write do |site|
    puts 'Creating header images for posts'

    @base = site.config['destination']

    site.posts.docs.each { |post|
        @image = File.join(@base, post.data['image'])
        original_image = File.read(@image)
        blurred_image = HeaderImageCreator.create(original_image)

        @image.insert(@image.rindex('.'), '_header')
        blurred_image.write(@image)
    }
end