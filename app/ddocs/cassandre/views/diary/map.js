function(o) {
  if (o.diary_name)
    emit([o._id, 'D'], { diary_name: o.diary_name })
  if (o.user_activity) {
    let value = { activity: o.user_activity };
    if (o.memo_order) value.by = o.memo_order;
    emit([o.diary, o.user, '0'], value);
  }
  if (!o.commented && !o.diary_name && !o.activity && !o.user_activity && !o.deadlines) {
    var diary = o.diary || o.corpus;
    let contributors = []
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
