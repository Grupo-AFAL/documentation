# frozen_string_literal: true

module Documentation
  class Page < ApplicationRecord
    extend ActsAsTree::TreeWalker

    acts_as_tree

    belongs_to :workspace, class_name: 'Documentation::Workspace',
                           foreign_key: :documentation_workspace_id,
                           inverse_of: :pages

    has_many_attached :images do |attachable|
      attachable.variant :thumb, resize_to_fill: [252, 168]
      attachable.variant :small_thumb, resize_to_fill: [84, 56]
    end

    has_many_attached :documents

    before_update -> { halt(msg: "Workspace home page can't be transfered") }, if: :was_home_page?
    before_update -> { self.parent_id = nil }, if: :documentation_workspace_id_changed?
    before_destroy -> { halt(msg: "Workspace home page can't be deleted") }, if: :home_page?

    validates :title, presence: true

    scope :include_tree, -> { includes(children: { children: [:children] }) }

    def self.search(query)
      where('title ILIKE ?', "%#{query}%")
    end

    def home_page?
      id == workspace.home_page_id
    end

    def was_home_page?
      documentation_workspace_id_changed? && id == previous_workspace.home_page_id
    end

    def previous_workspace
      Workspace.find(documentation_workspace_id_was)
    end

    def title_with_ancestors
      return title if parent.blank?

      parents = ancestors.reverse.map(&:title).join(' > ')
      "#{parents} > #{title}"
    end
  end
end
