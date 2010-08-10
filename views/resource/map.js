function(o) {
  if (o.corpus) {
    emit(o._id, {corpus:o.corpus, item:o._id});
  }
}
