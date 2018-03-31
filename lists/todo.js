function(head, req) {
  // !json templates.todo
  // !code lib/mustache.js
  // !code l10n/l10n.js

  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var data = {
    comment: [],
    draft: [],
    todo: [],
    i18n: localized(),
    locale: req.headers["Accept-Language"],
    logged: req.userCtx.name
  };
  while (r = getRow()) {
    var type = 'memo';
    if(r.doc) switch (r.doc.type) {
      case ('graph'):
      case ('table'):
      case ('diagram'):
        type = r.doc.type;
        break;
    }
    var obj = {
      id: r.value._id,
      diary: r.key[0],
      date: r.key[1],
      name: r.value.name,
      type: type
    };
    switch(r.key[2]) {
      case ('D'):
        data.draft.push(obj);
      break;
      case ('O'):
        data.todo.push(obj);
      break;
      case ('C'):
        if (r.doc) data.comment.push(obj);
      break;
    }
  }
  return Mustache.to_html(templates.todo, data);
}



