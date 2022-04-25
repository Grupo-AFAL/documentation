module Documentation
  class Page < ApplicationRecord
    extend ActsAsTree::TreeWalker

    acts_as_tree

    has_many_attached :images do |attachable|
      attachable.variant :thumb, resize_to_fit: [240, 240]
      attachable.variant :small_thumb, resize_to_fit: [78, 78]
    end

    validates :title, presence: true

    def self.search(query)
      where('title ILIKE ?', "%#{query}%")
    end
  end
end
