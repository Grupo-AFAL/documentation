# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Documentation::Page, type: :model do
  fixtures 'documentation/workspaces', 'documentation/pages'

  let(:comedor) { documentation_workspaces(:comedor) }
  let(:comedor_home_page) { documentation_pages(:comedor_home_page) }
  let(:comedor_recipes) { documentation_pages(:comedor_recipes) }

  describe '#home_page?' do
    it 'returns true when its the homepage' do
      expect(comedor_home_page.home_page?).to be true
    end

    it 'returns false when its a regular page' do
      expect(comedor_recipes.home_page?).to be false
    end
  end
end
