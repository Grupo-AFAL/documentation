# frozen_string_literal: true

module Documentation
  class ApplicationViewComponent < ViewComponentContrib::Base
    include Bali::HtmlElementHelper

    private

    def identifier
      @identifier ||= self.class.name.sub('::Component', '').underscore.split('/').join('--')
    end
  end
end
