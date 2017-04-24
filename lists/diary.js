function(head, req) {
  // !json templates.diary
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
    sections: [],
    peer: req.peer
  };
  var section;
  var sort_key;
  var alphabetical = ("name"==req.query.by);
  if (alphabetical) {
    data.sections.push({
      memos: []
    });
  }
  while (row = getRow()) {
    switch (row.key[1]) {
      case ('M'):
        var name = row.value.name.replace(/"/g, '\\"').replace(/\s/g, ' ');
        memos_name[row.value.id] = row.value.name;
        memos_path[row.value.id] = 'memo';
        switch (row.value.type) {
          case "field":
            var node_level = '2';
            var color = 'grey';
            break;
          case "coding":
            var node_level = '3';
            var color = 'yellow';
            break;
          case "theoretical":
            var node_level = '0';
            var color = 'green';
            break;
          case "diagram":
            memos_path[row.value.id] = 'diagram';
            var node_level = '4';
            var color = 'purple';
            break;
          case "operational":
            var node_level = '1';
            var color = 'red';
            break;
          case "graph":
            memos_path[row.value.id] = 'graph';
            var node_level = '5';
            var color = 'purple';
            break;
          case "storyline":
            var node_level = '6';
            var color = 'blue';
            break;
        }
        switch (data.by) {
          case 'name':
            sort_key = row.value.name;
            break;
          case 'type':
            sort_key = row.value.type;
            break;
          case 'date':
            sort_key = row.value.date;
            break;
        }
        if (!alphabetical && (!section || sort_key != section.value)) {
          section = {
            value: sort_key,
            memos: []
          };
        } else {
          section = data.sections.pop();
        }
        section.memos.push({
          color: color,
          diary: row.key,
          id: row.value.id,
          name: name,
          node_level: node_level,
          rev: row.value.rev,
          date: row.value.date.substring(0, 10),
          groundings: row.value.groundings,
          type: row.value.type
        });
        data.sections.push(section);
      break;
      case ('D'):
        if (row.value) data.diary_name = row.value.diary_name;
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
  data.sections = data.sections.sort(function(a,b){return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);});
  if (data.by == 'date') data.sections = data.sections.reverse();
  data.activity = data.activity.reverse();
  return Mustache.to_html(templates.diary, data);
}
