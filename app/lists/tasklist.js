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
    i18n: localized(),
    list: true,
    locale: req.headers["Accept-Language"],
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
    var contributors = [];
    if (r.doc) contributors = contributors.concat(r.doc.readers, r.doc.contributors).sort();
    var users = contributors.filter(function(item, pos, ary) {return !pos || item != ary[pos - 1];} );
    if ((r.doc && r.doc.readers == undefined) || (r.doc && r.doc.readers.length == 0) || users.indexOf(req.userCtx.name) > -1) {
      switch(r.key[2]) {
        case ('G'):
          if (!r.doc) data.ungrounded.push(obj);
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
  }
  data.ungrounded.shift();
  provides("html", function() {
    return Mustache.to_html(templates.todo, data, shared);
  });
  provides("json", function() {
    var number = data.ungrounded.length + data.unnamed.length + data.editing.length + data.diagram.length + data.todo.length;
    send(toJSON({
      pending: number
    }));
  });
}
