function(o){

  function sendRow(actor, text) {
    send('<tr>');
    send('<td>');
    send('<input type="text" value="');
    send(actor?actor:"");
    send('" />');
    send('</td>');
    send('<td>');
    send('<textarea type="text">');
    send(text);
    send('</textarea>');
    send('</td>');
    send('</tr>\n');
  }

  send('<html>');
  send('<head>');
  send('<link rel="icon" type="image/png" href="../style/favicon.png" />');
  send('<link rel="stylesheet" type="text/css" href="../style/main.css" />');
  send('<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />');
  send('<script src="/_utils/script/jquery.js"></script>');
  send('<script type="text/javascript">\n');

  send('function goTo(text) {\n');
  send('  self.location = "../text/" + text;');
  send('}\n');
 
  send('function save(toDoAfter) {\n');
  send('  data = {name: "Bond", _rev:"'+o['_rev']+'"};\n');
  send('  saved = false;\n');
  send('  $.ajax({\n');
  send('    type: "PUT",\n');
  send('    url: "../');
  send(o['_id']);
  send('",\n');
  send('    contentType: "application/json",\n');
  send('    data: JSON.stringify(data),\n');
  send('    error: function() {\n');
  send('      alert("Someone has probably edited the text meanwhile!");\n');
  send('    },\n');
  send('    success: function() {toDoAfter();}\n');
  send('  });\n');
  send('}\n');

  send('</script>');
  send('</head>');
  send('<body id="watermark">');
  send('<form id="menu">');
  send('<input type="button" onclick="goTo(\'\')" value="Corpus" />');
  send('</form>');
  send('<div id="container">');
  send('<div id="content">');
  send('<form>');
  send('<table>');
  for (key in o) {
    switch (key) {
      case '_id':
      case '_rev':
        send('<input id="');
        send(key);
        send('" type="hidden" value="');
        send(o[key]);
        send('" />');
        break;
      case 'speeches':
      case '_revisions':
        break;
      default:
        send('<label>');
        send(key);
        send('<input id="');
        send(key);
        send('" type="text" value="');
        send(o[key]);
        send('" />');
        send('</label>');
    }
  }
  send('</table>');
  send('<table>');
  send('<tr><th>Actor</th><th>Speech</th></tr>');
  var i = 0;
  for (i in o.speeches) {
    p = o.speeches[i];
    sendRow(p.actor, p.text);
  }
  sendRow((i>0)? o.speeches[i-1].actor : '', '');
  send('</table>');
  send('<input type="button" onclick="save(function () { goTo(\'');
  send(o['_id']);
  send('\');})" value="Save" />');
  send('</form>');
  send('</div>');
  send('<div id="footer"><a href="http://cassandre-qda.sourceforge.net/about.html">Cassandre</a> &nbsp;</div>');
  send('</div>');
  send('</body></html>');
}
