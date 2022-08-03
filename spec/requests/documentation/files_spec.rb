# frozen_string_literal: true

require 'rails_helper'

module Documentation
  RSpec.describe 'Files', type: :request do
    include Engine.routes.url_helpers

    fixtures 'documentation/pages'

    let(:page) { documentation_pages(:comedor_home_page) }
    let(:file) { fixture_file_upload('file.pdf', 'application/pdf') }

    describe 'GET /index' do
      it 'renders a list of files' do
        get page_files_path(page)

        expect(response).to have_http_status(:success)
        expect(response.body).to include('Name', 'Type', 'Uploaded at')
      end
    end

    describe 'GET /create' do
      it 'creates a new file' do
        post page_files_path(page), params: {
          images: [file]
        }
        expect(response).to redirect_to(page_files_path(page))
      end
    end

    describe 'GET /destroy' do
      it 'destroys a file' do
        page.files.attach(file)

        delete page_file_path(page, page.files.first)
        expect(response).to have_http_status(:success)
      end
    end
  end
end
