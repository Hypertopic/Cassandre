function(doc) {
  const ALPHA = /[a-zàâçéêèëïîôöüùû0-9]+/gi;
  words = [];
  for each (p in doc.posts) {
    words = words.concat(p.text.match(ALPHA));
  }
  counts = {};
  sum = 0;
  for each (t in words) {
    if (t.length>0) {
      t = t.toLowerCase();
      sum++;
      if (!counts[t]) {
        counts[t] = 0;
      }
      counts[t]++;
    }
  }
  for (word in counts) {
    emit([doc._id], {
      "word":word,
      "this":counts[word],
      "on":sum
    });
  }
}
