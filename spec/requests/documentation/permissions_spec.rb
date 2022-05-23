# frozen_string_literal: true

require 'rails_helper'

module Documentation
  RSpec.describe 'Page Permissions', type: :request do
    include Engine.routes.url_helpers

    fixtures 'documentation/permissions', 'documentation/pages',
             'documentation/workspaces', 'users'

    let(:comedor) { documentation_workspaces(:comedor) }
    let(:permission) { documentation_permissions(:user_comedor) }
    let(:user) { users(:super_admin) }

    describe 'GET /index' do
      it 'renders a list of workspace permissions' do
        get workspace_permissions_url(comedor)

        expect(response).to have_http_status(:success)
        expect(response.body).to include('Super Admin')
        expect(response.body).to include('full')
      end
    end

    describe 'POST /create' do
      context 'valid params' do
        it 'creates a permission' do
          expect do
            post workspace_permissions_url(comedor), params: {
              permission: {
                subject_id: user.id,
                subject_type: user.class.name,
                action: :read
              }
            }, headers: turbo_stream_headers
          end.to change(Permission, :count).by(1)
        end
      end

      context 'with invalid parameters' do
        it 'does not create a new Permission' do
          expect do
            post workspace_permissions_url(comedor), params: {
              permission: {
                subject_type: user.class.name,
                action: :read
              }
            }, headers: turbo_stream_headers
          end.to change(Permission, :count).by(0)
        end
      end
    end

    describe 'PATCH /update' do
      context 'with valid params' do
        it 'updates the permission action' do
          expect(permission.action).to eql('full')

          patch workspace_permission_url(comedor, permission), params: {
            permission: {
              action: :read
            }
          }, headers: turbo_stream_headers

          permission.reload
          expect(permission.action).to eql('read')
        end
      end
    end

    describe 'DELETE /destroy' do
      it 'destroys the permission' do
        expect do
          delete workspace_permission_url(comedor, permission), headers: turbo_stream_headers
        end.to change(Permission, :count).by(-1)
      end
    end
  end
end
