# frozen_string_literal: true

module Documentation
  class AttachmentsController < ApplicationController
    before_action :set_page

    def index
      @images = @page.images
      @files = @page.files
    end

    private

    def set_page
      @page = Page.find(params[:page_id])
    end
  end
end
