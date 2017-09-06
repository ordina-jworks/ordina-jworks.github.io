#------------------------------------------------------------------------
# encoding: utf-8
# @(#)author_page_generator.rb	1.00 05-Mar-2016 20:37
#
# Copyright (c) 2016 Tim Ysewyn for JWorks. All Rights Reserved.
# Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
#
# Description:  A generator that creates author pages for jekyll sites.
#       Uses a JSON data file as the database file from which to read and
#		generate the files.
#
# Included filters : (none)
#------------------------------------------------------------------------

module Jekyll
    class AuthorPage < Page
        def initialize( site, base, author )
            @site = site
            @base = base
            @dir = author["permalink"]
            @name = 'index.html'
            
            self.process(@name)
            self.read_yaml(File.join(base, '_layouts'), 'author.html')
            self.data['layout'] = 'author'
            self.data['title'] = "#{author['first_name']} #{author['last_name']}"
            self.data['author'] = author
        end
    end
    
    class AuthorPageGenerator < Generator
        safe true

        def generate( site )
            if site.layouts.key? 'author'
                site.data["authors"].each do |author, data|
                    site.pages << AuthorPage.new( site, site.source, data )
                end
            end
        end
    end
end