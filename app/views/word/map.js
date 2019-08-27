const ALPHA = /[a-zàâçéêèëïîôöüùûæœ0-9]+/gi;

function(o) {
  if (!o.editing) {
    var counts = {};
    for each (var s in o.speeches) {
      var words = s.text.match(ALPHA);
      if (words) for each (var w in words) {
        var word = w.toLowerCase();
        if (!counts.hasOwnProperty(word)) {
          counts[word] = 1;
        } else {
          counts[word]++;
        }
      }
    }
    for (var word in counts) {
      var count = counts[word];
      emit([o.corpus, word], count);
      emit([o._id, word], count);
    }
  }
}
