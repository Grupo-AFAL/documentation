# frozen_string_literal: true

require 'rails_helper'

module Documentation
  RSpec.describe '/pages', type: :request do
    include Engine.routes.url_helpers

    fixtures 'documentation/pages', 'documentation/workspaces'

    let(:comedor) { documentation_workspaces(:comedor) }
    let(:comedor_recipes) { documentation_pages(:comedor_recipes) }
    let(:comedor_recipes_details) { documentation_pages(:comedor_recipes_details) }
    let(:headers) { { 'ACCEPT' => 'application/json' } }
    let(:create_page_full_permission) do
      Documentation::Permission.create(subject: @user, object: comedor, action: :full)
    end

    let(:valid_attributes) do
      {
        title: 'Documenting stuff',
        description: 'stuff description',
        content: '<h1>Stuff</h1>',
        parent_id: nil
      }
    end

    before(:all) do
      @user = User.create(super_admin: true)
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
      it 'renders a new page form' do
        get new_workspace_page_url(comedor)
        expect(response).to be_successful
      end
    end

    describe 'GET /edit' do
      before { create_page_full_permission }

      it 'renders an existing page form' do
        get edit_workspace_page_url(comedor, comedor_recipes)
        expect(response).to be_successful
      end
    end

    describe 'POST /create' do
      context 'with valid parameters' do
        it 'creates a new Page' do
          expect do
            post workspace_pages_url(comedor), params: { page: valid_attributes }
          end.to change(Page, :count).by(1)
        end

        it 'redirects to the created page edit form' do
          post workspace_pages_url(comedor), params: { page: valid_attributes }
          expect(response).to redirect_to(edit_workspace_page_path(comedor, Page.last))
        end
      end

      context 'with invalid parameters' do
        it 'does not create a new Page' do
          expect do
            post workspace_pages_url(comedor), params: { page: { title: '' } }
          end.to change(Page, :count).by(0)
        end

        it 'returns a unprocessable entity status' do
          post workspace_pages_url(comedor), params: { page: { title: '' } }
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end

    describe 'PATCH /update' do
      before { create_page_full_permission }

      context 'with valid parameters' do
        it 'updates the requested page' do
          patch workspace_page_url(comedor, comedor_recipes),
                params: { page: { title: 'Nuevas recetas!' } }
          comedor_recipes.reload
          expect(comedor_recipes.title).to eql('Nuevas recetas!')
        end

        it 'redirects to the page' do
          patch workspace_page_url(comedor, comedor_recipes),
                params: { page: { title: 'Nuevas recetas!' } }
          expect(response).to redirect_to(workspace_page_path(comedor, comedor_recipes))
        end
      end

      context 'with invalid parameters' do
        it 'returns a unprocessable entity status' do
          patch workspace_page_url(comedor, comedor_recipes),
                params: { page: { title: '' } }
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end

    describe 'DELETE /destroy' do
      before { create_page_full_permission }

      it 'destroys the requested page' do
        expect do
          delete workspace_page_url(comedor, comedor_recipes_details)
        end.to change(Page, :count).by(-1)
      end

      it 'redirects to the workspace home' do
        delete workspace_page_url(comedor, comedor_recipes_details)
        expect(response).to redirect_to(workspace_url(comedor))
      end
    end
  end
end
