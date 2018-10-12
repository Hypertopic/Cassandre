function(o) {
  var diary = o.diary || o.corpus;
  if (o.diary_name) {
    emit([o._id, {}, null, o.diary_name]);
  } else {
    if (o.contributors)
      for (var id in o.contributors) {
        emit([diary, o._id, o.contributors[id], {}]);
      }
    if (o.readers) {
      if (o.readers.length < 1) {
        emit([diary, o._id, null, {}]);
      } else {
        for (var id in o.readers) {
          if (o.contributors.indexOf(o.readers[id]) < 0)
            emit([diary, o._id, o.readers[id], {}]);
        }
      }
    } else if (!o.commented && !o.fullname && !o.activity) {
      emit([diary, o._id, null, {}]);
    }
  }
}
