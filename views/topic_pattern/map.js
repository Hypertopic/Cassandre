function(o) {
  var corpus = o.corpus || o.corpus_name; // compatibility with old data model
  for (var h in o.highlights) {
    var highlight = o.highlights[h];
    emit([highlight.viewpoint, highlight.topic], {
      text: highlight.text,
      corpus: corpus,
      highlight: h
    });
  }
}
