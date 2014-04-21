# You must gem install json and tamper before this can run

require 'json'
require 'tamper'

articlesJson = File.read('articles.json')
articles = JSON.parse(articlesJson)

# Kill invalid bylines.
articles.delete_if { |a| !a['byline'].is_a?(Hash) }

# Assign each a numeric ID.  If we were storing these in a database,
# we could assign an autoincrement id.  For this demo we'll assign a
# temporary id.
#
# A numeric id is required when generating a Tamper pack.
articles.each_with_index { |a, idx| a.merge!(id: idx)}

# Generate the distinct possibilities for each attributes.
# If we were storing these in a db, we could use a DISTINCT query.
possibilities = {
  section_name: articles.map { |a| a['section_name'] }.compact.uniq.sort,
  byline: articles.map { |a| a['byline']['original'] }.compact.uniq.sort
}

# Configure pack
pack = Tamper::PackSet.new

pack.add_attribute(
  attr_name: :byline,
  possibilities: possibilities[:byline],
  max_choices: 1
)

pack.add_attribute(
  attr_name: :section_name,
  possibilities: possibilities[:section_name],
  max_choices: 1
)

pack.build_pack(num_items: articles.length, max_guid: articles.last[:id]) do |pack|
  articles.each do |a|
    pack << {
      id: a[:id],
      section_name: a['section_name'],
      byline: a['byline']['original']
    }
  end
end

puts pack.to_json
