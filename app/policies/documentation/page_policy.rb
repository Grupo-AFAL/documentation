# frozen_string_literal: true

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
      permission?(:can_edit?)
    end

    def destroy?
      permission?(:can_destroy?)
    end

    def can_destroy_files?
      permission?(:can_edit?)
    end

    def can_destroy_images?
      permission?(:can_edit?)
    end

    private

    def permission?(action)
      workspace_permissions.any? do |permission|
        permission.member?(user) && permission.send(action)
      end
    end

    def workspace_permissions
      @workspace_permissions ||= workspace.permissions.includes(:subject)
    end
  end
end
