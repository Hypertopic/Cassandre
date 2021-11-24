function(head, req) {
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js

  var i18n = localized(),
      data = {
    logged: req.userCtx.name,
    diary: req.query.startkey[0],
    memos: [],
  };
  while (row = getRow()) {
    var preview = '',
        id = row.value.id,
        diary = row.key[0],
        type = row.value.type,
        rev = row.value.rev;
    switch (row.key[3]) {
      case ('M'):
        var name = row.value.name.replace(/"/g, '&#34;').replace(/\s/g, ' '),
            date = row.value.date,
            path = 'memo';
        switch (row.value.type) {
          case ('graph'):
          case ('table'):
          case ('diagram'):
            path = row.value.type;
          break;
        }
        if ([null, req.userCtx.name].indexOf(row.key[2]) > -1) {
          if (row.value.preview) preview = row.value.preview.replace(/\n\n/g, '\n \n');
          if (row.value.type == 'statement') {
            type = 'storyline';
            path = 'statements';
            name = i18n["i_name"]["statement"]+'s';
            diary = '.';
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
            preview: preview,
            diary: diary,
            id: id,
            name: name,
            rev: rev,
            date: date,
            update: row.value.update,
            groundings: row.value.groundings,
            path: path,
            sortkey: sortkey,
            type: type
          });
        }
      break;
    }
  }
  send(toJSON(data.memos));
}
