# frozen_string_literal: true

module ApiHelpers
  def json_body
    JSON.parse(response.body)
  end

  def json_headers
    { 'ACCEPT' => 'application/json' }
  end
end
