function(head, req) {
  var doc;
  var corpus;
  start({"headers":{"Content-Type" : "text/html;charset=utf-8"}});
  send('<html><body><ul>');
  while (doc = getRow()) {
    if (doc.key[0]!=corpus) {
      corpus = doc.key[0];
      send("</ul><h1>");
      send(corpus);
      send("</h1><ul>");
    }
    send('<li><a href="../../_show/text/');
    send(doc.id);
    send('">');
    send(doc.key[1]);
    send('</a></li>');
  }  
  send('</ul></body></html>');
}

