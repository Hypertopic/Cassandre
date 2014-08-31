function(o) {
  var corpus = o.corpus || o.corpus_name; // compatibility with old data model
  for (h in o.highlights) {
    var highlight = o.highlights[h];
    emit(corpus, {
      highlight: h,
      text: highlight.text,
      viewpoint: highlight.viewpoint,
      topic: highlight.topic
    });
  }
}
