function(o) {
  if (o.draft!='ongoing') {
    const ALPHA = /[a-zàâçéêèëïîôöüùû0-9]+/gi;
    for each (var p in o.speeches) {
      var speechWords = p.text.match(ALPHA);
      if (speechWords) for each (var w in speechWords) {
        emit([o._id, w.toLowerCase()]);
        emit([o.corpus, w.toLowerCase()]);
      }
    }
  }
}
