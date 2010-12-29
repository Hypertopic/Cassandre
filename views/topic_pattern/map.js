function(o) {
  for (h in o.highlights) {
    var highlight = o.highlights[h];
    emit([highlight.viewpoint, highlight.topic], {
      text: highlight.text,
      highlight: h
    });
  }
}
