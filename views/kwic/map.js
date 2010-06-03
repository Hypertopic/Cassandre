function(doc) {
  const CUTTER = /[\s\.;:\-,\!\?\)\(\]\[\{\}\'\`\’\"\″\“\”\«\»\\\/]/gi;
  const OFFSET = 35;
  const FRAME = 80

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

  for each (p in doc.posts) {
    var position = 0;
    var word = "";
    for each (character in p.text) {
      position++;
      if (!character.match(CUTTER)) {
        word += character;
      } else if (word.length>0) {
        const BEGIN = position - (word.length + OFFSET);
        emit (word, {
          text: extract(p.text, BEGIN, BEGIN + FRAME)
        });
        word = "";
      }
    }
  }
}
