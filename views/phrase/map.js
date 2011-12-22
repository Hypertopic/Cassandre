const CRUNCHER = /[a-zàâçéêèëïîôöüùûæœ0-9]+|[^a-zàâçéêèëïîôöüùûæœ0-9]+/gi;

function(o) {
  if (o.draft!='ongoing') {
    for each (var s in o.speeches) {
      var chunks = s.text.match(CRUNCHER);
      for (var i=0; i<chunks.length-4; i+=2) {
        if (
          (chunks[i].length>3 || chunks[i+2].length>3 || chunks[i+4].length>3)
          && chunks[i+1].length==1
          && chunks[i+3].length==1
        ) {
          emit([
            o.corpus,
            chunks[i].toLowerCase(),
            chunks[i+2].toLowerCase(),
            chunks[i+4].toLowerCase()
          ]);
        }
      }
    }
  }
}
