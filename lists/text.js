function(head, req) {
  var doc;
  var corpus;
  start({"headers":{"Content-Type" : "text/html;charset=utf-8"}});
  send('<html>');
  send('<head>');
  send('<link rel="icon" type="image/png" href="../style/favicon.png" />');
  send('<link rel="stylesheet" type="text/css" href="../style/main.css" />');
  send('</head>');
  send('<body id="watermark">');
  send('<div id="container">');
  send('<div id="content">');
  send('<ul>');
  while (doc = getRow()) {
    if (doc.key[0]!=corpus) {
      corpus = doc.key[0];
      send("</ul><h1>");
      send(corpus);
      send("</h1><ul>");
    }
    send('<li><a href="');
    send(doc.id);
    send('">');
    send(doc.key[1]);
    send('</a></li>');
  }  
  send('</ul>');
  send('</div>');
  send('<div id="footer"><a href="http://cassandre-qda.sourceforge.net/about.html">Cassandre</a> &nbsp;</div>');
  send('</div>');
  send('</body></html>');
}

