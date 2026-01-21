Quand("l'analyste entre") do 
  visit "/memo/"
end

Quand("l'analyste clique sur {string}") do |lien|
  click_on lien
end

Quand("l'analyste souhaite s'identifier en tant que {string} avec le mot de passe {string}") do |login, password|
  click_on "S'identifier"
  expect(page).to have_content("S'identifier")
  fill_in placeholder: 'Identifiant', with: login
  fill_in placeholder: 'Mot de passe', with: password
  click_on "S'identifier"
end

Quand("{string} souhaite créer un compte en tant que {string} avec le mot de passe {string}") do |fullname, login, password|
  click_on "Créer un compte"
  expect(page).to have_content("Je ne fais pas partie de l'université de Liège")
  find("#newaccount").click
  expect(page).to have_content("Nom complet (prénom et nom de famille)")
  range = [*'0'..'9',*'A'..'F']
  hash = Array.new(36){ range.sample }.join
  fill_in placeholder: 'Jack London', with: 'test'+ hash + fullname 
  fill_in placeholder: 'user@example.net', with: login + hash
  fill_in "password", with: password
  fill_in "confirm", with: password
  click_on "Créer un compte"
  click_on "Journaux de bord"
end


Quand("l'analyste crée un journal") do
  visit "/memo/"
  numbers = [*'0'..'9']
  cardinal = Array.new(3){ numbers.sample }.join
  today_date = Date.today.strftime('%Y-%m-%d')
  diary_name = 'essai ' + today_date + cardinal
  fill_in placeholder: 'Mon journal de bord', with: diary_name
  click_on "Créer..."
  click_on "Enregistrer"
  expect(page).to have_content("Ajouter un ancrage")
  visit "/memo/"
  expect(page).to have_content(diary_name)
end

