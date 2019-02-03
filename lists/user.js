function(head, req) {
  // !json templates.user
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var data = {
    activity: [],
    authorized: req.userCtx.name==req.query.startkey[0] || (row && row.doc && row.doc.readers.indexOf(req.userCtx.name)) || req.userCtx.roles.indexOf("_admin")>-1,
    flat: true,
    i18n: localized(),
    locale: req.headers["Accept-Language"],
    logged: req.userCtx.name,
    readers: [],
    readers_fullnames: []
  };
  while (row = getRow()) {
    var type = 'memo';
    switch (row.value.type) {
      case ('graph'):
      case ('table'):
      case ('diagram'):
        type = row.value.type;
        break;
    }
    switch (row.key[2]) {
      case ('N'):
        data.fullname = row.value.fullname;
        break;
      case ('R'):
        data.readers.push(row.value._id);
        var fullname = row.value._id;
        if (row.doc && row.doc.fullname) fullname = row.doc.fullname;
        data.readers_fullnames.push(fullname);
        break;
      case ('M'):
        var type = 'memo';
        if (row.doc && row.doc.type)
        switch (row.doc.type) {
          case ('graph'):
          case ('table'):
          case ('diagram'):
            type = row.doc.type;
            break;
        }
        data.activity.push({
          action: 'commented',
          date:   row.key[1],
          diary:  row.value.diary,
          id:     row.value._id,
          name:   row.value.text,
          type:   type
        });
        break;
      case ('C'):
        data.activity.push({
          action: 'created',
          date:   row.key[1],
          diary:  row.value.diary,
          id:     row.value._id,
          name:   row.value.name,
          type:   type
        });
        break;
      case ('E'):
        data.activity.push({
          action: 'modified',
          date:   row.key[1],
          diary:  row.value.diary,
          id:     row.value._id,
          name:   row.value.name,
          type:   type
        });
        break;
    }
  }
  return Mustache.to_html(templates.user, data, shared);
}
