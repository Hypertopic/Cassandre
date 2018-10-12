function(head, req) {
  // !json templates.diary
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var memos_name = [];
  var memos_path = [];
  var items = [];
  var nodes = [];
  var edges = [];
  var data = {
    i18n: localized(),
    by: req.query.by,
    logged: req.userCtx.name,
    diary: req.query.diary,
    diagrams: [],
    graphs: [],
    sections: [],
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
      case ('M'):
        var name = row.value.name.replace(/"/g, '\\"').replace(/\s/g, ' ');
        var date = row.value.date;
        var path = 'memo'
        memos_name[row.value.id] = row.value.name;
        memos_path[row.value.id] = 'memo';
        switch (row.value.type) {
          case "transcript":
          case "field":
            var node_level = '2';
            var group = '2';
            var color = 'grey';
            break;
          case "coding":
            var node_level = '3';
            var group = '3';
            var color = 'yellow';
            break;
          case "theoretical":
            var node_level = '0';
            var group = '0';
            var color = 'green';
            break;
          case "diagram":
            data.diagrams.push(row.value.id);
            path = 'diagram';
            memos_path[row.value.id] = 'diagram';
            var node_level = '4';
            var group = '4';
            var color = 'purple';
            break;
          case "table":
            data.tables.push(row.value.id);
            path = 'table';
            memos_path[row.value.id] = 'table';
            var node_level = '4';
            var group = '8';
            var color = 'purple';
            break;
          case "operational":
            var node_level = '1';
            var group = '1';
            var color = 'red';
            break;
          case "graph":
            data.graphs.push(row.value.id);
            path = 'graph';
            memos_path[row.value.id] = 'graph';
            var node_level = '5';
            var group = '5';
            var color = 'purple';
            break;
          case "storyline":
            var node_level = '6';
            var group = '6';
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
          case 'update':
            sort_key = row.value.update;
            date = row.value.update;
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
        if (['network','timeline'].indexOf(data.by) >= 0) {
          if (name.length > 25) {
            var node_name = name.substring(0, 12)+name.substring(12, 30).replace(/\s/,"\n")+'...';
          } else {
            var node_name = name;
          }
          items.push({
            id: row.value.id,
            content: node_name,
            group: group,
            className: color,
            start: row.value.date.substring(0, 10)
          });
          nodes.push({
            id: row.value.id,
            color: {
              border: color,
              highlight: {
                border: color
              }
            },
            label: node_name,
            level: node_level,
            x: row.value.date.substring(0, 10)
          });
          for (var g in row.value.groundings) {
            if (row.value.type == 'theoretical') {
              edges.push({from: row.value.id, to: row.value.groundings[g], arrows: "from"});
            } else {
              edges.push({from: row.value.groundings[g], to: row.value.id, arrows: "to"});
            }
          }
        } else {
          var authorized = [];
          var authorized = authorized.concat(row.doc.contributors,row.doc.readers);
          if (authorized.indexOf(req.userCtx.name) > -1 || !row.doc.contributors || row.doc.contributors.length < 1 || !row.doc.readers || row.doc.readers < 1) {
            if (row.doc.body) preview = row.doc.body.replace(/\n\n/g, '\n \n');
            if (row.doc.speeches) {
              preview = row.doc.speeches.map(function(a) {
                var turn = a.text;
                if (a.actor) turn = '**'+a.actor.trim()+'** '+turn;
                return turn;
              });
              var preview = preview.join('\n \n');
            }
            section.memos.push({
              color: color,
              preview: preview.substr(0,3000),
              diary: row.key[0],
              id: row.value.id,
              name: name,
              node_level: node_level,
              rev: row.value.rev,
              date: date,
              update: row.value.update,
              groundings: row.value.groundings,
              path: path,
              type: row.value.type
            });
            data.sections.push(section);
          }
        }
      break;
      case ('D'):
        if (row.value) data.diary_name = row.value.diary_name;
      break;
    }
  }
  switch(data.by) {
    case 'network':
      data.network = {
        nodes: nodes,
        edges: edges
      };
      data.network = JSON.stringify(data.network);
      break;
    case 'timeline':
      data.timeline = JSON.stringify(items);
      break;
    default:
      data._id = data.diary;
      data.list = true;
      data.sections = data.sections.sort(function(a,b){return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);});
      if (['date','update'].indexOf(data.by) >= 0) data.sections = data.sections.reverse();
      break;
  }
  return Mustache.to_html(templates.diary, data, shared);
}
