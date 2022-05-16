# frozen_string_literal: true

module Documentation
  class PermissionsController < ApplicationController
    before_action :set_workspace

    def index
      @permissions = @workspace.permissions.includes(:subject)
    end

    def set_workspace
      @workspace = Workspace.find(params[:workspace_id])
    end
  end
end
