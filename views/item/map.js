function(o) {
  if (o.name && o.corpus) {
    emit([o.corpus, o._id], {name: o.name});
  }
}
