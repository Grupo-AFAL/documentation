require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)
require 'documentation'

module Dummy
  class Application < Rails::Application
    config.load_defaults Rails::VERSION::STRING.to_f

    # For compatibility with applications that use this config
    config.action_controller.include_all_helpers = false

    extra_tags = %w[u table tr td th colgroup col]
    all_tags = Rails::Html::Sanitizer.safe_list_sanitizer.allowed_tags + extra_tags
    config.action_view.sanitized_allowed_tags = all_tags

    extra_attributes = %w[colspan rowspan colwidth style]
    all_attributes = Rails::Html::Sanitizer.safe_list_sanitizer.allowed_attributes + extra_attributes
    config.action_view.sanitized_allowed_attributes = all_attributes

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end
