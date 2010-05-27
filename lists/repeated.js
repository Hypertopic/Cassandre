function(head, req) {
  var phrase;
  send('{"rows":[\n');
  while (phrase = getRow()) {
    if (phrase.value>1) { // is repeated
        send(JSON.stringify(phrase));
        send(',\n');
    }
  }  
  send(']}');
}
