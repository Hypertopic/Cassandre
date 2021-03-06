function(o) {
  var diary = o.diary || o.corpus;
  if (o.fullname)
    emit([o._id, 'b', 'N'], {'fullname': o.fullname});
  if (o.commented) {
    emit([o.user, o.date, 'M'], {'diary': diary, '_id': o.commented, 'text': o.text});
  } else {
    for (var key in o.history) {
      if (key == 0) {var operation = 'C';} else {var operation = 'E';}
      if (o.diary_name) {
        emit([o.history[key].user, o.history[key].date, operation], {'diary': o._id, '_id': '?by=name', 'name': o.diary_name, 'type': 'diary'});
      } else {
        emit([o.history[key].user, o.history[key].date, operation], {'diary': diary, '_id': o._id , 'name': o.name, 'type': o.type});
      }
    }
    if (o.activity) {
      emit([o._id, 'b', 'R'], {'_id': o._id});
      if (o.readers) for (var key in o.readers) {
        emit([o._id, 'b', 'R'], {'_id': o.readers[key]});
      }
    }
  }
}
