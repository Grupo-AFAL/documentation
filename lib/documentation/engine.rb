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
      end
    end
  end
end
