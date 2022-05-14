module Documentation
  class ImageThumbnailsController < ApplicationController
    before_action :set_page

    def index
      @images = @page.images

      render layout: false
    end

    def set_page
      @page = Page.find(params[:page_id])
    end
  end
end
