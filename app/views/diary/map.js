function(o) {
  if (o.diary_name)
    emit([o._id, 'D'], { diary_name: o.diary_name });
  if (o.order)
    for (var item of o.order) {
      var value = { by: item.by };
      if (o.fullname) value.fullname = o.fullname;
      if (o.activity) value.activity = o.activity;
      emit([item.diary, o._id, '0'], value);
    }
  if (!o.commented && !o.diary_name && !o.activity) {
    var diary = o.diary || o.corpus;
    var contributors = [];
    if (typeof o.readers !== "undefined") contributors = o.readers;
    if (typeof o.readers === "undefined") contributors.push(null);
    if (typeof o.contributors !== "undefined") contributors = contributors.concat(o.contributors);
    contributors = contributors.sort();
    var users = contributors.filter(function(item, pos, ary) {return !pos || item != ary[pos - 1];} );
    for (var user of users) {
      var update = '';
      if (o.date) update = o.date;
      if (o.history) update = o.history.slice(-1)[0].date;
      emit([diary, user, 'M', o._id, update], '1');
    }
  }
}
