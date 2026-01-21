#language : fr

Fonctionnalité: Créer un compte

Scénario: se rendre au bon endroit

  Soit la page des journaux de bord
  Quand l'analyste clique sur "Créer un compte"
  Alors le titre "Créer un compte" est affiché
  Et le bouton "Je fais partie de l'université de Liège" est affiché
  Et le bouton "Je ne fais pas partie de l'université de Liège" est affiché
  
Scénario: créer un compte

  Soit la page des journaux de bord
  Quand "Robert Testeur" souhaite créer un compte en tant que "bob" avec le mot de passe "bricoleur"
  Alors "Robert Testeur" est connecté

