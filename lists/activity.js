function(head, req) {
  // !json templates.activity
  // !code lib/mustache.js
  // !code l10n/l10n.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var memos_name = [];
  var memos_path = [];
  var data = {
    i18n: localized(),
    by: req.query.by,
    logged: req.userCtx.name,
    diary: req.query.diary,
    activity: [],
    diagrams: [],
    graphs: [],
    sections: [],
    network: {},
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
    switch (row.key[1]) {
      case ('D'):
        if (row.value) data.diary_name = row.value.diary_name;
      break;
      case ('M'):
        memos_name[row.value.id] = row.value.name;
        memos_path[row.value.id] = 'memo';
        break;
      case ('Z'):
        var object = {
            user: row.value._id,
            date: row.key[2]
        };
        if (row.doc && row.doc.fullname) {
          object.user = row.doc.fullname;
        }
        if (row.value.modified_name) object.modified_name = row.value.modified_name;
        if (row.value.modified_id)   object.modified_id = row.value.modified_id;
        if (row.value.diary_label)   object.diary_label = 1;
        if (row.value.created)       object.created = 'created';
        if (row.value.modified)      object.modified = 'modified';
        if (row.value.comment)       object.comment = 'commented';
        object.modified_name = memos_name[object.modified_id];
        object.modified_path = memos_path[object.modified_id];
        data.activity.push(object);
      break;
    }
  }
  data.activity = data.activity.reverse();
  return Mustache.to_html(templates.activity, data);
}
