require 'spec_helper'

feature 'Internationalization' do

scenario 'french' do
  prefer_language('es;q=1.0,fr-FR;q=0.9,fr;q=0.8,en;q=0.7')
  visit '/'
  page.should have_content 'Analyse qualitative de textes'
end

scenario 'english' do
  prefer_language('en')
  visit '/'
  page.should have_content 'Texts Qualitative Analysis'
end

scenario 'other' do
  prefer_language('es')
  visit '/'
  page.should have_content 'Texts Qualitative Analysis'
end

scenario 'priorities' do
prefer_language('en;q=1.0,fr-FR;q=0.3,fr;q=0.2')
  visit '/'
  page.should have_content 'Texts Qualitative Analysis'
end

end
