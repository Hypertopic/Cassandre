function(o) {
  var diary = o.diary || o.corpus;
  if (o.diary_name)
    emit([o._id, null, 'dn'], {diary_name: o.diary_name});
  if (o.name == '' || o.name == '...')
    emit([diary, o.history[o.history.length -1].date, 'N'], {'id': o._id, 'name': '...'});
  if (o.editing)
    emit([diary, o.history[o.history.length -1].date, 'D'], {'id': o._id, 'name': o.name});
  if (o.commented && o.checked != 'checked')
    emit([o.diary, o.date, 'C'], {'id': o.commented, '_id': o.commented, 'name': o.text});
  if (o.type == 'operational' && o.body.match(/[*-]\s+\[\s?\]/)) {
    var re = /[*-]\s+\[\s?\](.*)/g;
    while ((matches = re.exec(o.body)) != null) {
      var match = matches[1].replace(/[*#]/g, '');
      emit([o.diary, o.history[o.history.length -1].date, 'O'], {'id': o._id, 'name': match});
    }
  }
  if (o.groundings && o.groundings.length < 1)
    emit([diary, o.history[0].date, 'G'], {'id': o._id, '_id': null, 'name': o.name});
  if (o.groundings && o.groundings.length == 1)
    emit([diary, o.history[0].date, 'G'], {'id': o._id, '_id': o.groundings[0], 'name': o.name});
  if (o.type == 'diagram' && o.groundings && o.groundings.length == 1)
    emit([diary, o.history[0].date, 'A'], {'id': o._id, '_id': o._id, 'name': o.name});
}

