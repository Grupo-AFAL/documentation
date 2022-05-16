# frozen_string_literal: true

class CreateDocumentationWorkspaces < ActiveRecord::Migration[7.0]
  def change
    create_table :documentation_workspaces do |t|
      t.string :name
      t.references :home_page

      t.timestamps
    end

    add_reference :documentation_pages, :documentation_workspace, foreign_key: true
  end
end
