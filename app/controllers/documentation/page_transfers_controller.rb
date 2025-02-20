# frozen_string_literal: true

module Documentation
  class PageTransfersController < ApplicationController
    def update
      @page = authorize Page.find(params[:id])

      if @page.update(page_params)
        redirect_to workspace_page_path(@page.workspace, @page),
                    notice: 'Page was successfully updated.', status: :see_other
      else
        redirect_to workspace_page_path(@page.workspace, @page),
                    alert: @page.errors.full_messages.join(', '), status: :see_other
      end
    end

    private

    def page_params
      params.expect(page: [:documentation_workspace_id])
    end
  end
end
