# frozen_string_literal: true

class AddParentIdToDocumentationPages < ActiveRecord::Migration[7.0]
  def change
    add_reference :documentation_pages, :parent, null: true, foreign_key: false
  end
end
