function(doc) {
  if (doc.diary) {
    emit(doc.diary);
  } else if (doc.corpus) {
    emit(doc.corpus);
  }
}
