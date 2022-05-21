# frozen_string_literal: true

# dependencies
require 'acts_as_tree'
require 'pundit'

require 'documentation/version'
require 'documentation/engine'

module Documentation
  mattr_accessor :subject_config, default: {}

  def self.add_permission_subject(class_name, is_member:, display_name:, collection: [])
    subject_config[class_name] = {
      is_member:,
      display_name:,
      collection:
    }
  end

  def self.permission_subjects
    subject_config.keys
  end

  def self.display_name(subject)
    subject_options = subject_config[subject.class.name]
    subject_options[:display_name].call(subject)
  end

  def self.member?(subject, user)
    subject_options = subject_config[subject.class.name]
    subject_options[:is_member].call(subject, user)
  end

  def self.collection(subject_class_name)
    subject_options = subject_config[subject_class_name]
    subject_options[:collection].call
  end

  # provide hook to configure attributes
  def self.config
    yield(self)
  end
end
