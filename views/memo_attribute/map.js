function(o) {
  var diary = o.diary || o.corpus || o._id;
  var type = o.type || 'transcript';
  var name = o.name || '...';
  var date = o.date;
  var update = o.date;
  if (o.history) {
    date = o.history[0].date;
    update = o.history[o.history.length-1].date;
    for (var id in o.history) {
      var value = {
        _id: o.history[id].user
      }
      if (id < 1) {
        value.created = 1;
      } else {
        value.modified = 1;
      }
      if (o.diary_name) {
        value.diary_label = o.diary_name;
      } else {
        value.modified_id = o._id;
      }
      if (o.comment) {
        value.comment = 1;
      }
      emit([diary, 'Z', o.history[id].date], value);
    }
  }
  if (o.commented) {
    emit([diary, 'Z', date], {
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
    var type = o.type || 'transcript';
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
    emit([diary, 'M', name], {
      id: o._id,
      rev: o._rev,
      name: name,
      type: type,
      date: date,
      update: update,
      groundings: groundings,
      preview: preview
    });
  }
}
