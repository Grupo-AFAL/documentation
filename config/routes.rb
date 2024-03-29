Documentation::Engine.routes.draw do
  root to: 'workspaces#index'

  resources :workspaces do
    resources :pages
    resources :permissions, only: %i[index create update destroy]
    resources :page_transfers, only: %i[update]
  end

  resources :pages, only: %i[] do
    resources :files, only: %i[index create destroy]
    resources :images, only: %i[index create destroy]
    resources :image_thumbnails, only: %i[index]
    resources :attachments, only: %i[index]
  end
end
