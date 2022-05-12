module Documentation
  class PagesController < ApplicationController
    before_action :set_workspaces, except: %i[index]
    before_action :set_workspace
    before_action :set_root_pages, except: %i[index]
    before_action :set_page, only: %i[show edit update destroy]

    def index
      @pages = @workspace.pages
      @pages = @pages.merge!(Page.search(params[:title])) if params[:title]
    end

    def show; end

    def new
      @parent = @workspace.pages.find(params[:parent_id]) if params[:parent_id]
      @page = @workspace.pages.build(parent_id: @parent&.id)
      @pages = @workspace.pages
    end

    def edit
      @pages = @workspace.pages.excluding(@page)
    end

    def create
      @page = @workspace.pages.build(page_params)

      if @page.save
        redirect_to edit_workspace_page_path(@workspace, @page),
                    notice: 'Page was successfully created.'
      else
        render :new, status: :unprocessable_entity
      end
    end

    def update
      if @page.update(page_params)
        redirect_to workspace_page_path(@page.workspace, @page),
                    notice: 'Page was successfully updated.', status: 303
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def destroy
      if @page.destroy
        redirect_to workspace_url(@workspace),
                    notice: 'Page was successfully destroyed.', status: 303
      else
        redirect_to workspace_url(@workspace),
                    alert: @page.errors.full_messages.join(', '), status: 303
      end
    end

    private

    def set_page
      @page = Page.find(params[:id])
    end

    def page_params
      params.require(:page).permit(
        :title, :description, :content, :parent_id, :documentation_workspace_id
      )
    end

    def set_workspace
      @workspace = Workspace.find(params[:workspace_id])
    end

    def set_workspaces
      @workspaces = Workspace.all
    end

    def set_root_pages
      @root_pages = @workspace.pages.roots.include_tree
    end
  end
end
