function(head, req) {
  var fullnames = [],
      nCommented = [],
      nCreated = [],
      nModified = [],
      data = {
    diary: req.query.startkey[0],
    activity: [],
    fullnames: [],
    list: true,
    ncreated: [],
    ncommented: [],
    nmodified: []
  };
  while (row = getRow()) {
    if ((row.value.comment && row.doc && (row.doc.readers == undefined || row.doc.readers.length == 0 || [].concat(row.doc.readers, row.doc.contributors).indexOf(req.userCtx.name) > -1))
    || (!row.value.comment && row.value.users.indexOf(req.userCtx.name) > -1)) {
      var user = row.value.user;
      var object = {
        date: row.key[2]
      };
      if (row.doc && row.doc.fullname && fullnames[user] == null) fullnames[user] = row.doc.fullname;
      if (row.value.created) {
        object.created = 'created';
        if (nCreated[user] == null) {
          nCreated[user] = 1;
        } else {
          nCreated[user]++;
        }
      }
      if (row.value.modified) {
        object.modified = 'modified';
        if (nModified[user] == null) {
          nModified[user] = 1;
        } else {
          nModified[user]++;
        }
      }
      if (row.value.comment) {
        object.commented = 'commented';
        if (nCommented[user] == null) {
          nCommented[user] = 1;
        } else {
          nCommented[user]++;
        }
      }
      data.activity.push(object);
    }
  }
  if (data.activity.length > 0) data.end = data.activity[data.activity.length-1].date;
  for(var [user, n] of Object.entries(nCommented)) {
    data.ncommented.push({
      user: user,
      n: n
    });
  }
  for(var [user, n] of Object.entries(nCreated)) {
    data.ncreated.push({
      user: user,
      n: n
    });
  }
  for(var [user, n] of Object.entries(nModified)) {
    data.nmodified.push({
      user: user,
      n: n
    });
  }
  for(var [user, fullname] of Object.entries(fullnames)) {
    data.fullnames.push({
      user: user,
      fullname: fullname
    });
  }
  send(toJSON(data));
}
