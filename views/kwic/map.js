function(doc) {
  const CUTTER = /[\s\.;:\-,\!\?\)\(\]\[\{\}\'\`\’\"\″\“\”\«\»\\\/]/gi;
  const OFFSET = 35;
  const FRAME = 80
  for each (p in doc.posts){
    var position = 0;
    var word = "";
    for each (character in p.text){
      position++;
      if (!character.match(CUTTER)) {
        word += character;
      } else if (word.length>0) {
        var begin = position - (word.length + OFFSET);
	var end = begin + FRAME;
        var preblank = "";
        if (begin < 0) {
          for (var i=0; i>begin; i--) {
            preblank += '_';
          }
          begin = 0;
        }
        var postblank = "";
        if (end > p.text.length) {
          const suppl = end - p.text.length; 
          for (var i=0;i<suppl;i++) {
            postblank += '_';
          }
	  end = p.text.length;
        }
        emit (word, preblank + p.text.substring(begin, end) + postblank);
        word = "";
      }
    }
  }
}
