require 'spec_helper.rb'
 
feature 'Nouveau texte dans un nouveau corpus' do
   
    scenario 'visit new corpus' do
        visit '/text'
        click_on '+'
        page.should have_content "Nouveau texte dans un nouveau corpus"
    end
 
  scenario 'for new corpus' do
    visit '/text'
    click_on '+'
    name = a_string
    corpus = a_string
    fill_in 'Titre', :with => name
    fill_in 'corpus', :with => corpus
    click_on 'Enregistrer les attributs'
    click_on 'Corpus'
    page.should have_content corpus
  end
 
end
