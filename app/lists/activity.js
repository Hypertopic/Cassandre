function(head, req) {
  // !code lib/shared.js
  var fullnames = [],
      register = [],
      data = {
    logged: req.userCtx.name,
    logged_fullname: req.userCtx.name,
    activity: [],
    list: true,
    locale: req.headers["Accept-Language"].substring(0,2)
  };
  while (row = getRow()) {
    var object = {
      user: row.value.user,
      date: row.key[2]
    };
    if (row.doc && row.doc.fullname) {
      if(!fullnames[row.value.user]) fullnames[row.value.user] = row.doc.fullname;
      object.user_fullname = row.doc.fullname;
    } else {
      if(fullnames[row.value.user]) object.user_fullname = fullnames[row.value.user];
    }
    if (row.value.modified_name) object.modified_name = row.value.modified_name;
    if (row.value.modified_id)   object.modified_id = row.value.modified_id;
    if (row.value.diary_label)   object.diary_label = 1;
    if (row.value.modified_type) {
      object.modified_type = row.value.modified_type;
    } else {
      if (row.doc && row.doc.type) object.modified_type = row.doc.type;
    }
    if (row.value.created) {
      object.created = 'created';
    }
    if (row.value.modified) {
      object.modified = 'modified';
    }
    if (row.value.comment) {
      object.commented = 'commented';
      object.modified_name = row.value.comment;
    }
    if (row.value.comment && row.doc) {
      var contributors = [].concat(row.doc.readers, row.doc.contributors).sort(),
          users = contributors.filter(function(item, pos, ary) {return !pos || item != ary[pos - 1];} );
      if (typeof row.doc.readers === "undefined" || row.doc.readers.length == 0 || users.indexOf(req.userCtx.name) > -1) data.activity.push(object);
    } else {
      if (row.value.users && row.value.users.indexOf(req.userCtx.name) > -1) data.activity.push(object);
    }
  }
  send(toJSON(data.activity));
}
