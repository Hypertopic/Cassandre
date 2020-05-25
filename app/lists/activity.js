function(head, req) {
  // !json templates.activity
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var fullnames = [],
      nCommented = [],
      nCreated = [],
      nModified = [],
      memos_path = [],
      register = [],
      data = {
    i18n: localized(),
    by: req.query.by,
    logged: req.userCtx.name,
    logged_fullname: req.userCtx.name,
    diary: req.query.startkey[0],
    activity: [],
    ncreated: [],
    ncommented: [],
    nmodified: [],
    diagrams: [],
    graphs: [],
    list: true,
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
    if (row.key[3] == 'D' && row.value) data.diary_name = row.value.diary_name;
    switch (row.key[1]) {
      default:
        switch(row.value.type) {
          case ('graph'):
          case ('table'):
          case ('diagram'):
            memos_path[row.value.id] = row.value.type;
          break;
          default:
            memos_path[row.value.id] = 'memo';
          break;
        }
      break;
      case ('Z'):
        var contributors = [].concat(row.doc.readers, row.doc.contributors).sort();
        var users = contributors.filter(function(item, pos, ary) {return !pos || item != ary[pos - 1];} );
        if (row.doc.readers == undefined || row.doc.readers.length == 0 || users.indexOf(req.userCtx.name) > -1) {
          var object = {
              user: row.value._id,
              date: row.key[2]
          };
          if (row.doc && row.doc.fullname) {
            if(!fullnames[row.value._id]) fullnames[row.value._id] = row.doc.fullname;
            object.user = row.doc.fullname;
          }
          if (row.value.modified_name) object.modified_name = row.value.modified_name;
          if (row.value.modified_id)   object.modified_id = row.value.modified_id;
          if (row.value.diary_label)   object.diary_label = 1;
          if (row.value.created) {
            object.created = 'created';
            if (nCreated[object.user] == null) {
              nCreated[object.user] = '1';
            } else {
              nCreated[object.user]++;
            }
          }
          if (row.value.modified) {
            object.modified = 'modified';
            if (nModified[object.user] == null) {
              nModified[object.user] = '1';
            } else {
              nModified[object.user]++;
            }
          }
          if (row.value.comment) {
            object.commented = 'commented';
            object.modified_name = row.value.comment;
            if (nCommented[object.user] == null) {
              nCommented[object.user] = '1';
            } else {
              nCommented[object.user]++;
            }
          }
          object.modified_path = memos_path[object.modified_id];
          data.activity.push(object);
        }
      break;
    }
  }
  provides("html", function() {
    if (data.activity.length > 0) data.end = data.activity[data.activity.length-1].date;
    if (fullnames[req.userCtx.name]) data.logged_fullname = fullnames[req.userCtx.name];
    for(var user in nCommented) {
      data.ncommented.push({
        user: user,
        n: nCommented[user]
      });
    }
    for(var user in nCreated) {
      data.ncreated.push({
        user: user,
        n: nCreated[user]
      });
    }
    for(var user in nModified) {
      data.nmodified.push({
        user: user,
        n: nModified[user]
      });
    }
    return Mustache.to_html(templates.activity, data, shared);
  });
  provides("json", function() {
    send(toJSON(data.activity));
  });
}
