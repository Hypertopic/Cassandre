function(head, req) {
  // !json templates.export
  // !json templates.toxml
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  var memos_name = [];
  var items = [];
  var nodes = [];
  var edges = [];
  var data = {
    i18n: localized(),
    by: req.query.by,
    logged: req.userCtx.name,
    diary: req.query.startkey[0],
    sections: [],
    locale: req.headers["Accept-Language"],
    peer: req.peer,
    tables: []
  };
  data.locale = data.locale.split(',');
  data.locale = data.locale[0].substring(0,2);
  if (data.peer == '127.0.0.1' && req.headers['X-Forwarded-For'] ) {
    var ips = req.headers['X-Forwarded-For'].split(',');
    for (var n in ips) {
      if (ips[n].trim() != '127.0.0.1') data.peer = ips[n].trim();
    }
  }
  var section;
  var sort_key;
  var alphabetical = ("name"==req.query.by);
  if (alphabetical) {
    data.sections.push({
      memos: []
    });
  }
  while (row = getRow()) {
    var preview = '';
    var groundings = [];
    sort_key = row.value.date;
    switch (row.key[1]) {
      case ('M'):
        var name = row.value.name.replace(/"/g, '\\"').replace(/\s/g, ' ');
        var date = row.value.date;
        memos_name[row.value.id] = row.value.name;
        if (!alphabetical && (!section || sort_key != section.value)) {
          section = {
            value: sort_key,
            memos: []
          };
        } else {
          section = data.sections.pop();
        }
        var authorized = [];
        var authorized = authorized.concat(row.doc.contributors,row.doc.readers);
        if (authorized.indexOf(req.userCtx.name) != -1) {
          if (row.doc.body) preview = row.doc.body.replace(/\n\n/g, '\n \n');
          if (row.doc.speeches) {
            preview = row.doc.speeches.map(function(a) {
              var turn = a.text;
              if (a.actor) turn = '**'+a.actor.trim()+'** '+turn;
              return turn;
            });
            var preview = preview.join('\n \n');
          }
          if (row.doc.history) var author = row.doc.history[0].user;
          for (i in row.value.groundings) {
            var id = row.value.groundings[i];
            groundings.push({
              'id': id,
              'name': memos_name[id]
            });
          }
          section.memos.push({
            preview: preview,
            diary: row.key[0],
            id: row.value.id,
            name: name,
//            rev: row.value.rev,
            date: date,
            author: author,
            update: row.value.update,
            groundings: groundings,
            type: row.value.type
          });
          data.sections.push(section);
        }
      break;
      case ('D'):
        if (row.value) data.diary_name = row.value.diary_name;
      break;
    }
  }
  switch(data.by) {
    default:
      data._id = data.diary;
      data.list = true;
      data.sections = data.sections.sort(function(a,b){return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);});
      break;
  }
  switch(req.query.in) {
    case('xml'):
      delete data.i18n;
      delete data.by;
      start({"headers":{"Content-Type":"application/xml;charset=utf-8"}});
      return Mustache.to_html(templates.toxml, data);
    break;
    case('json'):
      delete data.i18n;
      delete data.by;
      start({"headers":{"Content-Type":"application/json;charset=utf-8"}});
      send(toJSON(data));
    break;
    default:
      start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
      return Mustache.to_html(templates.export, data, shared);
    break;
  }
}
