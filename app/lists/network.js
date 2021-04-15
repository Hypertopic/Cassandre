function(head, req) {
  // !json templates.network
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var read = 0, memos = [], data = {
    activity: [],
    i18n: localized(),
    logged: req.userCtx.name,
    diary: req.query.startkey[0],
    _id: req.query.startkey[0],
    list: true,
    locale: req.headers["Accept-Language"].substring(0,2),
    nodes: [],
    edges: [],
    peer: req.peer,
    update_seq: req.info.update_seq
  };
  if (req.userCtx.name == null) data.by = 'date';
  while (row = getRow()) {
    switch (row.key[3]) {
      case 'D':
        data.diary_name = row.value.diary_name;
      break;
      case '0':
        if (req.userCtx.name == row.key[2]) {
          if (row.value.fullname) data.logged_fullname = row.value.fullname;
        }
      break;
      case 'M':
        if ([null, req.userCtx.name].indexOf(row.key[2]) > -1 && memos.map(function(a){return a.id}).indexOf(row.value.id) < 0) {
          var color = 'lightgrey';
          switch(row.value.type) {
            case 'diagram': case 'storyline': case 'table': color='invis'; break;
            case 'coding': color='lightgrey'; break;
            case 'theoretical': color='grey'; break;
          }
          switch(row.value.type) {
            case 'diagram': case 'table': case 'graph': var path = row.value.type ; break;
            default : var path = 'memo' ; break;
          }
          data.nodes.push({
            'id': row.value.id,
            'type': row.value.type,
            'path': path,
            'date': row.key[4],
            'name': row.value.name.replace(/[\n\r]+/g,' ')
          });
          if (row.value.type != 'statement')
          for (i in row.value.groundings) {
            data.edges.push({
              'from': row.value.groundings[i],
              'to': row.value.id,
              'color': color
            });
          }
        }
      break;
    }
  }
  return Mustache.to_html(templates.network, data, shared);
}
