module Documentation
  class PagePolicy < ApplicationPolicy
    delegate :workspace, to: :record

    def show?
      true
    end

    def create?
      user.super_admin?
    end

    def update?
      workspace_permissions.any? do |permission|
        permission.member?(user) && permission.can_edit?
      end
    end

    def destroy?
      workspace_permissions.any? do |permission|
        permission.member?(user) && permission.can_destroy?
      end
    end

    private

    def workspace_permissions
      @workspace_permissions ||= workspace.permissions.includes(:subject)
    end
  end
end
