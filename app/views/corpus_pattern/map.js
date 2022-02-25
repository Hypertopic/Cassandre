function(o) {
  var corpus = o.corpus || o._id;
  for (var [h, highlight] of Object.entries(o.highlights)) {
    emit(corpus, {
      highlight: h,
      text: highlight.text,
      viewpoint: highlight.viewpoint,
      topic: highlight.topic
    });
  }
}
