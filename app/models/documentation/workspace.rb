module Documentation
  class Workspace < ApplicationRecord
    has_many :pages, class_name: 'Documentation::Page',
                     foreign_key: :documentation_workspace_id,
                     dependent: :destroy,
                     inverse_of: :workspace
    has_many :permissions, class_name: 'Documentation::Permission',
                           as: :object

    belongs_to :home_page, class_name: 'Documentation::Page', optional: true

    validates :name, presence: true

    after_create_commit :create_home_page

    def create_home_page
      update(home_page: pages.create(title: "#{name} Home page"))
    end
  end
end
