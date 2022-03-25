module Documentation
  class Engine < ::Rails::Engine
    isolate_namespace Documentation

    config.generators do |g|
      g.test_framework :rspec, fixture: true
      g.view_specs      false
      g.routing_specs   false
      g.helper          false
    end
  end
end
