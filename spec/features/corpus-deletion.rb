require 'spec_helper'

feature 'Delete a corpus' do

  $a_title = a_string()
  $a_corpus = a_string()

  background do
    visit '/'
    click_on 'Analyse qualitative de textes'
    click_on 'Créer...'
    fill_in 'name', :with => $a_title
    fill_in 'corpus', :with => $a_corpus
    click_on 'Enregistrer les attributs'
    click_on 'Enregistrer'
  end
  
  scenario 'checking if corpus exists' do
    click_on $a_corpus
    click_on 'Supprimer...'
    check 'toggle'
    click_on 'Supprimer'
    click_on 'Corpus'
    page.should_not have_content $a_corpus
  end
end
