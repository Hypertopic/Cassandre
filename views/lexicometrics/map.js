function(o) {
  const WORD_PART = /[a-zàâçéêèëïîôöüùû0-9]/i;
  const CRUNCHER = /[a-zàâçéêèëïîôöüùû0-9]+|[^a-zàâçéêèëïîôöüùû0-9]+/gi;

  function emitWord(corpus, doc, word) {
    emit([corpus, "countOccurrences", word]);
    emit([doc, "countOccurrences", word]);
  }

  function emitPhrase(corpus, doc, prior, previous, current) {
    emit([corpus, "countOccurrences", prior, previous, current]);
    emit([doc, "countOccurrences", prior]);
  }

  function emitEndOfSentence(corpus, doc, prior, previous, current) {
    if (current) {
      emitWord(corpus, doc, current);
      if (previous) {
        emitWord(corpus, doc, previous);
        if (prior) {
          emitPhrase(corpus, doc, prior, previous, current);
        }
      }
    }
  } 

  function emitPartOfSentence(corpus, doc, prior, previous, current) {
    if (current && previous && prior) {
      emitPhrase(corpus, doc, prior, previous, current);
    }
  }

  function isWord(string) {
    return string[0].match(WORD_PART);
  }

  if (o.draft!='ongoing') {
    var current = null;
    var previous = null;
    var prior = null;
    var words = {};
    for each (var s in o.speeches) {
      for each (var m in s.text.match(CRUNCHER)) {
        if (isWord(m)) {
          prior = previous;
          previous = current;
          current = m.toLowerCase();
          words[current] = null;
        } else {
          if (m.length>1) {
            emitEndOfSentence(o.corpus, o._id, prior, previous, current);
            prior = null;
            previous = null;
            current = null;
          } else {
            emitPartOfSentence(o.corpus, o._id, prior, previous, current);
          }
        }
      }
      emitEndOfSentence(o.corpus, o._id, prior, previous, current);
      prior = null;
      previous = null;
      current = null;
    }
    for (var w in words) {
      emit([o.corpus, "countDocuments", w]);
    }
  }
}
