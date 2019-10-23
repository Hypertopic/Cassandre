function(o) {
  if (o.diary_name)
    emit([o._id, 'D'], { diary_name: o.diary_name });
  if (o.order)
    for (var i in o.order) {
      var value = { by: o.order[i].by };
      if (o.fullname) value.fullname = o.fullname;
      if (o.activity) value.activity = o.activity;
      emit([o.order[i].diary, '0', o._id], value);
    }
  if (!o.commented && !o.diary_name && !o.activity) {
    var diary = o.diary || o.corpus;
    var contributors = [].concat(o.readers, o.contributors).sort();
    var users = contributors.filter(function(item, pos, ary) {return !pos || item != ary[pos - 1];} );
    for (var i in users) {
      var update = o.date || o.history.slice(-1)[0].date || '';
      emit([diary, 'M', users[i], o._id, update], '1');
    }
  }
}
