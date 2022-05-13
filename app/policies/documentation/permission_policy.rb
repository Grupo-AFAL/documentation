module Documentation
  class PermissionPolicy < ApplicationPolicy
    def index?
      user.super_admin?
    end
  end
end
