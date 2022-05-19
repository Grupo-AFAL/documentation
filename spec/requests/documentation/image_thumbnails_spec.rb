# frozen_string_literal: true

require 'rails_helper'

module Documentation
  RSpec.describe 'Image Thumbnails', type: :request do
    include Engine.routes.url_helpers

    fixtures 'documentation/pages'

    let(:page) { documentation_pages(:comedor_home_page) }

    describe 'GET /index' do
      it 'renders a list of image thumbnails' do
        get page_image_thumbnails_url(page)

        expect(response).to have_http_status(:success)
      end
    end
  end
end
