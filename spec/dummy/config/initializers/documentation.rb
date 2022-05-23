# frozen_string_literal: true

Documentation.config do |config|
  config.add_permission_subject('User',
                                is_member: ->(subject, user) { subject == user },
                                display_name: ->(subject) { subject.name },
                                collection: -> { User.all.map { |u| [u.name, u.id] } })
end
