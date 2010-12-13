function(doc) {
  const ALPHA = /[a-zàâçéêèëïîôöüùû0-9]+/gi;
  var words = [];
  for each (var p in doc.speeches) {
    var speechWords = p.text.match(ALPHA);
    if (speechWords) {
      words = words.concat(speechWords);
    }
  }
  var counts = {};
  var sum = 0;
  for each (var t in words) {
    if (t.length>0) {
      t = t.toLowerCase();
      sum++;
      if (!counts[t]) {
        counts[t] = 0;
      }
      counts[t]++;
    }
  }
  for (var word in counts) {
    emit([word], counts[word]);
  }
}
