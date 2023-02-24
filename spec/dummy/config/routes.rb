# frozen_string_literal: true

Rails.application.routes.draw do
  root to: redirect('/documentation')

  mount Documentation::Engine => '/documentation'
end
