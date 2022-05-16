# frozen_string_literal: true

module Documentation
  class ImageThumbnailsController < ApplicationController
    def index
      @page = Page.find(params[:page_id])

      render layout: false
    end
  end
end
