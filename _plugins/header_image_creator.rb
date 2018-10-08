require 'mini_magick'

module HeaderImageCreator
  def create(image_file)
    image = MiniMagick::Image.read(image_file)

    image.combine_options do |c|
      c.blur "5x5"
      c.fill "#464646"
      c.colorize "80%"
    end

    image
  end

  module_function :create
end

# all credit goes to https://github.com/koic/blur_image