Rails.application.routes.draw do
  mount Documentation::Engine => "/documentation"
end
