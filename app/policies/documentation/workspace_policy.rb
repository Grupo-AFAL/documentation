# frozen_string_literal: true

module Documentation
  class WorkspacePolicy < ApplicationPolicy
    def create?
      user.super_admin?
    end

    def update?
      user.super_admin?
    end

    def destroy?
      user.super_admin?
    end

    def show?
      true
    end
  end
end
