function(o) {
  var diary = o.diary || o.corpus;
  if (o.diary_name)
    emit([o._id, null, 'B'], {diary_name: o.diary_name});
  if (o.commented && o.text && !o.checked)
    emit([o.diary, null, 'C', o.date], {'id': o.commented, '_id': o.commented, 'name': o.text});
  var contributors = [];
  if (typeof o.readers !== "undefined") contributors = o.readers;
  if (typeof o.contributors !== "undefined") contributors = contributors.concat(o.contributors);
  contributors = contributors.sort();  
  var users = contributors.filter(function(item, pos, ary) {return !pos || item != ary[pos - 1];} );
  if (o.readers == undefined || o.readers.length == 0) users.push(null);
  for (var user of users) {
    var history_first = 0,
        history_last = 0;
    if (o.history) {
      history_first = o.history[0].date; 
      history_last = o.history[o.history.length -1].date;
    }
    if (o.name == '' || o.name == '...')
      emit([diary, user, 'N', history_last], {'id': o._id, 'name': '...'});
    if (o.editing)
      emit([diary, user, 'D', history_last], {'id': o._id, 'name': o.name});
    if (o.type == 'operational' && o.body.match(/[*-]\s+\[\s?\]/)) {
      var re = /[*-]\s+\[\s?\](.*)/g;
      while ((matches = re.exec(o.body)) != null) {
        var match = matches[1].replace(/[*#]/g, '');
        emit([o.diary, user, 'O', history_last], {'id': o._id, 'name': match});
      }
    }
    if (o.groundings && o.groundings.length < 1)
      emit([diary, user, 'G', history_first], {'id': o._id, '_id': null, 'name': o.name});
    if (o.groundings && o.groundings.length == 1) {
      var gid = o.groundings[0];
      if (typeof gid._id === 'string') gid = gid._id;
      emit([diary, user, 'G', history_first], {'id': o._id, '_id': gid, 'name': o.name});
    }
    if (o.type == 'diagram' && o.groundings && o.groundings.length == 1)
      emit([diary, user, 'A', history_first], {'id': o._id, '_id': o._id, 'name': o.name});
  }
}
