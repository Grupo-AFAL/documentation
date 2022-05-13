class CreateDocumentationPermissions < ActiveRecord::Migration[7.0]
  def change
    create_table :documentation_permissions do |t|
      t.references :subject, polymorphic: true, null: false
      t.references :object, polymorphic: true, null: false
      t.integer :action, default: 0

      t.timestamps
    end
  end
end
