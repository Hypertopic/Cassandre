function(head, req){
  // !json templates.editable_memo
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}})

  var fullnames = []
  while (row = getRow()) {
    switch (row.key[1]) {
      case ('C'):
      case ('R'):
      case ('M'):
      case ('H'):
        var id = row.value._id,
            fullname = id
        if (row.doc && row.doc.fullname) fullname = row.doc.fullname
        if (row.doc && !fullnames[id]) fullnames[id] = fullname
      break
      case ('D'):
        if (row.doc) data.diary_name = row.doc.diary_name
      break
      case ('L'):
      break
      case ('G'):
        if (row.doc)  {
          if (row.value.preview) {
            preview = []
            for (var p of row.value.preview) {
              preview.push(p.text)
            }
            preview = preview.join('\n \n---\n')
          } else if (row.doc.body) {
            var preview = row.doc.body.substr(0, 200)
          } else {
            if (row.doc.speeches) {
              var preview = row.doc.speeches[0].text.substr(0, 200) || null
            } else {
              var preview = null
            }
          }
          var ground_type = row.doc.type || 'transcript'
          data.groundings.push({
            id: row.value._id,
            type: ground_type,
            preview: preview,
            name: row.doc.name
          })
        }
      break
      default:
        var username = req.userCtx.name,
            data = {
          i18n: localized(),
          _id: row.doc._id,
          _rev: row.doc._rev,
          authorized: !row.doc.readers || row.doc.readers.length==0 || row.doc.readers.indexOf(username)>-1 || row.doc.contributors && row.doc.contributors.indexOf(username)>-1 || req.userCtx.roles.indexOf("_admin")>-1,
          editing: row.doc.editing || false,
          name: row.doc.name,
          locale: req.headers["Accept-Language"].split(',')[0].substring(0,2),
          logged: username,
          logged_fullname: username,
          peer: req.peer,
          type: row.doc.type,
          date: row.doc.date,
          diary: row.doc.diary,
          body: row.doc.body,
          groundings:[]
        }
      break
      }
    if (fullnames[username]) data.logged_fullname = fullnames[username]
  }
  return Mustache.to_html(templates.editable_memo, data, shared)
}
