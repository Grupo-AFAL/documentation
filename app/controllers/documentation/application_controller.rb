module Documentation
  class ApplicationController < ActionController::Base
    include FrontendHelpers::LayoutConcern
    include Pundit::Authorization

    default_form_builder FrontendHelpers::FormBuilder

    # after_action :verify_authorized
    rescue_from Pundit::NotAuthorizedError, with: :not_authorized

    def not_authorized(_exception)
      redirect_to root_path, alert: 'Not authorized'
    end
  end
end
