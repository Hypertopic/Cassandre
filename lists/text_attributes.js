function(head, req) {
  var doc;
  var corpus;
  start({"headers":{"Content-Type" : "text/html;charset=utf-8"}});
  var datafield = "var data = {";
  var forminputs = '<form><fieldset><legend>Attributes</legend><table>';
  while (doc = getRow()) {
    attribute = doc.key[1];
    forminputs +='<tr><th><label>';
    if (attribute == "name"){
      forminputs += 'title';
      } else {
      forminputs += attribute;
      }
    forminputs +='</label></th><td><input id="';
    forminputs += attribute;
    if (attribute == "corpus"){
      forminputs += '" type="text" value="';
      forminputs += doc.key[0];
      forminputs += '" />';
      } else {
      forminputs += '" type="text" />';
      datafield += attribute;
      datafield += ':$("#';
      datafield += attribute;
      datafield += '").val(), ';
      }
    forminputs += '</td></tr>\n';
  }
  datafield += 'corpus:$("#corpus").val()     };';

  send('<html>');
  send('<head>');
  send('<link rel="icon" type="image/png" href="../style/favicon.png" />');
  send('<link rel="stylesheet" type="text/css" href="../style/main.css" />');
  send('<script src="../script/jquery.js"></script>');
  send('<script type="text/javascript">');
  send('   function upLoad() {\n');

  send(datafield);

  send('\n     $.ajax({');
  send('        url: "http://127.0.0.1:5984/cassandre/",');
  send('        type: "POST",');
  send('        dataType: "json",');
  send('        contentType: "application/json",');
  send('        data: JSON.stringify(data),');
  send('        success: function(data) {location.replace("../editable_text/"+ data.id)}   ');
  send('     });\n');
  send('   }\n');
  send('</script>');
  send('</head>\n');
  send('<body id="watermark">');
  send('<div id="container">');
  send('<div id="content">');
  send('<h1>New text </h1>');

  send(forminputs);

  send('<tr><th></th><td><button type="button" onclick="upLoad()">Set attributes</button></td></table>\n');
  send('</fieldset></form></div>');
  send('<div id="footer"><a href="http://cassandre-qda.sourceforge.net/about.html">Cassandre</a> &nbsp;</div>');
  send('</div>');
  send('</body></html>');
}

