Documentation::Engine.routes.draw do
  root to: 'pages#index'

  resources :pages do
    resources :images
  end
end
