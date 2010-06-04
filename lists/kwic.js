function(head, req) {
  var doc;
  var pole;
  start({"headers":{"Content-Type" : "text/html;charset=utf-8"}});
  send('<html><body><ul>');
  while (doc = getRow()) {
    if (doc.value.word) {
      if (doc.value.word!=pole) {
	pole = doc.value.word;
	send("</ul><h1>");
	send(pole);
	send("</h1><ul>");
      }
      send('<li><a href="../../_show/text/');
      send(doc.id);
      send('#');
      send(doc.value.begin);
      send('-');
      send(doc.value.end);
      send('"><pre>');
      send(doc.value.before);
      send(doc.key[1]);
      send('</pre></a></li>');
    }
  }  
  send('</ul></body></html>');
}
