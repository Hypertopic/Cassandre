function(o) {
  if (o.draft == true)
    emit([o.corpus, o.history[o.history.length -1].date, 'D'], {'_id': o._id, 'name': o.name});
  if (o.type == 'operational' && o.body.match(/\[ \]/))
    emit([o.diary, o.history[o.history.length -1].date, 'O'], {'_id': o._id, 'name': o.name});
  if (o.commented && o.checked != 'checked')
    emit([o.diary, o.date, 'C'], {'_id': o.commented, 'name': o.text});
}

