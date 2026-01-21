Alors ("le bouton {string} est affiché") do |btn|
  expect(page).to have_content btn
end

Alors ("le titre {string} est affiché") do |title|
  expect(page).to have_content title
end


Alors("{string} est connecté") do |fullname|
  expect(page).to have_content fullname
  expect(page).to have_content "Se déconnecter"
end

Alors("l'analyste n'est pas connecté") do
  expect(page).to have_content "S'identifier"
end

Alors("le journal {string} est créé") do |diary_name|
  new_diary_name = "tentative réussie du "+ Date.today.strftime('%Y-%m-%d')
  visit "/memo/"
  click_on diary_name+Date.today.strftime('%Y-%m-%d')
  page.find("h1").click
  fill_in 'name', with: new_diary_name
  click_on "Enregistrer"
  visit "/memo/"
  expect(page).to have_content(new_diary_name)
end
