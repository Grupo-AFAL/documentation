# frozen_string_literal: true

require 'rails_helper'

describe Documentation::PagePolicy do
  fixtures :users, 'documentation/permissions', 'documentation/pages', 'documentation/workspaces'

  let(:super_admin) { users(:super_admin) }
  let(:read_user) { users(:read_user) }
  let(:write_user) { users(:write_user) }
  let(:full_user) { users(:full_user) }
  let(:non_member_user) { users(:non_member_user) }

  let(:page) { documentation_pages(:comedor_home_page) }

  describe '#show?' do
    it 'returns true' do
      expect(described_class.new(read_user, page).show?).to be_truthy
      expect(described_class.new(write_user, page).show?).to be_truthy
      expect(described_class.new(full_user, page).show?).to be_truthy
    end
  end

  describe '#create?' do
    it 'returns true for super admin access users' do
      expect(described_class.new(super_admin, page).create?).to be_truthy
    end

    it 'returns false for read, write or full access users' do
      expect(described_class.new(full_user, page).create?).to be_falsey
      expect(described_class.new(write_user, page).create?).to be_falsey
      expect(described_class.new(read_user, page).create?).to be_falsey
    end

    it 'returns false for non-members' do
      expect(described_class.new(non_member_user, page).create?).to be_falsey
    end
  end

  describe '#update?' do
    it 'returns true for write or full access users' do
      expect(described_class.new(full_user, page).update?).to be_truthy
      expect(described_class.new(write_user, page).update?).to be_truthy
    end

    it 'returns false for read, write or non-full access users' do
      expect(described_class.new(read_user, page).update?).to be_falsey
      expect(described_class.new(non_member_user, page).update?).to be_falsey
    end
  end

  describe '#destroy?' do
    it 'returns true for full access users' do
      expect(described_class.new(full_user, page).destroy?).to be_truthy
    end

    it 'returns false for read, write or non member access users' do
      expect(described_class.new(write_user, page).destroy?).to be_falsey
      expect(described_class.new(read_user, page).destroy?).to be_falsey
      expect(described_class.new(non_member_user, page).destroy?).to be_falsey
    end
  end

  describe '#can_destroy_documents?' do
    it 'returns true for write or full access users' do
      expect(described_class.new(full_user, page).can_destroy_documents?).to be_truthy
      expect(described_class.new(write_user, page).can_destroy_documents?).to be_truthy
    end

    it 'returns false for read or non member access users' do
      expect(described_class.new(read_user, page).can_destroy_documents?).to be_falsey
      expect(described_class.new(non_member_user, page).can_destroy_documents?).to be_falsey
    end
  end

  describe '#can_destroy_images?' do
    it 'returns true for write or full access users' do
      expect(described_class.new(full_user, page).can_destroy_images?).to be_truthy
      expect(described_class.new(write_user, page).can_destroy_images?).to be_truthy
    end

    it 'returns false for read or non member access users' do
      expect(described_class.new(read_user, page).can_destroy_images?).to be_falsey
      expect(described_class.new(non_member_user, page).can_destroy_images?).to be_falsey
    end
  end
end
