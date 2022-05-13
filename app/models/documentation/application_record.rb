module Documentation
  class ApplicationRecord < ActiveRecord::Base
    include Pundit::Authorization

    self.abstract_class = true

    private

    # Add an error and stop record processing.
    # Used to prevent a record from being destroyed and showing an error
    def halt(attr: :base, msg: nil)
      errors.add(attr, msg) if msg
      throw(:abort)
    end
  end
end
