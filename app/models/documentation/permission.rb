# frozen_string_literal: true

module Documentation
  class Permission < ApplicationRecord
    belongs_to :subject, polymorphic: true
    belongs_to :object, polymorphic: true

    enum :action, read: 0, comment: 1, write: 2, full: 3

    validates :subject_id, presence: true

    def can_edit?
      write? || full?
    end

    def can_destroy?
      full?
    end

    def member?(user)
      Documentation.member?(subject, user)
    end

    def display_name
      Documentation.display_name(subject)
    end
  end
end
