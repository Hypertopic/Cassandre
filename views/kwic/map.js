function(o) {
  const WORD_CUTTER = /[\s\.;:\-,\!\?\)\(\]\[\{\}\'\`\‘\’\"\″\“\”\«\»\\\/]/gi;
  const KWIC_OFFSET = 35;
  const KWIC_FRAME = 80
  const COORDINATES_HEADER_OFFSET = 1;
  const COORDINATES_ROW_OFFSET = 1;

  function emitPattern(word, charIndex, postContent, postStart, postEnd, postActor) {
    const WORD_POSITION = charIndex - word.length;
    const KWIC_START = WORD_POSITION - KWIC_OFFSET;
    const PATTERN = extract(postContent, WORD_POSITION, KWIC_START + KWIC_FRAME);
    const VALUE = {
      before: extract(postContent, KWIC_START, KWIC_START + KWIC_OFFSET),
      begin: postStart,
      match: postStart+WORD_POSITION,
      end: postEnd,
      actor: postActor
    };
    emit([o.corpus, PATTERN], VALUE);
    emit([o._id, PATTERN], VALUE);
  }

  function extract(aString, begin, end) {
    var preblank = "";
    if (begin < 0) {
      for (var i=0; i>begin; i--) {
        preblank += '_';
      }
      begin = 0;
    }
    var postblank = "";
    if (end > aString.length) {
      const SUPPL = end - aString.length; 
      for (var i=0; i<SUPPL; i++) {
        postblank += '_';
      }
      end = aString.length;
    }
    return preblank + aString.substring(begin, end).replace(/[\n\s]/g," ") + postblank;
  }

  var postStart = (o.name? o.name.length : 0) + COORDINATES_HEADER_OFFSET;
if (!o.draft) {
  for each (p in o.speeches) {
    var postEnd = postStart 
      + (p.actor? p.actor.length : 0) 
      + (p.timestamp? p.timestamp.length : 0) 
      + p.text.length;
    var charIndex = 0;
    var word = "";
    for each (character in p.text) {
      if (!character.match(WORD_CUTTER)) {
        word += character;
      } else if (word.length>0) {
        emitPattern(word, charIndex, p.text, postStart, postEnd, p.actor);
        word = "";
      }
      charIndex++;
    }
    if (word == p.text) {
      emitPattern(word, charIndex, p.text, postStart, postEnd, p.actor);
    }
    postStart = postEnd + COORDINATES_ROW_OFFSET;  
  }
}
}
