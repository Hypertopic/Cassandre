function(o) {
  emit([o._id]);
  if (o.diary)
    emit([o._id, 'D'], {'_id':o.diary});
  if (o.corpus)
    emit([o._id, 'D'], {'_id':o.corpus});
  for (var key in o.groundings) {
    emit([o._id, 'G'], {'_id':o.groundings[key]});
    emit([o.groundings[key], 'L']);
  }
  if (o.commented)
    emit([o.commented, 'M', o.date], {'_id':o.user, 'date': o.date, 'text': o.text, 'id': o._id, 'rev': o._rev});
  if (o.history)
    emit([o._id, 'H'], {'_id':o.history[0].user, 'date': o.history[0].date});
  for (var key in o.contributors)
    emit([o._id, 'C'], {'_id':o.contributors[key]});
  for (var key in o.readers)
    emit([o._id, 'R'], {'_id':o.readers[key]});
}

