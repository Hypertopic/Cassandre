function(head, req) {
  var phrase;
  if (req.headers.Accept.indexOf("application/json",0) > -1) {
    start({"headers":{"Content-Type" : "application/json;charset=utf-8"}});
  } else {
    start({"headers":{"Content-Type" : "text/plain;charset=utf-8"}});
  }
  send('{"rows":[\n');
  while (phrase = getRow()) {
    if (phrase.value>1) { // is repeated
        send(JSON.stringify(phrase));
        send(',\n');
    }
  }  
  send(']}');
}
