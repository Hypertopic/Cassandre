function(o) {
  if (o.groundings) {
    var diary = o.diary || o.corpus
    for (var ground of o.groundings) {
      if (typeof ground._id === 'string') ground = ground._id
      var type = o.type || 'transcript'
      emit([ground], {
        id: o._id,
        name: o.name,
        type: type
      })
    }
  }
}
