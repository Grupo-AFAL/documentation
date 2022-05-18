# frozen_string_literal: true

require 'rails_helper'
module Documentation
  RSpec.describe '/pages', type: :request do
    include Engine.routes.url_helpers

    fixtures 'documentation/pages', 'documentation/workspaces'

    let(:comedor) { documentation_workspaces(:comedor) }
    let(:comedor_recipes) { documentation_pages(:comedor_recipes) }
    let(:headers) { { 'ACCEPT' => 'application/json' } }

    before(:all) do
      User.create(super_admin: true)
    end

    after(:all) do
      User.destroy_all
    end

    describe 'GET /index' do
      it 'returns a JSON list of pages' do
        get workspace_pages_url(comedor), headers: headers
        expect(response).to be_successful

        expect(json_body.size).to eql(3)
        expect(json_body[0]).to include('title' => 'Comedor Home Page')
        expect(json_body[1]).to include('title' => 'My Recipes')
        expect(json_body[2]).to include('title' => 'My Recipes details')
      end

      it 'returns a list of matching pages' do
        get workspace_pages_url(comedor), params: { title: 'Recipes' }, headers: headers

        expect(json_body.size).to eql(2)
        expect(json_body[0]).to include('title' => 'My Recipes')
        expect(json_body[1]).to include('title' => 'My Recipes details')
      end
    end

    describe 'GET /show' do
      it 'renders the page content' do
        get workspace_page_url(comedor, comedor_recipes)
        expect(response).to be_successful
        expect(response.body).to include(comedor_recipes.title)
        expect(response.body).to include(comedor_recipes.description)
      end
    end

    describe 'GET /new' do
      xit 'renders a successful response' do
        get new_page_url
        expect(response).to be_successful
      end
    end

    describe 'GET /edit' do
      xit 'render a successful response' do
        page = Page.create! valid_attributes
        get edit_page_url(page)
        expect(response).to be_successful
      end
    end

    describe 'POST /create' do
      context 'with valid parameters' do
        xit 'creates a new Page' do
          expect do
            post pages_url, params: { page: valid_attributes }
          end.to change(Page, :count).by(1)
        end

        xit 'redirects to the created page' do
          post pages_url, params: { page: valid_attributes }
          expect(response).to redirect_to(page_url(Page.last))
        end
      end

      context 'with invalid parameters' do
        xit 'does not create a new Page' do
          expect do
            post pages_url, params: { page: invalid_attributes }
          end.to change(Page, :count).by(0)
        end

        xit "renders a successful response (i.e. to display the 'new' template)" do
          post pages_url, params: { page: invalid_attributes }
          expect(response).to be_successful
        end
      end
    end

    describe 'PATCH /update' do
      context 'with valid parameters' do
        let(:new_attributes) do
          skip('Add a hash of attributes valid for your model')
        end

        xit 'updates the requested page' do
          page = Page.create! valid_attributes
          patch page_url(page), params: { page: new_attributes }
          page.reload
          skip('Add assertions for updated state')
        end

        xit 'redirects to the page' do
          page = Page.create! valid_attributes
          patch page_url(page), params: { page: new_attributes }
          page.reload
          expect(response).to redirect_to(page_url(page))
        end
      end

      context 'with invalid parameters' do
        xit "renders a successful response (i.e. to display the 'edit' template)" do
          page = Page.create! valid_attributes
          patch page_url(page), params: { page: invalid_attributes }
          expect(response).to be_successful
        end
      end
    end

    describe 'DELETE /destroy' do
      xit 'destroys the requested page' do
        page = Page.create! valid_attributes
        expect do
          delete page_url(page)
        end.to change(Page, :count).by(-1)
      end

      xit 'redirects to the pages list' do
        page = Page.create! valid_attributes
        delete page_url(page)
        expect(response).to redirect_to(pages_url)
      end
    end
  end
end
