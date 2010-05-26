function(head, req) {
  var phrase;
  send('{"rows":[\n');
  while (phrase = getRow()) {
    if (phrase.value>1) { // is repeated
      send('{"key":["');
      send(phrase.key[0]);
      send('","');
      send(phrase.key[1]);
      send('","');
      send(phrase.key[2]);
      send('"],"value":');
      send(phrase.value);
      send('},\n');
    }
  }  
  send(']}');
}
