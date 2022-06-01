# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# Specify your gem's dependencies in documentation.gemspec.
gemspec

gem 'pg'

gem 'bulma-rails', '~> 0.9.3'
gem 'image_processing', '>= 1.2'
gem 'jbuilder'
gem 'jsbundling-rails'
gem 'sassc-rails'
gem 'sprockets-rails'
gem 'turbo-rails', '~> 1.0'

gem 'frontend_helpers', github: 'Grupo-AFAL/frontend-helpers', branch: 'main'
# gem 'frontend_helpers', path: ENV['RUBY_FRONTEND_HELPERS_PATH']
gem 'bali_view_components', github: 'Grupo-AFAL/bali-view-components', branch: 'migrate-to-lookbook'
# gem 'bali_view_components', path: ENV['BALI_VIEW_COMPONENTS_PATH']

gem 'acts_as_tree'

# Start debugger with binding.b [https://github.com/ruby/debug]
gem 'debug', '>= 1.0.0'

group :development, :test do
  gem 'data_migrate'
  gem 'rspec-rails', '~> 5'
end

group :development do
  gem 'rubocop', '~> 1', require: false
  gem 'rubocop-rails', '~> 2'
end

group :test do
  gem 'simplecov', require: false
end
