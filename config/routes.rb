Documentation::Engine.routes.draw do
  root to: 'workspaces#index'

  resources :workspaces do
    resources :pages
    resources :permissions, only: %i[index]
    resources :page_transfers, only: %i[update]
  end

  resources :pages, only: %i[] do
    resources :images, only: %i[index create destroy]
    resources :image_thumbnails, only: %i[index]
  end
end
