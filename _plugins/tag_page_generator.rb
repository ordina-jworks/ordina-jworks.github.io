#------------------------------------------------------------------------
# encoding: utf-8
# @(#)tag_page_generator.rb	1.00 06-Mar-2016 18:29
#
# Copyright (c) 2016 Tim Ysewyn for JWorks. All Rights Reserved.
# Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
#
# Description:  A generator that creates tag pages for jekyll sites.
#       Uses the FrontMatter tags from all the posts to generate the files.
#
# Included filters : (none)
#------------------------------------------------------------------------

module Jekyll
    class TagPage < Page
        def initialize( site, base, tag )
            @site = site
            @base = base
            @dir = "tags/#{tag.downcase.gsub(' ','-')}"
            @name = "index.html"
            
            self.process(@name)
            self.read_yaml(File.join(base, '_layouts'), 'by_tag.html')
            self.data['tag'] = tag
        end
    end
    
    class TagPageGenerator < Generator
        safe true

        def generate( site )
            if site.layouts.key? 'by_tag'
                site.tags.each_key do |tag|
                    site.pages << TagPage.new( site, site.source, tag )
                end
            end
        end
    end
end