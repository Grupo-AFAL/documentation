# dependencies
require 'acts_as_tree'

require 'documentation/version'
require 'documentation/engine'

module Documentation
  mattr_accessor :subject_config, default: {}

  def self.add_permission_subject(class_name, member:, display_name:)
    subject_config[class_name] = {
      member: member,
      display_name: display_name
    }
  end

  def self.display_name(subject)
    subject_options = subject_config[subject.class.name]
    subject_options[:display_name].call(subject)
  end

  def self.member?(subject, user)
    subject_options = subject_config[subject.class.name]
    subject_options[:member].call(subject, user)
  end

  # provide hook to configure attributes
  def self.config
    yield(self)
  end
end
