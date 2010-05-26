function(head, req) {
  var phrase;
  send('{"rows":[\n');
  while (phrase = getRow()) {
    if (phrase.value>1) { // is repeated
      var i = 0; 
      var hasBigWord = false;
      while (!hasBigWord && i<phrase.key.length) {
        hasBigWord = (phrase.key[i++].length>3);
      }
      if (hasBigWord) {
        send(JSON.stringify(phrase));
        send('\n');
      }
    }
  }  
  send(']}');
}
