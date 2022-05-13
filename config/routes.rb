Documentation::Engine.routes.draw do
  root to: 'workspaces#index'

  resources :workspaces do
    resources :pages
    resources :permissions
  end

  resources :pages, only: %i[] do
    resources :images
  end
end
