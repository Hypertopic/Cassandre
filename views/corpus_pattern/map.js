function(o) {
  for (h in o.highlights) {
    var highlight = o.highlights[h];
    emit(o._id, {
      highlight: h,
      text: highlight.text,
      viewpoint: highlight.viewpoint,
      topic: highlight.topic
    });
  }
}
