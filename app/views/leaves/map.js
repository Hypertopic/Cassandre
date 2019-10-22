function(o) {
  if (o.groundings) {
    var diary = o.diary || o.corpus;
    for (var g in o.groundings) {
      var ground = o.groundings[g];
      var type = o.type || 'transcript';
      emit([ground], {
        id: o._id,
        name: o.name,
        type: type
      });
    }
  }
}
