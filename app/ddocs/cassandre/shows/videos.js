function(o, req) {
  // !json templates.videos
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  var data = {
    i18n: localized(),
    locale: req.headers["Accept-Language"].split(',')[0].substring(0,2),
    logged: req.userCtx.name,
    diary_operations: [
      {
        name: "Créer un compte (lorsqu'on est membre de l'ULiège)",
        url: 'https://dox.uliege.be/index.php/s/1p7J2GedZiuN4kI',
        date: '2026-01-29',
        author: 'Léa Brichard'
      },
      {
        name: "Créer un compte (lorsqu'on n'est pas membre de l'ULiège)",
        url: 'https://dox.uliege.be/index.php/s/qGvF7qh8oP1K9tc',
        date: '2024-12-16',
        author: 'Lola Dente'
      },
      {
        name: "Créer son journal de bord",
        url: 'https://dox.uliege.be/index.php/s/QHhECLDi3rgZWSs',
        date: '2022-10-27',
        author: 'Zéliha Nallar'
      },
      {
        name: "Trier les comptes-rendus d'un journal",
        url: 'https://dox.uliege.be/index.php/s/agZEfjpKcIXGBGB',
        date: '2023-01-11',
        author: 'Zéliha Nallar'
      },
      {
        name: "Se répartir les tâches",
        url: 'https://dox.uliege.be/index.php/s/3ybJ5AWCUVBQ3HQ',
        date: '2026-01-29',
        author: 'Léa Brichard'
      },
      {
        name: "Exporter (ou sauvergarder) un journal de bord",
        url: 'https://dox.uliege.be/index.php/s/hcEQ1DzNBAeBtsn',
        date: '2024-06-06',
        author: 'Lyse Gathoye'
      },
      {
        name: "Se déconnecter",
        url: 'https://dox.uliege.be/index.php/s/UZnZUPAKGOvTJ1x',
        date: '2023-01-11',
        author: 'Zéliha Nallar'
      }
    ],
    memo_operations: [
      {
        name: "Créer un compte-rendu (différents types)",
        url: 'https://dox.uliege.be/index.php/s/2AmZXcPA3zGQd7S',
        date: '2022-11-03',
        author: 'Zéliha Nallar'
      },
      {
        name: "Mettre en forme un compte-rendu",
        url: 'https://dox.uliege.be/index.php/s/44GADieGxGptUri',
        date: '2022-11-03',
        author: 'Zéliha Nallar'
      },
      {
        name: "Insérer une image ou un lien dans un compte-rendu",
        url: 'https://dox.uliege.be/index.php/s/zwPQ3ShK7WKJCju',
        date: '2022-11-03',
        author: 'Zéliha Nallar'
      },
      {
        name: "Partager un compte-rendu",
        url: 'https://dox.uliege.be/index.php/s/68SVsplEmkwRoxt',
        date: '2022-11-03',
        author: 'Zéliha Nallar'
      },
      {
        name: "Modifier le titre d'un compte-rendu",
        url: 'https://dox.uliege.be/index.php/s/LnyVmQLAoS4zkQG',
        date: '2022-11-03',
        author: 'Zéliha Nallar'
      },
      {
        name: "Modifier les ancrages d'un compte-rendu",
        url: 'https://dox.uliege.be/index.php/s/geM6Kx2BtMlea9o',
        date: '2022-11-03',
        author: 'Zéliha Nallar'
      },
      {
        name: "Revenir à une version antérieure d'un compte-rendu",
        url: 'https://dox.uliege.be/index.php/s/VROwKnmer4ZMojm',
        date: '2026-01-29',
        author: 'Léa Brichard'
      },
      {
        name: "Reprendre un compte-rendu, et récupérer un travail non enregistré",
        url: 'https://dox.uliege.be/index.php/s/lJlysN5F1zfiOYh',
        date: '2026-02-18',
        author: 'Léa Brichard'
      },
      {
        name: "Commenter un compte-rendu &amp; cocher un commentaire",
        url: 'https://dox.uliege.be/index.php/s/OgliTZd2WS2G6KF',
        date: '2022-11-03',
        author: 'Zéliha Nallar'
      },
      {
        name: "Rédiger un commentaire et le mettre en forme",
        url: 'https://dox.uliege.be/index.php/s/EviAUPMvFqs2G7R',
        date: '2023-11-17',
        author: 'Lyse Gathoye'
      },
      {
        name: "Restaurer les sauts de paragraphes",
        url: 'https://dox.uliege.be/index.php/s/8ZGAhIBw0bMDYKa',
        date: '2024-12-16',
        author: 'Lola Dente'
      },
      {
        name: "Supprimer un compte-rendu",
        url: 'https://dox.uliege.be/index.php/s/diZrmV9oj7sCGNO',
        date: '2023-01-11',
        author: 'Zéliha Nallar'
      }
    ],
    analytic_operations: [
      {
        name: "Étiqueter la transcription d'une entrevue",
        url: 'https://dox.uliege.be/index.php/s/Kd76XQzDARRbkP1',
        date: '2022-11-03',
        author: 'Zéliha Nallar'
      },
      {
        name: "Articuler deux dimensions",
        url: 'https://dox.uliege.be/index.php/s/88GTpboWtwQM9KI',
        date: '2024-12-16',
        author: 'Lola Dente'
      },
      {
        name: "Tracer une schématisation",
        url: 'https://dox.uliege.be/index.php/s/ZsmzJDGsyf0a25Z',
        date: '2023-11-30',
        author: 'Lyse Gathoye'
      }
    ],
    handbook: [
      {
        url: 'http://www.lienmini.fr/66992-vid1',
        name: "Les différentes méthodes d'analyse de matériaux qualitatifs",
        date: '2026-01-30',
        author: 'Christophe Lejeune'
      },
      {
        url: 'http://www.lienmini.fr/66992-vid2',
        name: "L'analyse par théorisation ancrée et ses variantes",
        date: '2026-01-30',
        author: 'Christophe Lejeune'
      },
      {
        url: 'http://www.lienmini.fr/66992-vid3',
        name: 'La saturation théorique',
        date: '2026-01-30',
        author: 'Christophe Lejeune'
      }
    ]
  }
  provides('html', function() {
    return {
      body: Mustache.to_html(templates.videos, data, shared)
    }
  })
}
