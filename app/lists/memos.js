function(head, req) {
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js

  var emitted = [];
  var data = {
    logged: req.userCtx.name,
    diary: req.query.startkey[0],
    memos: [],
  };
  while (row = getRow()) {
    var preview = '';
    switch (row.key[3]) {
      case ('M'):
        var name = row.value.name.replace(/"/g, '\\"').replace(/\s/g, ' ');
        var date = row.value.date;
        var path = 'memo';
        switch (row.value.type) {
          case ('graph'):
          case ('table'):
          case ('diagram'):
            path = row.value.type;
          break;
        }
        if ([null, req.userCtx.name].indexOf(row.key[2]) > -1) {
          if (row.doc.body) preview = row.doc.body.replace(/\n\n/g, '\n \n');
          if (row.doc.speeches) {
            preview = row.doc.speeches.map(function(a) {
              var turn = a.text;
              if (a.actor) turn = '**'+a.actor.trim()+'** '+turn;
              return turn;
            });
            preview = preview.join('\n \n');
          }
          var sortkey = replaceDiacritics(name).toLowerCase().replace(/\//g, ' '); 
          switch(row.key[1]) {
            case'date':
              sortkey = date; 
            break;
            case'update':
              sortkey = row.value.update; 
            break;
            case'type':
              sortkey = row.key[4];
            break;
          }
          data.memos.push({
            preview: preview.substr(0,3000),
            diary: row.key[0],
            id: row.value.id,
            name: name,
            rev: row.value.rev,
            date: date,
            update: row.value.update,
            groundings: row.value.groundings,
            path: path,
            sortkey: sortkey,
            type: row.value.type
          });
        }
      break;
    }
  }
  send(toJSON(data.memos));
}
