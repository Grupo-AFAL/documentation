# frozen_string_literal: true

module Documentation
  class FilesController < ApplicationController
    include ActionView::RecordIdentifier
    before_action :set_page

    def index
      @files = @page.files

      render layout: false
    end

    def create
      @page.files.attach(params[:files])

      redirect_to page_files_path(@page)
    end

    def destroy
      @file = @page.files.find(params[:id])
      @file.destroy

      render turbo_stream: turbo_stream.remove(dom_id(@file))
    end

    def set_page
      @page = Page.find(params[:page_id])
    end
  end
end
