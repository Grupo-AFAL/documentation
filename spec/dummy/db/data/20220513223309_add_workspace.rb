# frozen_string_literal: true

class AddWorkspace < ActiveRecord::Migration[7.0]
  def up
    workspace = Documentation::Workspace.find_or_create_by(name: 'DT')
    Documentation::Permission.create(subject: User.super_admin, object: workspace, action: :full)
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
