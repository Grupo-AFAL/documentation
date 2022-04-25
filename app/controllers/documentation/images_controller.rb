module Documentation
  class ImagesController < ApplicationController
    before_action :set_page

    def index
      @images = @page.images
    end

    def create; end

    def destroy; end

    def set_page
      @page = Page.find(params[:page_id])
    end
  end
end
