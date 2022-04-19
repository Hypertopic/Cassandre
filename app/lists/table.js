function(head, req) {
  // !json templates.table
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var fullnames = [];
  while (row = getRow()) {
    switch (row.key[1]) {
      case ('C'):
        var id = row.value._id;
        var fullname = id;
        data.contributors.push(id);
        if (row.doc) fullname = row.doc.fullname;
        if (row.doc && !fullnames[id]) fullnames[id] = fullname;
        data.contributors_fullnames.push({'id': id, 'fullname': fullname});
      break;
      case ('D'):
        if (row.doc) data.diary_name = row.doc.diary_name;
      break;
      case ('R'):
        var id = row.value._id;
        var fullname = id;
        data.readers.push(id);
        if (row.doc) fullname = row.doc.fullname;
        if (row.doc && !fullnames[id]) fullnames[id] = fullname;
        data.readers_fullnames.push({'id': id, 'fullname': fullname});
      break;
      case ('M'):
        var user = row.value._id;
        if (row.doc && !fullnames[user]) fullnames[user] = row.doc.fullname;
        if (row.doc) user = row.doc.fullname;
        data.comments.push({
          user: user,
          date: row.value.date,
          text: row.value.text,
          checked: row.value.checked,
          id: row.value.id,
          rev: row.value.rev
        });
      break;
      case ('H'):
        var user = row.value._id;
        if (row.doc && !fullnames[user]) fullnames[user] = row.doc.fullname;
        if (row.doc) user = row.doc.fullname;
        data.creator = user;
        data.date = row.value.date;
      break;
      case ('G'):
        if (row.doc)  {
          if (row.doc.body) {
            var preview = row.doc.body.substr(0, 200);
          } else {
            if (row.doc.speeches) {
              var preview = row.doc.speeches[0].text.substr(0, 200) || null;
            } else {
              var preview = null;
            }
          }
          var ground_type = row.doc.type || 'transcript';
          switch (ground_type) {
            case ('diagram'):
            var ground_path = '';
            break;
            case ('graph'):
            var ground_path = '../../graph/'+diary+'/';
            break;
            default:
            var ground_path = '../../memo/'+diary+'/';
          }
          data.groundings.push({
            id: row.value._id,
            href: ground_path + row.value._id,
            type: ground_type,
            preview: preview,
            name: row.doc.name
          });
        }
      break;
      case ('L'):
        var type = row.doc.type || 'transcript';
        var id = row.doc._id;
        var href = row.doc._id;
        var name = row.doc.name || '...';
        switch (type) {
          case ('diagram'):
            break;
          case ('graph'):
            var href = '../../graph/'+diary+'/'+href;
            break;
          default:
            var href = '../../memo/'+diary+'/'+href;
        }
        data.leaves.push({
          href: href,
          id: id,
          name: name,
          type: type
        });
      break;
      default:
      var username = req.userCtx.name;
      var type = row.doc.type;
      var diary = row.doc.diary;
      var data = {
        i18n: localized(),
        _id: row.doc._id,
        _rev: row.doc._rev,
        authorized: !row.doc.readers || row.doc.readers.length==0 || row.doc.readers.indexOf(username)>-1 || row.doc.contributors && row.doc.contributors.indexOf(username)>-1 || req.userCtx.roles.indexOf("_admin")>-1,
        body: [],
        cells: row.doc.cells,
        contributors: [],
        contributors_fullnames: [],
        comments: [],
        date: row.doc.date,
        diary: diary,
        editable: !row.doc.contributors || row.doc.contributors && row.doc.contributors.indexOf(username)>-1 || req.userCtx.roles.indexOf("_admin")>-1,
        groundings: [],
        peer: req.peer,
        locale: req.headers["Accept-Language"].split(',')[0].substring(0,2),
        leaves: [],
        logged: username,
        logged_fullname: username,
        name: row.doc.name.replace(/\s/g, ' '),
        readers: [],
        readers_fullnames: [],
        roles: req.userCtx.roles,
        type: type,
        update_seq: req.info.update_seq
      }
      data.cells = JSON.stringify(data.cells);
      if (data.peer == '127.0.0.1' && req.headers['X-Forwarded-For'] ) {
        var ips = req.headers['X-Forwarded-For'].split(',');
        for (var ip of ips) {
          if (ip.trim() != '127.0.0.1') data.peer = ip.trim();
        }
      }
      if (row.doc.link) {
        data.link = row.doc.link;
        if (row.doc.negative) {
          data.negative = row.doc.negative;
        }
      }
      break;
      }
    if (fullnames[username]) data.logged_fullname = fullnames[username];
  }
  data.groundings = dSort(data.groundings, data.locale);
  return Mustache.to_html(templates.table, data, shared);
}
