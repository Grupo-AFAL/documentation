# frozen_string_literal: true

class CreateDocumentationPages < ActiveRecord::Migration[7.0]
  def change
    create_table :documentation_pages do |t|
      t.string :title
      t.string :description
      t.text :content

      t.timestamps
    end
  end
end
