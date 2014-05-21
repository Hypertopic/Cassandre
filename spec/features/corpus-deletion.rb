require 'spec_helper'

feature 'Delete a corpus' do

  $a_title = a_string()
  $a_corpus = a_string()

  background do
    visit '/'
    click_on 'Analyse qualitative de textes'
    click_on '+'
    fill_in 'name', :with => $a_title
    fill_in 'corpus', :with => $a_corpus
    click_on 'Enregistrer les attributs'
  end
  
  scenario 'checking if corpus exists' do
    visit '/text/' + $a_corpus + '/?by=name'
    click_on 'Supprimer...'
    check 'toggle'
    click_on 'Supprimer'
    click_on 'Corpora'
    page.should_not have_content $a_corpus
  end
end
