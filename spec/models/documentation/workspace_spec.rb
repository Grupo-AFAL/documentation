# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Documentation::Workspace, type: :model do
  context 'Creating workspace' do
    it 'creates and links a home page' do
      workspace = Documentation::Workspace.create(name: 'Prueba')

      expect(workspace.home_page.title).to eql('Prueba Home page')
      expect(workspace.home_page.workspace).to eql(workspace)
    end
  end
end
