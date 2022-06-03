# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Documentation::Page, type: :model do
  fixtures 'documentation/workspaces', 'documentation/pages'

  let(:guarderia) { documentation_workspaces(:guarderia) }
  let(:comedor) { documentation_workspaces(:comedor) }
  let(:comedor_home_page) { documentation_pages(:comedor_home_page) }
  let(:comedor_recipes) { documentation_pages(:comedor_recipes) }
  let(:comedor_recipes_details) { documentation_pages(:comedor_recipes_details) }

  describe '#home_page?' do
    it 'returns true when its the homepage' do
      expect(comedor_home_page.home_page?).to be true
    end

    it 'returns false when its a regular page' do
      expect(comedor_recipes.home_page?).to be false
    end
  end

  describe '#was_home_page?' do
    context 'with home page' do
      it 'returns true when workspace changed' do
        comedor_home_page.workspace = guarderia
        expect(comedor_home_page.was_home_page?).to be true
      end

      it 'returns false when it did not change' do
        expect(comedor_home_page.was_home_page?).to be false
      end
    end

    context 'with regular page' do
      it 'returns false when workspace changed' do
        comedor_recipes.workspace = guarderia
        expect(comedor_recipes.was_home_page?).to be false
      end
    end
  end

  describe '#update' do
    context 'when changing workspace for the home page' do
      it 'raises an error' do
        expect do
          comedor_home_page.update!(documentation_workspace_id: guarderia.id)
        end.to raise_error(ActiveRecord::RecordNotSaved)

        comedor_home_page.reload
        expect(comedor_home_page.workspace).to eql(comedor)
      end
    end

    context 'when changing workspace for a regular page' do
      it 'removes the parent_id' do
        expect(comedor_recipes_details.parent_id).not_to be nil
        comedor_recipes_details.update!(documentation_workspace_id: guarderia.id)

        comedor_recipes_details.reload
        expect(comedor_recipes_details.workspace).to eql(guarderia)
        expect(comedor_recipes_details.parent_id).to be nil
      end
    end
  end

  describe '#destroy' do
    context 'when deleting workspace home page' do
      it 'raises an error' do
        expect do
          comedor_home_page.destroy!
        end.to raise_error(ActiveRecord::RecordNotDestroyed)
      end
    end
  end

  describe '#latest_update_date' do
    let(:date_time) { Time.zone.now }
    let(:formatted_date_time) { date_time.strftime('%Y-%m-%d %I:%M%p') }

    it 'returns the latest updated date' do
      comedor_home_page.update!(updated_at: date_time)

      expect(comedor_home_page.latest_update_date).to eql(formatted_date_time)
    end
  end

  describe '#title_with_ancestors' do
    it 'returns the title with ancestors' do
      expect(comedor_recipes_details.title_with_ancestors).to eql('My Recipes > My Recipes details')
    end
  end
end
