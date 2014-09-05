function(o) {
  for (var h in o.highlights) {
    var highlight = o.highlights[h];
    emit([highlight.viewpoint, highlight.topic], {
      text: highlight.text,
      corpus: o.corpus,
      highlight: h
    });
  }
}
