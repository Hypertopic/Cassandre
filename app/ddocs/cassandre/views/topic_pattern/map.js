function(o) {
  var corpus = o.corpus || o._id
  if (o.highlights) for (var [p, highlight] of Object.entries(o.highlights)) {
    emit([highlight.viewpoint, highlight.topic], {
      text: highlight.text,
      corpus: corpus,
      highlight: p
    })
  }
}
