function(o) {
  const WORD_CUTTER = /[\s\.;:\-,\!\?\)\(\]\[\{\}\'\`\‘\’\"\″\“\”\«\»\\\/]/gi;
  const KWIC_OFFSET = 35;
  const KWIC_FRAME = 80
  const COORDINATES_HEADER_OFFSET = 1;
  const COORDINATES_ROW_OFFSET = 1;

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
    return preblank + aString.substring(begin, end) + postblank;
  }

  if (o.highlights) { //corpus 
    for (h in o.highlights) {
      var highlight = o.highlights[h];
      emit([o._id, highlight.text], {
        highlight: h,
        viewpoint: highlight.viewpoint,
        topic: highlight.topic
      });
    }
  } else { //text
    var postStart = o.name.length + COORDINATES_HEADER_OFFSET;
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
          const WORD_POSITION = charIndex - word.length;
          const KWIC_START = WORD_POSITION - KWIC_OFFSET;
          emit ([
            o.corpus, 
            extract(p.text, WORD_POSITION, KWIC_START + KWIC_FRAME)
          ], {
            before: extract(p.text, KWIC_START, KWIC_START + KWIC_OFFSET),
            begin: postStart,
            end: postEnd,
            actor: p.actor
          });
          word = "";
        }
        charIndex++;
      }
      postStart = postEnd + COORDINATES_ROW_OFFSET;  
    }
  }
}
