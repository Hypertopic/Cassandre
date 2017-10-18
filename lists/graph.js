function(head, req) {
  // !json templates.graph
  // !code lib/mustache.js
  // !code l10n/l10n.js

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
        data.contributors_fullnames.push(fullname);
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
        data.readers_fullnames.push(fullname);
      break;
      case ('M'):
        var user = row.value._id;
        if (row.doc && !fullnames[user]) fullnames[user] = row.doc.fullname;
        if (row.doc) user = row.doc.fullname;
        data.comments.push({
          user: user,
          date: row.value.date,
          text: row.value.text,
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
      case ('N'):
        if (row.doc && row.doc.name) data.nodes.push({
            id: row.value._id,
            shape: row.value.shape,
            label: row.doc.name.replace(/\s/g, ' ')
          });
      break;
      case ('G'):
        if (row.doc)  {
          data.groundings.push({
            id: row.value._id,
            href: '../../diagram/'+diary+'/'+ row.value._id,
            type: 'diagram',
            name: row.doc.name
          });
          if (row.doc.link) {
            var color = 'green';
            if (row.doc.link == 'ipp' || row.doc.link == 'idd' ) var color = 'red';
            data.edges.push({
              id: row.value._id,
              from: row.doc.groundings[0],
              to: row.doc.groundings[1],
              color: color
            });
          }
          if (row.doc.negative && row.doc.negative.trim().length > 0) {
            data.edges.push({
              from: row.doc.groundings[1],
              to: row.doc.groundings[0],
              dashes: true,
              label: row.doc.negative
            });
          }
        }
      break;
      case ('L'):
        var type = row.doc.type || 'field';
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
      var type = row.doc.type || 'field';
      var diary = row.doc.diary || row.doc.corpus;
      var name = row.doc.name || '...';
      var data = {
        i18n: localized(),
        _id: row.doc._id,
        _rev: row.doc._rev,
        authorized: !row.doc.readers || row.doc.readers.indexOf(username)>-1 || row.doc.contributors && row.doc.contributors.indexOf(username)>-1 || req.userCtx.roles.indexOf("_admin")>-1,
        body: [],
        contributors: [],
        contributors_fullnames: [],
        comments: [],
        date: row.doc.date,
        diary: diary,
        edges: [],
        groundings: [],
        nodes: [],
        peer: req.peer,
        locale: req.headers["Accept-Language"],
        leaves: [],
        logged: username,
        logged_fullname: username,
        name: name.replace(/\s/g, ' '),
        readers: [],
        readers_fullnames: [],
        roles: req.userCtx.roles,
        type: type
      }
      data.locale = data.locale.split(',');
      data.locale = data.locale[0].substring(0,2);
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
  return Mustache.to_html(templates.graph, data);
}
