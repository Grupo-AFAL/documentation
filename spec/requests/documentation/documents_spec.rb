# frozen_string_literal: true

require 'rails_helper'

module Documentation
  RSpec.describe 'Documents', type: :request do
    include Engine.routes.url_helpers

    fixtures 'documentation/pages'

    let(:page) { documentation_pages(:comedor_home_page) }
    let(:document_file) { fixture_file_upload('file.pdf', 'application/pdf') }

    describe 'GET /index' do
      it 'renders a list of documents' do
        get page_documents_path(page)

        expect(response).to have_http_status(:success)
        expect(response.body).to include('Name', 'Type', 'Uploaded at')
      end
    end

    describe 'GET /create' do
      it 'creates a new document' do
        post page_documents_path(page), params: {
          images: [document_file]
        }
        expect(response).to redirect_to(page_documents_path(page))
      end
    end

    describe 'GET /destroy' do
      it 'destroys a document' do
        page.documents.attach(document_file)

        delete page_document_path(page, page.documents.first)
        expect(response).to have_http_status(:success)
      end
    end
  end
end
