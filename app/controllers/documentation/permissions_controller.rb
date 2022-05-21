# frozen_string_literal: true

module Documentation
  class PermissionsController < ApplicationController
    include ActionView::RecordIdentifier

    before_action :set_workspace
    before_action :set_permission, only: %i[update destroy]

    def index
      @grouped_permissions = @workspace.permissions
                                       .includes(:subject)
                                       .group_by(&:subject_type)

      @permission = @workspace.permissions.build
    end

    def create
      @permission = @workspace.permissions.build(permission_params)
      
      if @permission.save
        @new_permission = @workspace.permissions.build
      end

      @subject_type = permission_params[:subject_type]
    end

    def update
      @permission.update(permission_params)

      head :ok
    end

    def destroy
      @permission.destroy

      render turbo_stream: turbo_stream.remove(dom_id(@permission))
    end

    private

    def set_permission
      @permission = @workspace.permissions.find(params[:id])
    end

    def set_workspace
      @workspace = Workspace.find(params[:workspace_id])
    end

    def permission_params
      params.require(:permission).permit(:subject_id, :subject_type, :action)
    end
  end
end
