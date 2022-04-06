json.array! @pages do |page|
  json.id page.id
  json.title page.title
  json.url page_url(page)
end
