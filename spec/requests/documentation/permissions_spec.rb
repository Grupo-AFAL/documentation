# frozen_string_literal: true

require 'rails_helper'

module Documentation
  RSpec.describe 'Page Permissions', type: :request do
    include Engine.routes.url_helpers

    fixtures 'documentation/permissions', 'documentation/pages',
             'documentation/workspaces', 'users'

    let(:comedor) { documentation_workspaces(:comedor) }

    describe 'GET /index' do
      it 'renders a list of workspace permissions' do
        get workspace_permissions_url(comedor)

        expect(response).to have_http_status(:success)
        expect(response.body).to include('Super Admin')
        expect(response.body).to include('full')
      end
    end
  end
end
