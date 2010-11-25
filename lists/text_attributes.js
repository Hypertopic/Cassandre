function(head, req) {
  var doc;
  var corpus;
  start({"headers":{"Content-Type" : "text/html;charset=utf-8"}});
  send('<html>');
  send('<head>');
  send('<link rel="icon" type="image/png" href="/style/favicon.png" />');
  send('<link rel="stylesheet" type="text/css" href="/style/main.css" />');
  send('<script src="http://code.jquery.com/jquery-1.4.2.min.js"></script>\n');
  send('<script type="text/javascript">');
  send('   function upLoad() {');
  send('	var flux = [] ;');
  send('	for (var i = 0; i<intFields; i++) {');
  send('	  var author_id = "author_"+ i;');
  send('	  var speech_id = "speech_"+ i;');
  send('	  flux.push({actor : document.getElementById(author_id).value, text : document.getElementById(speech_id).value});');
  send('	}');

  send('     var data = {');
  send('	name:$("#name").val(), ');
  send('	scientist:$("#user").val(), ');
  send('	corpus:$("#corpus").val(), ');
  send('	scientist:"christophe@hypertopic.org", ');
  send('	speeches:flux');
  send('     };');

  send('     $.ajax({');
  send('        url: "http://127.0.0.1:5984/cassandre/",');
  send('        type: "POST",');
  send('        dataType: "json",');
  send('        contentType: "application/json",');
  send('        data: JSON.stringify(data),');
  send('        success: function(data) {location.replace("_rewrite/text/"+ data.id)}  // /_utils/document.html?cassandre/ ');
  send('     });');
  send('   }');
  send('</script>');
  send('</head>\n');
  send('<body id="watermark">');
  send('<div id="container">');
  send('<div id="content">');
  send('<h1>Set Attributes </h1>');
  send('<form><fieldset><legend>Context</legend>\n');
  while (doc = getRow()) {
    attribute = doc.key[1];
    send('<label>');
//    send(attribute.ucwords);
    send(attribute);
    send(' <input id="');
    send(attribute);
    if (attribute == "corpus"){
      send('" type="text" value="');
      send(doc.key[0]);
      send('" />');
    } else {
      send('" type="text" />');
    }
    send('</label><br />\n');
  }  
  send('<label><input name="statut" type="checkbox" value="confidentiel" />confidentiel </label><br />\n');
  send('<button type="button" onclick="upLoad()">Add new text</button>\n');
  send('</fieldset></form>');
  send('<div id="footer"><a href="http://cassandre-qda.sourceforge.net/about.html">Cassandre</a> &nbsp;</div>');
  send('</div></div>');
  send('</body></html>');
}

