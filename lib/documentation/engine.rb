# frozen_string_literal: true

module Documentation
  class Engine < ::Rails::Engine
    isolate_namespace Documentation

    config.generators do |g|
      g.test_framework :rspec, fixture: true
      g.view_specs      false
      g.routing_specs   false
      g.helper          false
    end

    initializer 'Documentation precompile hook' do |app|
      if defined?(Sprockets)
        app.config.assets.precompile += %w[
          documentation/application.js
          documentation/application.css
        ]

        app.config.assets.paths << Rails.root.join('app/components')
      end

      extra_tags = %w[u table tr td th colgroup col]
      all_tags = Rails::Html::Sanitizer.safe_list_sanitizer.allowed_tags + extra_tags
      app.config.action_view.sanitized_allowed_tags = all_tags

      extra_attributes = %w[colspan rowspan colwidth style]
      all_attributes = Rails::Html::Sanitizer.safe_list_sanitizer
                                             .allowed_attributes + extra_attributes
      app.config.action_view.sanitized_allowed_attributes = all_attributes
    end
  end
end
