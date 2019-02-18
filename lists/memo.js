function(head, req) {
  // !json templates.memo
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});

  const ALPHA = /[a-zàâçéêèëïîôöüùû0æœ0-9]+|[^a-zàâçéêèëïîôöüùûæœ0-9]+/gi;
  const SPACES = /^ +$/;
  var fullnames = [];

  while (row = getRow()) {
    switch (row.key[1]) {
      case ('C'):
        var id = row.value._id;
        var fullname = id;
        data.contributors.push(id);
        if (row.doc && row.doc.fullname) fullname = row.doc.fullname;
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
        if (row.doc && row.doc.fullname) fullname = row.doc.fullname;
        if (row.doc && !fullnames[id]) fullnames[id] = fullname;
        data.readers_fullnames.push(fullname);
      break;
      case ('M'):
        var user = row.value._id;
        if (row.doc && !fullnames[user]) fullnames[user] = row.doc.fullname;
        if (row.doc && row.doc.fullname) user = row.doc.fullname;
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
        if (row.doc && row.doc.fullname) user = row.doc.fullname;
        data.creator = user;
        data.date = row.value.date;
      break;
      case ('G'):
        if (row.doc)  {
          if (row.doc.body) {
            var preview = row.doc.body.substr(0, 200).replace(/\s/g, ' ');
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
            var ground_path = '../../diagram/'+diary+'/';
            break;
            case ('table'):
            var ground_path = '../../table/'+diary+'/';
            break;
            case ('graph'):
            var ground_path = '../../graph/'+diary+'/';
            break;
            default:
            var ground_path = '';
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
        if (type === 'diagram' || type === 'table') href = '../../'+type+'/'+diary+'/'+href;
        data.leaves.push({
          href: href,
          id: id,
          name: name,
          type: type
        });
      break;
      default:
      var username = req.userCtx.name;
      var type = row.doc.type || 'transcript';
      var draft = row.doc.draft || false;
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
        draft: draft,
        editable: !row.doc.contributors || row.doc.contributors && row.doc.contributors.indexOf(username)>-1 || req.userCtx.roles.indexOf("_admin")>-1,
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
        var content = {
          text: row.doc.body.replace(/\n[ \t]+/g, "\n").replace(/\n\n/g, "\n \n")
        };
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
  data.groundings = data.groundings.sort(function(a,b){return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0);});
  return Mustache.to_html(templates.memo, data, shared);
}
