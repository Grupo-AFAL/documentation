# frozen_string_literal: true

class AddDefaultUsers < ActiveRecord::Migration[7.0]
  def up
    User.create(name: 'Regular User', super_admin: false)
    User.create(name: 'Super User', super_admin: true)
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
