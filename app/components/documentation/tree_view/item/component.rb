# frozen_string_literal: true

module Documentation
  module TreeView
    module Item
      class Component < ApplicationViewComponent
        renders_many :items, 'Documentation::TreeView::Item::Component'

        def initialize(name:, path:, root: false, **options)
          @name = name
          @path = path
          @root = root
          @options = prepend_class_name(options, 'tree-view-item-component')
        end
      end
    end
  end
end
