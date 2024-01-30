ActiveSupport.on_load :active_record do
  include Bali::Types
end
ActiveModel::Type.register(:date_range, Bali::Types::DateRangeValue)
