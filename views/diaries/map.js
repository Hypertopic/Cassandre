function(doc) {
  var diaries = {};
  if (doc.diary_name) {
    emit(['name', doc._id, doc.diary_name]);
  } else if (doc.diary) {
    emit(['text', doc.diary]);
  } else if (doc.corpus) {
    emit(['text', doc.corpus]);
  }
}
