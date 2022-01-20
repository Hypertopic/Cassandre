function(head, req) {
  // !json templates.memo
  // !json templates.deleted
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});

  const ALPHA = /[a-zàâçéêèëïîôöüùû0æœ0-9]+|[^a-zàâçéêèëïîôöüùûæœ0-9]+/gi;
  const SPACES = /^ +$/;
  var fullnames = [];
  var data = { i18n: localized() };

  while (row = getRow()) {
    switch (row.key[1]) {
      case ('C'):
        var id = row.value._id;
        var fullname = id;
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
              ground_path = '',
              preview = null;
          if (row.value.preview) {
            preview = [];
            for (var p in row.value.preview) {
              preview.push('['+row.value.preview[p].text+']('+row.value._id+'#'+row.value.preview[p].anchor+')');
            }
            preview = preview.join('\n \n---\n');
          } else {
            if (row.doc.body) preview = row.doc.body;
            if (row.doc.speeches) preview = row.doc.speeches[0].text;
            if (row.doc.negative) preview = row.doc.negative;
            if (preview != null) preview = preview.substr(0, 200);
          }
          switch (ground_type) {
            case ('diagram'):
            case ('table'):
            case ('graph'):
              ground_path = '../../'+ground_type+'/'+diary+'/';
            break;
          }
          ground_path += row.value._id;
          if (row.value.anchor) ground_path += '#'+row.value.anchor;
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
        if (type === 'diagram' || type === 'table') href = '../../'+type+'/'+diary+'/'+href;
        if (typeof data.leaves !== 'undefined') data.leaves.push({
          href: href,
          id: id,
          name: name,
          type: type
        });
      break;
      default:
      var username = req.userCtx.name;
      var type = row.doc.type || 'transcript';
      var editing = row.doc.editing || false;
      var diary = row.doc.diary || row.doc.corpus;
      var data = {
        i18n: localized(),
        _id: row.doc._id,
        _rev: row.doc._rev,
        authorized: !row.doc.readers || row.doc.readers.length==0 || row.doc.readers.indexOf(username)>-1 || row.doc.contributors && row.doc.contributors.indexOf(username)>-1 || req.userCtx.roles.indexOf("_admin")>-1,
        body: [],
        contributors: [],
        contributors_fullnames: [],
        comments: [],
        date: row.doc.date,
        diary: diary,
        editable: !row.doc.contributors || row.doc.contributors && row.doc.contributors.indexOf(username)>-1 || req.userCtx.roles.indexOf("_admin")>-1,
        editing: editing,
        groundings: [],
        peer: req.peer,
        locale: req.headers["Accept-Language"],
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
      if (data.peer == '127.0.0.1' && req.headers['X-Forwarded-For'] ) {
        var ips = req.headers['X-Forwarded-For'].split(',');
        for (var n in ips) {
          if (ips[n].trim() != '127.0.0.1') data.peer = ips[n].trim();
        }
      }
      data.locale = data.locale.split(',');
      data.locale = data.locale[0].substring(0,2);
      if (row.doc.body) {
        var body = row.doc.body.replace(/\n\t/g, "\n ").replace(/\n {4,}/g, "\n").replace(/\n\n/g, "\n \n");
        if (row.doc.type == 'interview') {
          var content = {
            words: []
          };
          for each (var w in body.match(ALPHA)) {
            if (w.match(SPACES) && content.words.length>0) {
              w = content.words.pop() + w;
            }
            content.words.push(w);
          }
        } else {
          var content = {
            text: body
          };
        }
        data.body.push(content);
      } else {
        for each (var s in row.doc.speeches) {
          var content = {
            actor: s.actor,
            timestamp: s.timestamp,
            words: []
          };
          for each (var w in s.text.match(ALPHA)) {
            if (w.match(SPACES) && content.words.length>0) {
              w = content.words.pop() + w;
            }
            content.words.push(w);
          }
          data.body.push(content);
        }
      }
      break;
      }
    if (fullnames[username]) data.logged_fullname = fullnames[username];
  }
  data.groundable = data.editable;
  if (data._id) {
    if (data.editing && data.editing.user) data.editing.user_fullname = data.editing.user;
    if (fullnames[data.editing.user]) data.editing.user_fullname = fullnames[data.editing.user];
    data.groundings = dSort(data.groundings, data.locale);
    return Mustache.to_html(templates.memo, data, shared);
  } else {
    return Mustache.to_html(templates.deleted, {i18n: localized()}, shared);
  }
}
