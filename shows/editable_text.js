function(o){

  function sendRow(actor, text) {
    send('<tr class="turn">');
    send('<td>');
    send('<input type="text" value="');
    send(actor?actor:"");
    send('" />');
    send('</td>');
    send('<td>');
    send('<textarea cols="80" rows="3" type="text">');
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
  send('<script src="../script/jquery.js"></script>');
  send('<script type="text/javascript">\n');

  send('function goTo(text) {\n');
  send('  self.location = "../text/" + text;');
  send('}\n');
 
  send('function save(toDoAfter) {\n');
  send('  var data = {};\n');
  send('  $("#attributes").children("input").each(function() {\n')
  send('    data[$(this).attr("id")] = $(this).val();\n');
  send('  })\n');
  send('  data.speeches = [];\n');
  send('  $(".turn").each(function() {\n')
  send('    data.speeches.push({\n');
  send('      actor:$(this).children().children("input").val(),\n');
  send('      text:$(this).children().children("textarea").val()\n');
  send('    })\n');
  send('  })\n');
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
  send('<fieldset id="attributes">');
  for (key in o) {
    switch (key) {
      case '_id':
      case '_rev':
      case 'corpus':
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
        send('<label for="');
        send(key);
        send('">');
        send(key);
        send('</label>');
        send('<input id="');
        send(key);
        send('" type="text" value="');
        send(o[key]);
        send('" />');
    }
  }
  send('</fieldset>');
  send('<table>');
  send('<tr><th>Actor</th><th>Speech</th></tr>');
  var i = 0;
  for (i in o.speeches) {
    p = o.speeches[i];
    sendRow(p.actor, p.text);
  }
  sendRow((i>0)? o.speeches[i-1].actor : '', '');
  send('</table>');
  send('<input type="button" onclick="save(function(){location.reload();})" ');
  send('value="Add row" />');
  send('<input type="button" onclick="save(function () { goTo(\'');
  send(o['corpus']);
  send('/');
  send(o['_id']);
  send('\');})" value="Save" />');
  send('</form>');
  send('</div>');
  send('<div id="footer"><a href="http://cassandre-qda.sourceforge.net/about.html">Cassandre</a> &nbsp;</div>');
  send('</div>');
  send('</body></html>');
}
