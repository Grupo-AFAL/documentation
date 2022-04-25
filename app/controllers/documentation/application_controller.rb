module Documentation
  class ApplicationController < ActionController::Base
    include FrontendHelpers::LayoutConcern

    default_form_builder FrontendHelpers::FormBuilder
  end
end
