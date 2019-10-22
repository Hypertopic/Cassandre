function(o) {
  var diary = o.diary || o.corpus;
  if (!o.diary_name) {
    if (o.contributors)
      for (var id in o.contributors) {
        emit([o.contributors[id], diary], {'_id': diary});
      }
    if (o.readers) {
      if (o.readers.length < 1) {
        emit([null, diary], {'_id': diary});
      } else {
        for (var id in o.readers) {
          if (o.contributors.indexOf(o.readers[id]) < 0)
            emit([o.readers[id], diary], {'_id': diary});
        }
      }
    } else if (!o.commented && !o.fullname && !o.activity && !o.diary_name) {
      emit([null, diary], {'_id': diary});
    }
  }
}
