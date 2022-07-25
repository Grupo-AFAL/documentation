# frozen_string_literal: true

require 'rails_helper'

module Documentation
  RSpec.describe 'Images', type: :request do
    include Engine.routes.url_helpers

    fixtures 'documentation/pages'

    let(:page) { documentation_pages(:comedor_home_page) }
    let(:image_file) { fixture_file_upload('document.png', 'image/png') }

    describe 'GET /index' do
      it 'renders a list of images' do
        get page_images_path(page)

        expect(response).to have_http_status(:success)
        expect(response.body).to include('No images selected', 'Choose images')
      end
    end

    describe 'GET /create' do
      it 'creates a new image' do
        post page_images_path(page), params: {
          images: [image_file]
        }
        expect(response).to redirect_to(page_images_path(page))
      end
    end

    describe 'GET /destroy' do
      it 'destroys an image' do
        page.images.attach(image_file)

        delete page_image_path(page, page.images.first)
        expect(response).to have_http_status(:success)
      end
    end
  end
end
