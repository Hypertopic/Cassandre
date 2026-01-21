
Soit("un navigateur sur la page d'accueil") do
  visit "/"
end

Soit("la page des journaux de bord") do
  visit "/memo/"
end

Soit("l'analyste est identifié") do
  visit "/memo/"
  click_on "S'identifier"
  expect(page).to have_content("S'identifier")
  fill_in placeholder: 'Identifiant', with: "bob@acme.org"
  fill_in placeholder: 'Mot de passe', with: "Ep0nge"
  click_on "S'identifier"
  expect(page).to have_content "Se déconnecter"
end

Soit("une page comportant le bouton {string}") do |btn|
  expect(page).to have_content btn
end

