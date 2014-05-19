require 'spec_helper.rb'
 
feature 'has title' do
   
    scenario 'main page' do
        visit '/text'
        expect(page.title).shoud_not be ""
    end
   
    $name = a_string
    $corpus = a_string
   
    background do
        visit '/text'
        click_on '+'
        fill_in 'Titre', :with => $name
        fill_in 'corpus', :with => $corpus
        click_on 'Enregistrer les attributs'
        click_on 'Enregistrer'
    end
   
    scenario 'text title' do
        expect(page.title).to include $name
    end
end
