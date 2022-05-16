# frozen_string_literal: true

json.array! @pages do |page|
  json.id page.id
  json.title page.title
  json.url workspace_page_path(@workspace, page)
end
