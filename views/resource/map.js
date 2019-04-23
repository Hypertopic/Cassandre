function(o) {
  if (o.diary || o.corpus) {
    var corpus = o.diary || o.corpus;
    emit(o._id, {corpus:corpus, item:o._id});
  }
}
