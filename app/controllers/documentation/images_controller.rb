module Documentation
  class ImagesController < ApplicationController
    before_action :set_page

    def index
      @images = @page.images

      render layout: false
    end

    def create
      @page.images.attach(params[:images])

      redirect_to page_images_path(@page)
    end

    def destroy; end

    def set_page
      @page = Page.find(params[:page_id])
    end
  end
end
