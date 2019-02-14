Jekyll::Hooks.register :site, :post_read do |site|
    puts 'Enriching posts with link to authors'
    puts 'Enriching posts with outbound links'
    
    site.posts.docs.each { |post|
        post.data['authors'].collect! { |author_username|
            site.data['authors'][author_username]
        }.compact!

        if post.data['outbound']
            post.data['outbound'].collect! { |source|
                site.data['outbound'][source]
            }.compact!
        end
    }
end