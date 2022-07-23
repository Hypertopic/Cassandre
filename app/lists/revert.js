function(head, req){
  // !json templates.revert
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});

  var fullnames = [];
  while (row = getRow()) {
    switch (row.key[1]) {
      case ('C'):
      case ('R'):
      case ('M'):
      case ('H'):
        var id = row.value._id;
        var fullname = id;
        if (row.doc && row.doc.fullname) fullname = row.doc.fullname;
        if (row.doc && !fullnames[id]) fullnames[id] = fullname;
      break;
      case ('D'):
        if (row.doc) data.diary_name = row.doc.diary_name;
      break;
      case ('L'):
      case ('G'):
      break;
      default:
        var username = req.userCtx.name;
        var data = {
          i18n: localized(),
          _id: row.doc._id,
          _rev: row.doc._rev,
          authorized: !row.doc.readers || row.doc.readers.length==0 || row.doc.readers.indexOf(username)>-1 || row.doc.contributors && row.doc.contributors.indexOf(username)>-1 || req.userCtx.roles.indexOf("_admin")>-1,
          current: row.doc._rev.split('-')[0],
          editable: !row.doc.contributors || row.doc.contributors && row.doc.contributors.indexOf(username)>-1 || req.userCtx.roles.indexOf("_admin")>-1,
          editing: row.doc.editing || false,
          name: row.doc.name,
          locale: req.headers["Accept-Language"].split(',')[0].substring(0,2),
          logged: username,
          logged_fullname: username,
          peer: req.peer,
          type: row.doc.type,
          date: row.doc.history[row.doc.history.length-1].date,
          diary: row.doc.diary,
          body: row.doc.body,
          groundings:[]
        }
      break;
      }
    if (fullnames[username]) data.logged_fullname = fullnames[username];
  }
  return Mustache.to_html(templates.revert, data, shared);
}
