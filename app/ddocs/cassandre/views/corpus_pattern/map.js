function(o) {
  if (o.highlights) {
    var diary = o.corpus || o.diary || o._id;
    for (var [h, highlight] of Object.entries(o.highlights)) {
      emit(diary, {
        highlight: h,
        text: highlight.text,
        viewpoint: highlight.viewpoint,
        topic: highlight.topic
      });
    }
  }
}
