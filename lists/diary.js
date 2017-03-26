function(head, req) {
  // !json templates.diary
  // !code lib/mustache.js
  // !code l10n/l10n.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var memos = [];
  var data = {
    i18n: localized(),
    by: req.query.by,
    logged: req.userCtx.name,
    diary: req.query.diary,
    activity: [],
    memos: [],
    peer: req.peer
  };
  while (row = getRow()) {
    switch (row.key[1]) {
      case ('M'):
        var name = row.value.name.replace(/"/g, '\\"').replace(/\s/g, ' ');
        memos[row.value.id] = row.value.name;
        data.memos.push({
          diary: row.key,
          id: row.value.id,
          name: name,
          rev: row.value.rev,
          date: row.value.date.substring(0, 10),
          groundings: row.value.groundings,
          type: row.value.type
        });
      break;
      case ('D'):
        if (row.value) data.diary_name = row.value.diary_name;
      break;
      case ('A'):
        var object = {
            user: row.value._id,
            date: row.key[2]
        };
        if (row.doc && row.doc.fullname) {
          object.user = row.doc.fullname;
        }
        if (row.value.modified_name) object.modified_name = row.value.modified_name;
        if (row.value.modified_id)   object.modified_id = row.value.modified_id;
        if (row.value.memo)          object.memo = 1;
        if (row.value.diagram)       object.diagram = 1;
        if (row.value.graph)         object.graph = 1;
        if (row.value.diary_label)   object.diary_label = 1;
        if (row.value.created)       object.created = 'created';
        if (row.value.comment)       object.comment = 'commented';
        object.modified_name = memos[object.modified_id];
        data.activity.push(object);
      break;
    }
  }
  return Mustache.to_html(templates.diary, data);
}
