function(head, req) {
  var doc;
  var pole;
  start({"headers":{"Content-Type" : "text/html;charset=utf-8"}});
  send('<html><body><ul>');
  while (doc = getRow()) {
    if (doc.key[0]!=pole) {
      pole = doc.key[0];
      send("</ul><h1>");
      send(pole);
      send("</h1><ul>");
    }
    send('<li><a href="../../_show/text/');
    send(doc.id);
    send('"><pre>');
    send(doc.key[1]);
    send('</pre></a></li>');
  }  
  send('</ul></body></html>');
}
