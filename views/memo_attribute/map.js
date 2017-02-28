function(o) {
  var diary = o.diary || o.corpus || o._id;
  var type = o.type || 'field';
  var name = o.name || '...';
  var date = o.date;
  if (o.history) {
    date = o.history[0].date;
    for (var id in o.history) {
      var value = {
        _id: o.history[id].user
      }
      if (id < 1) value.created = 1;
      if (o.diary_name) {
        value.diary_label = o.diary_name;
      } else {
        value.modified_id = o._id;
        value.modified_name = name;
      }
      if (o.link) {
        value.diagram = 1;
      } else if (o.edges) {
        value.graph = 1;
      } else if (o.comment) {
        value.comment = 1;
      } else if (o.name) {
        value.memo = type;
      }
      emit([diary, 'A', o.history[id].date], value);
    }
  }
  if (o.commented) {
    emit([diary, 'A', date], {
      _id: o.user,
      comment: 1,
      modified_id: o.commented
    });
  }

  if (o.diary_name) {
    emit([o._id, 'D'], {
      diary_name: o.diary_name
    });
  } else if (!o.commented) {
    var type = o.type || 'field';
    var groundings = o.groundings || [];
    if (o.body) {
      var preview = o.body.substr(0, 200).replace(/\s/g, ' ');
    } else {
    if (o.speeches) {
      var preview = o.speeches[0].text.substr(0, 200) || ' ';
      } else {
      var preview = ' ';
      }
    }
    emit([diary, 'M', date], {
      id: o._id,
      rev: o._rev,
      name: name,
      type: type,
      date: date,
      groundings: groundings,
      preview: preview
    });
  }
}
