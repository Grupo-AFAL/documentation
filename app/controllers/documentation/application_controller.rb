# frozen_string_literal: true

module Documentation
  class ApplicationController < ActionController::Base
    include Bali::LayoutConcern
    include Pundit::Authorization

    default_form_builder Bali::FormBuilder

    # after_action :verify_authorized
    rescue_from Pundit::NotAuthorizedError, with: :not_authorized

    def not_authorized(_exception)
      redirect_to root_path, alert: 'Not authorized'
    end
  end
end
