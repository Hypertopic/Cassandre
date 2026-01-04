function(o) {
  var diary = o.diary || o.corpus
  if (o.user_activity) {
    for (var a of o.user_activity) {
      emit([a.doc, a.date, o.user])
    }
  } else if (!o.diary_name && !o.fullname && !o.deadlines) { 
    var lastedit = "1"
    if (o.history) lastedit = o.history[o.history.length-1].date
    if (o.contributors) {
      for (var c of o.contributors) {
        emit([o._id, lastedit, c, diary])
      }
    }
    if (o.readers) {
      if (o.readers.length < 1) {
        emit([o._id, lastedit, null, diary])
      } else {
        for (var r of o.readers) {
          emit([o._id, lastedit, r, diary])
        }
      }
    } else if (!o.commented && !o.fullname && !o.activity) {
      emit([o._id, lastedit, null, diary])
    }
  }
}
