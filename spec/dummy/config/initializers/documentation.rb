# frozen_string_literal: true

Documentation.config do |config|
  config.add_permission_subject('User',
                                member: ->(subject, user) { subject == user },
                                display_name: ->(subject) { subject.name })
end
