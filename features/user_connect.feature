#language : fr

Fonctionnalité: S'identifier

Scénario: avec un mot de passe correct

  Soit la page des journaux de bord
  Quand l'analyste souhaite s'identifier en tant que "bob@acme.org" avec le mot de passe "Ep0nge"
  Alors "Robert Testeur" est connecté
  Et le bouton "Créer..." est affiché

Scénario: avec un mot de passe erroné

  Soit la page des journaux de bord
  Quand l'analyste souhaite s'identifier en tant que "bob@acme.org" avec le mot de passe "Eponge"
  Alors l'analyste n'est pas connecté
