require 'rails_helper'

RSpec.describe 'Images', type: :request do
  describe 'GET /index' do
    it 'returns http success' do
      get '/page/images/index'
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET /create' do
    it 'returns http success' do
      get '/page/images/create'
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET /destroy' do
    it 'returns http success' do
      get '/page/images/destroy'
      expect(response).to have_http_status(:success)
    end
  end
end
