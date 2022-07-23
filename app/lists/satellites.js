function(head, req) {
  // !json templates.memo
  // !json templates.deleted
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js

  const ALPHA = /[a-zàâçéêèëïîôöüùû0æœ0-9]+|[^a-zàâçéêèëïîôöüùûæœ0-9]+/gi;
  const SPACES = /^ +$/;
  var data = {
        comments: [],
        contributors: [],
        contributors_fullnames: [],
        groundings: [],
        leaves: [],
        readers_fullnames: [],
        readers: []
      },
      diary = req.query.startkey[0],
      fullnames = [],
      username = req.userCtx.name;

  while (row = getRow()) {
    switch (row.key[1]) {
      case ('C'):
        var id = row.value._id,
            fullname = id;
        data.contributors.push(id);
        if (row.doc && row.doc.fullname) fullname = row.doc.fullname;
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
        if (row.doc && row.doc.fullname) fullname = row.doc.fullname;
        if (row.doc && !fullnames[id]) fullnames[id] = fullname;
        data.readers_fullnames.push({'id': id, 'fullname': fullname});
      break;
      case ('M'):
        var user = row.value._id;
        if (row.doc && !fullnames[user]) fullnames[user] = row.doc.fullname;
        if (row.doc && row.doc.fullname) user = row.doc.fullname;
        if (data && data.comments) data.comments.push({
          user: user,
          date: row.value.date,
          text: row.value.text,
          checked: row.value.checked,
          id: row.value.id
        });
      break;
      case ('H'):
        var user = row.value._id;
        if (row.doc && !fullnames[user]) fullnames[user] = row.doc.fullname;
        if (row.doc && row.doc.fullname) user = row.doc.fullname;
        data.creator = user;
        data.date = row.value.date;
      break;
      case ('G'):
        if (row.doc)  {
          var ground_type = row.doc.type || 'transcript',
              ground_path = '../',
              preview = null;
          if (row.value.preview) {
            preview = [];
            for (var p of row.value.preview) {
              preview.push('['+p.text+']('+row.value._id+'#'+p.anchor+')');
            }
            preview = preview.join('\n \n---\n');
          } else {
            if (row.doc.body && row.doc.body.replace(/\s/g, '').length > 0) preview = row.doc.body;
            if (row.doc.speeches) preview = row.doc.speeches[0].text;
            if (row.doc.negative) preview = row.doc.negative;
            if (preview != null) preview = preview.substr(0, 200);
          }
          ground_path += type2path(ground_type)+'/'+row.value._id;
          if (row.value.anchor) ground_path += '#'+row.value.anchor;
          if (row.value._id !== diary)
          data.groundings.push({
            id: row.value._id,
            href: ground_path,
            type: ground_type,
            preview: preview,
            name: row.doc.name
          });
        }
      break;
      case ('L'):
        var type = row.doc.type || 'transcript',
            id = row.doc._id,
            href = row.doc._id,
            name = row.doc.name || '...';
        href = '../'+type2path(type)+'/'+href;
        if (typeof data.leaves !== 'undefined') data.leaves.push({
          href: href,
          id: id,
          name: name,
          type: type
        });
      break;
    }
    if (username && fullnames[username]) data.logged_fullname = fullnames[username];
  }
  data.groundings = dSort(data.groundings, data.locale);
  return toJSON(data);
}
