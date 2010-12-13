function(doc) {
  const ALPHA = /[a-zàâçéêèëïîôöüùû0-9]+/gi;
  for each (var p in doc.speeches) {
    var speechWords = p.text.match(ALPHA);
    if (speechWords) for each (var w in speechWords) {
      emit([w.toLowerCase()], 1);
    }
  }
}
