# frozen_string_literal: true

module Documentation
  class FilesController < ApplicationController
    before_action :set_page
    def index
      @images = @page.images
      @documents = @page.documents
    end

    private

    def set_page
      @page = Page.find(params[:page_id])
    end
  end
end
