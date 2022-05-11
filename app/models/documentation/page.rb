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

    before_destroy -> { halt(msg: "Workspace home page can't be deleted") if workspace_home_page? }

    validates :title, presence: true

    def self.search(query)
      where('title ILIKE ?', "%#{query}%")
    end

    def workspace_home_page?
      id == workspace.home_page_id
    end
  end
end
