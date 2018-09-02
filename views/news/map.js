function(o) {
  var diary = o.diary || o.corpus;
  if (o.activity) {
    for (var i in o.activity) {
      emit([o.activity[i].doc, o.activity[i].date, o._id]);
    }
  } else if (!o.diary_name) { 
    var lastedit = 1;
    if (o.history) lastedit = o.history[o.history.length-1].date;
    if (o.contributors) {
      for (var id in o.contributors) {
        emit([o._id, lastedit, o.contributors[id], diary]);
      }
    }
    if (o.readers) {
      for (var id in o.readers) {
        emit([o._id, lastedit, o.readers[id], diary]);
      }
    } else if (!o.commented && !o.fullname && !o.activity) {
      emit([o._id, lastedit, null, diary]);
    }
  }
}
