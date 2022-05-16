# frozen_string_literal: true

module Documentation
  class WorkspacesController < ApplicationController
    before_action :set_workspace, only: %i[show edit update destroy]

    def index
      @workspaces = Workspace.all
    end

    def new
      @workspace = Workspace.new
    end

    def show
      @workspaces = Workspace.all
      @home_page = @workspace.home_page
      @root_pages = @workspace.pages.roots.include_tree
    end

    def edit; end

    def create
      @workspace = Workspace.new(workspace_params)

      if @workspace.save
        redirect_to workspace_url(@workspace), notice: 'Workspace was successfully created.'
      else
        render :new, status: :unprocessable_entity
      end
    end

    def update
      if @workspace.update(workspace_params)
        redirect_to workspace_url(@workspace), notice: 'Workspace was successfully updated.'
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def destroy
      @workspace.destroy
      redirect_to workspaces_url, notice: 'Workspace was successfully destroyed.'
    end

    private

    def set_workspace
      @workspace = Workspace.find(params[:id])
    end

    def workspace_params
      params.require(:workspace).permit(:name)
    end
  end
end
