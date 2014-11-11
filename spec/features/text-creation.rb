require 'spec_helper'

feature 'Create a text' do

  $a_title = a_string()
  $a_corpus = a_string()

  background do
    visit '/'
    click_on 'Analyse qualitative de textes'
    click_on 'Créer...'
  end
  
  scenario 'filling (title and corpus) fields' do
    fill_in 'name', :with => $a_title
    fill_in 'corpus', :with => $a_corpus
    click_on 'Enregistrer les attributs'
    page.should have_content 'Terminé'
  end

end
