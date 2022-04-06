module Documentation
  class Page < ApplicationRecord
    extend ActsAsTree::TreeWalker

    acts_as_tree

    validates :title, presence: true

    def self.search(query)
      where('title ILIKE ?', "%#{query}%")
    end
  end
end
