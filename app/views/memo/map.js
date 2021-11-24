function(o) {
  emit([o._id]);
  if (o.diary)
    emit([o._id, 'D'], {'_id': o.diary});
  if (o.corpus)
    emit([o._id, 'D'], {'_id': o.corpus});
  for (var key in o.groundings) {
    if (typeof o.groundings[key] === 'string' || o.groundings[key] instanceof String) {
      emit([o._id, 'G'], {'_id': o.groundings[key]});
      emit([o.groundings[key], 'L']);
    } else {
      emit([o._id, 'G'], o.groundings[key]);
      emit([o.groundings[key]._id, 'L']);
    }
  }
  if (o.commented)
    emit([o.commented, 'M', o.date], {'_id': o.user, 'date': o.date, 'text': o.text, 'checked': o.checked, 'id': o._id});
  if (o.history)
    emit([o._id, 'H'], {'_id': o.history[0].user, 'date': o.history[0].date});
  for (var key in o.contributors)
    emit([o._id, 'C'], {'_id': o.contributors[key]});
  for (var key in o.readers)
    emit([o._id, 'R'], {'_id': o.readers[key]});
  for (var key in o.nodes)
    emit([o._id, 'N'], {'_id': o.nodes[key].id, 'shape': o.nodes[key].shape});
}

