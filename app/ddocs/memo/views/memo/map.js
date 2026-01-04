function(o) {
  emit([o._id])
  if (o.diary)
    emit([o._id, 'D'], {'_id': o.diary})
  if (o.corpus)
    emit([o._id, 'D'], {'_id': o.corpus})
  if (o.groundings) for (var g of o.groundings) {
    if (typeof g === 'string' || g instanceof String) {
      if ([o.diary, o._id].indexOf(g) < 0) {
        emit([o._id, 'G'], {'_id': g})
        emit([g, 'L'])
      }
    } else {
      emit([o._id, 'G'], g)
      emit([g._id, 'L'])
    }
  }
  if (o.commented)
    emit([o.commented, 'M', o.date], {'_id': o.user, 'date': o.date, 'text': o.text, 'checked': o.checked, 'id': o._id})
  if (o.history)
    emit([o._id, 'H'], {'_id': o.history[0].user, 'date': o.history[0].date})
  if (o.contributors) for (var c of o.contributors)
    emit([o._id, 'C'], {'_id': c})
  if (o.readers) for (var r of o.readers)
    emit([o._id, 'R'], {'_id': r})
  if (o.nodes) for (var n of o.nodes)
    emit([o._id, 'N'], {'_id': n.id, 'shape': n.shape})
}

