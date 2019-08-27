function(o) {
  var corpus = o.corpus || o._id; // compatibility with old data model
  for (var h in o.highlights) {
    var highlight = o.highlights[h];
    emit(corpus, {
      highlight: h,
      text: highlight.text,
      viewpoint: highlight.viewpoint,
      topic: highlight.topic
    });
  }
}
