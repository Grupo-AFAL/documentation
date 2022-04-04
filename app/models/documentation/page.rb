module Documentation
  class Page < ApplicationRecord
    extend ActsAsTree::TreeWalker

    acts_as_tree

    validates :title, presence: true
  end
end
