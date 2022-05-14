Rails.application.routes.draw do
  root to: 'home#index'

  mount Documentation::Engine => "/documentation"
end
