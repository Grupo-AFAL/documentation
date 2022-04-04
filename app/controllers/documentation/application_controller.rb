module Documentation
  class ApplicationController < ActionController::Base
    default_form_builder FrontendHelpers::FormBuilder
  end
end
