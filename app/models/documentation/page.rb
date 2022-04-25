module Documentation
  class Page < ApplicationRecord
    extend ActsAsTree::TreeWalker

    acts_as_tree

    has_many_attached :images do |attachable|
      attachable.variant :thumb, resize_to_fill: [252, 168]
      attachable.variant :small_thumb, resize_to_fill: [84, 56]
    end

    validates :title, presence: true

    def self.search(query)
      where('title ILIKE ?', "%#{query}%")
    end
  end
end
