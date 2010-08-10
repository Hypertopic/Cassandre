function(o) {
  for each (u in o.users) {
    emit([u], {corpus:{id:o._id, name:o.corpus_name}});
  }
}
