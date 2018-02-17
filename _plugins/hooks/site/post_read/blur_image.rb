require 'blur_image'


Jekyll::Hooks.register :site, :post_write do |site|
    puts 'Blur posts background images'

    site.posts.docs.each { |post|
        @image = '_site' + post.data['image']
        original_image = File.read(@image)
        blurred_image = BlurImage.blur(original_image, 5)

        @image.insert(@image.rindex('.'), '_blur')
        blurred_image.write(@image)
    }
end