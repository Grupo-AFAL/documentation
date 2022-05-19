# frozen_string_literal: true

require 'rails_helper'

module Documentation
  RSpec.describe '/workspaces', type: :request do
    include Engine.routes.url_helpers

    fixtures 'documentation/permissions', 'documentation/pages',
             'documentation/workspaces', 'users'

    let(:comedor) { documentation_workspaces(:comedor) }
    let(:comedor_home_page) { documentation_pages(:comedor_home_page) }

    describe 'GET /index' do
      it 'returns a list of worskpaces' do
        get workspaces_url

        expect(response).to be_successful
        expect(response.body).to include('Comedor Ejecutivo')
      end
    end

    describe 'GET /show' do
      it 'renders the workspace home page' do
        get workspace_url(comedor)

        expect(response).to be_successful
        expect(response.body).to include(comedor_home_page.title)
      end
    end

    describe 'GET /new' do
      it 'renders a new workspace form' do
        get new_workspace_url
        expect(response).to be_successful
      end
    end

    describe 'GET /edit' do
      xit 'renders an existing workspace form' do
        get edit_workspace_url(comedor)
        expect(response).to be_successful
      end
    end

    describe 'POST /create' do
      context 'with valid parameters' do
        it 'creates a new workspace' do
          expect do
            post workspaces_url, params: { workspace: { name: 'Direccion' } }
          end.to change(Workspace, :count).by(1)
        end

        it 'redirects to the created workspace show' do
          post workspaces_url, params: { workspace: { name: 'Direccion' } }
          expect(response).to redirect_to(workspace_url(Workspace.last))
        end
      end

      context 'with invalid parameters' do
        it 'does not create a new workspace' do
          expect do
            post workspaces_url, params: { workspace: { name: '' } }
          end.to change(Workspace, :count).by(0)
        end

        it 'returns a unprocessable entity status' do
          post workspaces_url, params: { workspace: { name: '' } }
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end

    describe 'PATCH /update' do
      context 'with valid parameters' do
        it 'updates the requested workspace' do
          patch workspace_url(comedor), params: { workspace: { name: 'Dir General' } }
          comedor.reload
          expect(comedor.name).to eql('Dir General')
        end

        it 'redirects to the workspace' do
          patch workspace_url(comedor), params: { workspace: { name: 'Dir General' } }
          expect(response).to redirect_to(workspace_url(comedor))
        end
      end

      context 'with invalid parameters' do
        xit 'returns a unprocessable entity status' do
          patch workspace_url(comedor), params: { workspace: { name: '' } }
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end

    describe 'DELETE /destroy' do
      xit 'destroys the requested workspace' do
        expect do
          delete workspace_url(comedor)
        end.to change(Workspace, :count).by(-1)
      end

      xit 'redirects to the workspaces index' do
        delete workspace_url(comedor)
        expect(response).to redirect_to(workspaces_url)
      end
    end
  end
end
