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

  permissions :show? do
    it 'grants access to all users' do
      expect(described_class).to permit(read_user, write_user, full_user, non_member_user)
    end
  end

  permissions :create? do
    it 'grants access to super admins' do
      expect(described_class).to permit(super_admin, page)
    end

    it 'denies access to non-super admins' do
      expect(described_class).not_to permit(read_user, page)
      expect(described_class).not_to permit(write_user, page)
      expect(described_class).not_to permit(full_user, page)
      expect(described_class).not_to permit(non_member_user, page)
    end
  end

  permissions :update? do
    it 'grants access to super admins, write users and full permissions user' do
      expect(described_class).to permit(super_admin, page)
      expect(described_class).to permit(write_user, page)
      expect(described_class).to permit(full_user, page)
    end

    it 'denies access to non-super admins' do
      expect(described_class).not_to permit(read_user, page)
      expect(described_class).not_to permit(non_member_user, page)
    end
  end

  permissions :destroy? do
    it 'grants access to full permissions users' do
      expect(described_class).to permit(full_user, page)
    end

    it 'denies access to non-super admins' do
      expect(described_class).not_to permit(read_user, page)
      expect(described_class).not_to permit(write_user, page)
      expect(described_class).not_to permit(non_member_user, page)
    end
  end

  permissions :can_destroy_files? do
    it 'grants access to write or full permissions users' do
      expect(described_class).to permit(full_user, page)
      expect(described_class).to permit(write_user, page)
    end

    it 'denies access to non-super admins' do
      expect(described_class).not_to permit(read_user, page)
      expect(described_class).not_to permit(non_member_user, page)
    end
  end

  permissions :can_destroy_images? do
    it 'grants access to write or full permissions users' do
      expect(described_class).to permit(full_user, page)
      expect(described_class).to permit(write_user, page)
    end

    it 'denies access to non-super admins' do
      expect(described_class).not_to permit(read_user, page)
      expect(described_class).not_to permit(non_member_user, page)
    end
  end
end
