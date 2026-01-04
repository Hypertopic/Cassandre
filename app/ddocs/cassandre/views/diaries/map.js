function(o) {
  var diary = o.diary || o.corpus
  if (!o.diary_name && !o.memo_order) {
    if (o.contributors)
      for (var c of o.contributors) {
        emit([c, diary], {'_id': diary})
      }
    if (o.readers) {
      if (o.readers.length < 1) {
        emit([null, diary], {'_id': diary})
      } else {
        if (o.contributors) for (var r of o.readers) {
          if (o.contributors.indexOf(r) < 0)
            emit([r, diary], {'_id': diary})
        }
      }
    } else if (!o.commented && !o.fullname && !o.activity && !o.diary_name) {
      emit([null, diary], {'_id': diary})
    }
  }
}
