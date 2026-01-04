function(o) {
  var diary = o.diary || o.corpus
  if (o.name && diary) {
    emit([diary, o._id], {name: o.name})
  }
}
