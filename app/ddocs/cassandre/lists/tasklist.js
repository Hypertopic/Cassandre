function(head, req) {
  // !json templates.todo
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js

  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var data = {
    diary: req.query.startkey[0],
    comment: [],
    deadend: [],
    diagram: [],
    editing: [],
    initial: [],
    i18n: localized(),
    list: true,
    locale: req.headers["Accept-Language"].split(',')[0].substring(0,2),
    logged: req.userCtx.name,
    todo: [],
    ungrounded: [],
    unnamed: []
  };
  while (r = getRow()) {
    var type = 'memo';
    if (r.doc) switch (r.doc.type) {
      case ('graph'):
      case ('table'):
      case ('diagram'):
        type = r.doc.type;
        break;
    }
    var obj = {
      id: r.value.id,
      diary: r.key[0],
      date: r.key[3],
      name: r.value.name,
      type: type
    };
    switch(r.key[2]) {
      case ('G'):
        if (!r.doc) data.ungrounded.push(obj);
      break;
      case ('I'):
        data.initial.push(obj);
      break;
      case ('L'):
        if (!r.doc) data.deadend.push(obj);
      break;
      case ('N'):
        data.unnamed.push(obj);
      break;
      case ('D'):
        data.editing.push(obj);
      break;
      case ('A'):
        data.diagram.push(obj);
      break;
      case ('O'):
        data.todo.push(obj);
      break;
    }
  }
  if (data.initial.length < 1) {
    data.ungrounded.shift();
  } else {
    for (var i of data.initial.map((e) => (e.id))) {
      var j = data.ungrounded.map((f) => (f.id)).indexOf(i);
      if (j > -1) data.ungrounded.splice(j, 1);
    }
  }
  provides("html", function() {
    return Mustache.to_html(templates.todo, data, shared);
  });
  provides("json", function() {
    send(toJSON({
      diagram: data.diagram.length,
      editing: data.editing.length,
      pending: data.todo.length,
      ungrounded: data.ungrounded.length,
      unnamed: data.unnamed.length
    }));
  });
}
