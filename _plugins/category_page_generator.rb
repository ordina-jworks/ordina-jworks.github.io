#------------------------------------------------------------------------
# encoding: utf-8
# @(#)category_page_generator.rb	1.00 06-Mar-2016 18:29
#
# Copyright (c) 2016 Tim Ysewyn for JWorks. All Rights Reserved.
# Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
#
# Description:  A generator that creates category pages for jekyll sites.
#       Uses the FrontMatter tags from all the posts to generate the files.
#
# Included filters : (none)
#------------------------------------------------------------------------

module Jekyll
    class CategoryPage < Page
        def initialize( site, base, category )
            @site = site
            @base = base
            @dir = "categories/#{category.downcase.gsub(' ','-')}"
            @name = "index.html"
            
            self.process(@name)
            self.read_yaml(File.join(base, '_layouts'), 'by_category.html')
            self.data['category'] = category
        end
    end
    
    class CategoryPageGenerator < Generator
        safe true

        def generate( site )
            if site.layouts.key? 'by_category'
                site.categories.each_key do |category|
                    site.pages << CategoryPage.new( site, site.source, category )
                end
            end
        end
    end
end