class HomeController < ApplicationController
  def index
  end
  
  def gallery
    @galleries = Gallery.all
  end
end
