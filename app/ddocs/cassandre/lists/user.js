function(head, req) {
  // !json templates.user
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var commented = 0,
      created = 0,
      modified = 0,
      data = {
    activity: [],
    authorized: req.userCtx.name==req.query.startkey[0] || req.userCtx.roles.indexOf("_admin")>-1,
    i18n: localized(),
    id: req.query.startkey[0],
    list: true,
    locale: req.headers["Accept-Language"].split(',')[0].substring(0,2),
    logged: req.userCtx.name,
    logged_fullname: req.userCtx.name,
    readers: [],
    readers_fullnames: []
  };
  while (row = getRow()) {
    var type = 'memo';
    switch (row.value.type) {
      case ('graph'):
      case ('table'):
      case ('diagram'):
      case ('diary'):
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
        data.readers_fullnames.push({'fullname': fullname});
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
        commented++;
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
        created++;
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
        modified++;
        break;
    }
  }
  var i = data.readers.indexOf(req.userCtx.name);
  if (i > -1) {
    data.authorized = true;
    data.logged_fullname = data.readers_fullnames[i].fullname;
  }
  provides("html", function() {
    if (data.activity.length > 0) {
      var end = data.activity[0].date;
      data.end = end;
      end = new Date(end);
      var start = new Date(end.setFullYear(end.getFullYear() - 1));
      data.start = start.toJSON();
      data.stats = [];
      data.stats.push({
        all: created+commented+modified,
        commented: commented,
        created: created,
        modified: modified
      });
    }
    return Mustache.to_html(templates.user, data, shared);
  });
  provides("json", function() {
//    if (data.authorized)
      send(toJSON(data.activity));
  });
}
