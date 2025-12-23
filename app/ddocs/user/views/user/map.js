function(o) {
  var diary = o.diary || o.corpus;
  if (o.commented) {
    emit([o.user, o.date, 'M'], {'diary': diary, '_id': o.commented, 'text': o.text});
  } else {
    if (o.history) for (var [key, h] of Object.entries(o.history)) {
      let operation = 'E';
      if (key == 0) operation = 'C';
      if (o.diary_name) {
        emit([h.user, h.date, operation], {'diary': o._id, '_id': o._id, 'name': o.diary_name, 'type': 'diary'});
      } else {
        emit([h.user, h.date, operation], {'diary': diary, '_id': o._id , 'name': o.name, 'type': o.type});
      }
    }
    if (o.fullname) {
      emit([o._id, 'b', 'N'], {'fullname': o.fullname});
      emit([o._id, 'b', 'R'], {'_id': o._id});
      if (o.readers) for (var r of o.readers) {
        emit([o._id, 'b', 'R'], {'_id': r});
      }
    }
  }
}
