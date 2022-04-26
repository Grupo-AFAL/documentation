module Documentation
  class ImagesController < ApplicationController
    include ActionView::RecordIdentifier

    before_action :set_page

    def index
      @images = @page.images

      render layout: false
    end

    def create
      @page.images.attach(params[:images])

      redirect_to page_images_path(@page)
    end

    def destroy
      @image = @page.images.find(params[:id])
      @image.destroy

      render turbo_stream: turbo_stream.remove(dom_id(@image))
    end

    def set_page
      @page = Page.find(params[:page_id])
    end
  end
end
