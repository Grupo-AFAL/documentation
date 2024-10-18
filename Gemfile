# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# Specify your gem's dependencies in documentation.gemspec.
gemspec

gem 'pg'

gem 'bulma-rails', '~> 0.9.3'
gem 'dartsass-rails'
gem 'image_processing', '>= 1.2'
gem 'jbuilder'
gem 'simple_command'
gem 'sprockets-rails'
gem 'turbo-rails', '~> 2.0'

gem 'bali_view_components', github: 'Grupo-AFAL/bali-view-components', branch: 'update-rails-to-7.2'
# gem 'bali_view_components', path: ENV['BALI_VIEW_COMPONENTS_PATH']

gem 'acts_as_tree'

# Start debugger with binding.b [https://github.com/ruby/debug]
gem 'debug', '>= 1.0.0'

group :development, :test do
  gem 'data_migrate'
  gem 'importmap-rails', '~> 2.0'
  gem 'rspec-rails', '~> 7'
  gem 'stimulus-rails', '~> 1.3'
end

group :development do
  gem 'rubocop', require: false
  gem 'rubocop-rails'
end

group :test do
  gem 'simplecov', require: false
end
