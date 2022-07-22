# frozen_string_literal: true

module Documentation
  class DocumentsController < ApplicationController
    include ActionView::RecordIdentifier

    before_action :set_page

    def index
      @documents = @page.documents

      render layout: false
    end
    
    def create
      @page.documents.attach(params[:documents])

      redirect_to page_documents_path(@page)
    end

    def destroy
      @document = @page.documents.find(params[:id])
      @document.destroy

      render turbo_stream: turbo_stream.remove(dom_id(@document))
    end

    def set_page
      @page = Page.find(params[:page_id])
    end
  end
end
