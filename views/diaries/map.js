function(o) {
  var diary = o.diary || o.corpus;
  if (o.diary_name) {
    emit([null, o._id, o.diary_name]);
  } else {
    if (o.contributors)
      for (var id in o.contributors) {
        emit([o.contributors[id], diary, {}]);
      }
    if (o.readers) {
      for (var id in o.readers) {
        emit([o.readers[id], diary, {}]);
      }
    } else if (!o.commented && !o.fullname && !o.activity) {
      emit([null, diary, {}]);
    }
  }
}
