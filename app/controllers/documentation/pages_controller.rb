module Documentation
  class PagesController < ApplicationController
    before_action :set_page, only: %i[show edit update destroy]
    before_action :set_root_pages, only: %i[new edit create update]

    def index
      @pages = Page.unscoped
    end

    def show; end

    def new
      @parent = Page.find(params[:parent_id]) if params[:parent_id]
      @page = Page.new(parent_id: @parent&.id)
    end

    def edit
    end

    def create
      @page = Page.new(page_params)

      if @page.save
        redirect_to @page, notice: 'Page was successfully created.'
      else
        render :new, status: :unprocessable_entity
      end
    end

    def update
      if @page.update(page_params)
        redirect_to @page, notice: 'Page was successfully updated.'
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def destroy
      @page.destroy
      redirect_to pages_url, notice: 'Page was successfully destroyed.'
    end

    private

    def set_page
      @page = Page.find(params[:id])
    end

    def set_root_pages
      @pages = Page.roots.excluding(@page)
    end

    def page_params
      params.require(:page).permit(:title, :description, :content, :parent_id)
    end
  end
end
