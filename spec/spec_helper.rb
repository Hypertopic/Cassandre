require 'capybara/rspec'
require 'capybara/webkit'

Capybara.run_server = false
Capybara.default_driver = :webkit
Capybara.app_host =
  'http://127.0.0.1:5984/cassandre/_design/cassandre/_rewrite'

RSpec.configure do |config|
  config.before(:each) do
    prefer_language 'fr'
  end
end

def a_string()
  s = ('a'..'z').to_a.shuffle[0,8].join
end

def prefer_language(language)
  page.driver.header 'Accept-Language', language
end

