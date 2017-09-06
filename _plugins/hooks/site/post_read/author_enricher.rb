Jekyll::Hooks.register :site, :post_read do |site|
    puts 'Enriching authors with link to posts'
    
    site.posts.docs.each { |post|
        post.data['authors'].each { |author_username|
            if site.data['authors'].include? author_username
                author = site.data['authors'][author_username]
                author['posts'] ||= Array.new
                author['posts'].push(post)
            end
        }
    }
end