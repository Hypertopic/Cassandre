function(head, req) {
  var data = {
    comments: [],
    logged: req.userCtx.name,
  };
  while (r = getRow()) {
    var type = 'memo';
    if (r.doc) switch (r.doc.type) {
      case ('graph'):
      case ('table'):
      case ('diagram'):
        type = r.doc.type;
        break;
    }
    var obj = {
      id: r.value.id,
      diary: r.key[0],
      date: r.key[3],
      name: r.value.name,
      type: type
    };
    var contributors = [];
    if (r.doc) contributors = contributors.concat(r.doc.readers, r.doc.contributors).sort();
    var users = contributors.filter(function(item, pos, ary) {return !pos || item != ary[pos - 1];} );
    if ((r.doc && r.doc.readers == undefined) || (r.doc && r.doc.readers.length == 0) || users.indexOf(req.userCtx.name) > -1) {
      switch(r.key[2]) {
        case ('B'):
          data.diary_name = r.value.diary_name;
        break;
        case ('C'):
          if (r.doc) data.comments.push(obj);
        break;
      }
    }
  }
  send(toJSON(data));
}
