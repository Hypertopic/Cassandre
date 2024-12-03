function(head, req) {
  // !json templates.export
  // !json templates.toxml
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  var memos_name = [],
      data = {
    i18n: localized(),
    by: req.query.by,
    logged: req.userCtx.name,
    diary: req.query.startkey[0],
    memos: [],
    docs: [],
    locale: req.headers["Accept-Language"].split(',')[0].substring(0,2),
    peer: req.peer
  };
  if (data.peer == '127.0.0.1' && req.headers['X-Forwarded-For'] ) {
    var ips = req.headers['X-Forwarded-For'].split(',');
    for (var ip of ips) {
      if (ip.trim() != '127.0.0.1') data.peer = ip.trim();
    }
  }
  while (row = getRow()) {
    var preview = '';
    var groundings = [];
    switch (row.key[3]) {
      case ('M'):
        var name = row.value.name.replace(/"/g, '\\"').replace(/\s/g, ' '),
            date = row.value.date,
            author = row.doc.user || '';
        if (row.doc.history) author = row.doc.history[0].user;
        memos_name[row.value.id] = row.value.name;
        var authorized = [];
        authorized = authorized.concat(row.doc.contributors,row.doc.readers);
        if (authorized.indexOf(req.userCtx.name) > -1 || !row.doc.readers) {
          if (row.doc.body) preview = row.doc.body.replace(/\n\n/g, '\n \n');
          if (row.doc.speeches) {
            preview = row.doc.speeches.map(function(a) {
              var turn = a.text;
              if (a.actor) turn = '**'+a.actor.trim()+'** '+turn;
              return turn;
            });
            preview = preview.join('\n \n');
          }
          for (var id of row.value.groundings) {
            if (typeof id._id === 'string') id = id._id;
            groundings.push({
              'id': id,
              'name': memos_name[id]
            });
          }
          var obj = {
            diary: row.key[0],
            id: row.value.id,
            name: name,
            date: date,
            author: author,
            update: row.value.update,
            groundings: groundings,
            type: row.value.type // || 'transcript'
          };
          if (obj.date.substring(0, 10) === obj.update.substring(0, 10)) delete obj.update;
          switch (obj.type) {
            case 'graph':
              obj.nodes = row.doc.nodes;
              obj.edges = row.doc.edges;
              obj.graph = true;
            break;
            case 'diagram':
              obj.link = row.doc.link;
              obj.negative = row.doc.negative;
              obj.statement = row.doc.statement;
            break;
            default:
              obj.body = preview;
            break;
          }
          if (obj.type !== 'statement') data.memos.push(obj);
          var p = row.doc;
          delete p._rev;
          delete p.comments;
          data.docs.push(p);
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
      data.memos.sort(function(a,b){
        return a.date > b.date ? 1 : -1;
      });
    break;
  }
  switch(req.query.in) {
    case('xml'):
      data.diary_name = req.query.diary_name;
      start({"headers":{"Content-Type":"application/xml;charset=utf-8"}});
      for (var m of data.memos) {
        if (m.body) m.body = m.body.replace(/\n \n/g, '</p><p>')
      }
      return Mustache.to_html(templates.toxml, data);
    break;
    case('json'):
      var json = data;
      delete json.i18n;
      delete json.by;
      delete json.diary;
      delete json.list;
      delete json.logged;
      delete json.locale;
      delete json.peer;
      delete json.memos;
      delete json._id;
      json.docs.unshift({
        '_id': req.query.startkey[0],
        'diary_name': req.query.diary_name
      })
      start({"headers":{"Content-Type":"application/json;charset=utf-8"}});
      send(toJSON(data));
    break;
    case('pdf'):
      start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
      return Mustache.to_html(templates.topdf, data);
    break;
    default:
      start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
      return Mustache.to_html(templates.export, data, shared);
    break;
  }
}
