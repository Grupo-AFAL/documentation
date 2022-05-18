# frozen_string_literal: true

require 'rails_helper'

module Documentation
  RSpec.describe 'Images', type: :request do
    fixtures 'documentation/pages'

    let(:page) { documentation_pages(:home_page) }

    describe 'GET /index' do
      it 'renders a list of images' do
        get documentation.page_images_path(page)

        expect(response).to have_http_status(:success)
        expect(response.body).to include('Images')
      end
    end

    describe 'GET /create' do
      xit 'creates a new image' do
        get '/page/images/create'
        expect(response).to have_http_status(:success)
      end
    end

    describe 'GET /destroy' do
      xit 'returns http success' do
        get '/page/images/destroy'
        expect(response).to have_http_status(:success)
      end
    end
  end
end
