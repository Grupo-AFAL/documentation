# frozen_string_literal: true

require 'rails_helper'

module Documentation
  RSpec.describe 'Page Transfers', type: :request do
    include Engine.routes.url_helpers

    fixtures 'documentation/permissions', 'documentation/pages',
             'documentation/workspaces', 'users'

    let(:comedor_recipes_details) { documentation_pages(:comedor_recipes_details) }
    let(:comedor) { documentation_workspaces(:comedor) }
    let(:guarderia) { documentation_workspaces(:guarderia) }

    describe 'PATCH /update' do
      it 'transfers a page to another workspace' do
        patch workspace_page_transfer_url(comedor, comedor_recipes_details),
              params: { page: { documentation_workspace_id: guarderia.id } }

        comedor_recipes_details.reload
        expect(response).to have_http_status(:see_other)
        expect(comedor_recipes_details.workspace).to eql(guarderia)
        expect(comedor_recipes_details.parent_id).to be nil
      end
    end
  end
end
