function(o) {
  for each (var u in o.users) {
    emit([u], {corpus:{id:o._id, name:o.corpus_name}});
  }
}
