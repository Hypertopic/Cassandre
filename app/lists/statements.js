function(head, req) {
  // !json templates.memo
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var i18n = localized(),
      diary = req.query.startkey[0],
      username = req.userCtx.name,
      data = {
    i18n: i18n,
    body: {text: ''},
    diary: diary,
    _id: diary,
    locale: req.headers["Accept-Language"].substring(0,2),
    name: i18n["i_name"]["statement"],
    authorized: true,
    contributors: [],
    readers: [],
    editable: false,
    flat: false,
    groundings: [],
    leaves: [],
    type: 'storyline',
    logged: username,
    logged_fullname: username,
    statements: true,
    update_seq: req.info.update_seq
  };
  while (row = getRow()) {
    switch (row.key[2]) {
      case 'L':
        data.leaves.push({
          id: row.value.id,
          href: '../graph/'+ diary +'/'+ row.value.id,
          type: 'graph',
          name: row.value.name
        });
      break;
      case 'S':
        data.groundings.push({
          id: row.value._id,
          href: '../diagram/'+ diary +'/'+ row.value._id,
          type: 'diagram',
          preview: row.doc.negative,
          name: row.doc.name
        });
        data.body.text += '* '+row.doc.statement+"\n";
        if (row.doc.contributors && row.doc.contributors.length > 0)
          for (var n in row.doc.contributors)
            if (data.contributors.indexOf(row.doc.contributors[n]) == -1)
              data.contributors.push(row.doc.contributors[n]);
        if (row.doc.readers && row.doc.readers.length > 0)
          for (var n in row.doc.readers)
            if (data.readers.indexOf(row.doc.readers[n]) == -1)
              data.readers.push(row.doc.readers[n]);
      break;
    }
  }
  data.groundable = !data.contributors || data.contributors && data.contributors.indexOf(username)>-1 || req.userCtx.roles.indexOf("_admin")>-1;
  return Mustache.to_html(templates.memo, data, shared);
}
