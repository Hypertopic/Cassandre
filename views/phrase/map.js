function(doc) {
  const ALPHA = /[a-zàâçéêèëïîôöüùû]+|[^a-zàâçéêèëïîôöüùû]+/gi;
  words = [];
  for each (p in doc.posts) {
    words = words.concat(p.text.match(ALPHA));
  }
  for (i=0; i<words.length-2; i+=2) {
    if (
      words[i+1].length==1
      && words[i+3].length==1
      && words[i+5].length==1
    ) {
      emit([
        words[i].toLowerCase(),
        words[i+2].toLowerCase(),
        words[i+4].toLowerCase(),
        words[i+6].toLowerCase()
      ], doc._id);
    }
  }
}
