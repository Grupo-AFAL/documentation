# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Documentation::Permission, type: :model do
  let(:permission) {}

  describe 'can_edit?' do
    it 'returns true with write action' do
      permission = Documentation::Permission.new(action: :write)
      expect(permission.can_edit?).to be true
    end

    it 'returns true with full action' do
      permission = Documentation::Permission.new(action: :full)
      expect(permission.can_edit?).to be true
    end

    it 'returns false with read action' do
      permission = Documentation::Permission.new(action: :read)
      expect(permission.can_edit?).to be false
    end

    it 'returns false with comment action' do
      permission = Documentation::Permission.new(action: :comment)
      expect(permission.can_edit?).to be false
    end
  end

  describe 'can_destroy?' do
    it 'returns true with full action' do
      permission = Documentation::Permission.new(action: :full)
      expect(permission.can_destroy?).to be true
    end

    it 'returns false with read action' do
      permission = Documentation::Permission.new(action: :read)
      expect(permission.can_destroy?).to be false
    end

    it 'returns false with write action' do
      permission = Documentation::Permission.new(action: :write)
      expect(permission.can_destroy?).to be false
    end
  end
end
