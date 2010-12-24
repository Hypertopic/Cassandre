function(doc) {
  const ALPHA = /[a-zàâçéêèëïîôöüùû0-9]+/gi;
  var counts = {};
  for each (var p in doc.speeches) {
    var words = p.text.match(ALPHA);
    if (words) for each (var t in words) {
      t = t.toLowerCase();
      if (!counts.hasOwnProperty(t)) {
        counts[t] = 0;
      }
      counts[t]++;
    }
  }
  for (var word in counts) {
    emit([word], counts[word]);
  }
}
