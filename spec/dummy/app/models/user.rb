# frozen_string_literal: true

class User < ApplicationRecord
  def self.super_admin
    find_by(super_admin: true)
  end
end
