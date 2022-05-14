ActiveSupport.on_load(:action_controller) do
  def current_user
    @current_user ||= User.last
  end
end
