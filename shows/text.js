function(doc, req){
  const ALPHA = /[a-zàâçéêèëïîôöüùû0-9]+|[^a-zàâçéêèëïîôöüùû0-9]+/gi;
  send('<html>');
  send('<script src="/_utils/script/couch.js"></script>');
  send('<script type="text/javascript">');
  send('function highlight(type) {');
  send('  var words = document.getElementsByTagName("font");');
  send('  var metrics = wholeMetrics(type);');
  send('  for each (w in words) {');
  send('    var grayLevel = Math.floor(255*(1-wordMetrics(metrics, w.textContent, type))).toString(16);');
  send('    w.color = "#" + grayLevel + grayLevel + grayLevel;');
  send('  }');
  send('}');
  send('function wholeMetrics(type) {');
  send('  var db = new CouchDB("cassandre");');
  send('  const D = ' + (req.info.doc_count-1) + ';');
  send('  var corpus = {};');
  send('  var lexcorpus = db.view("cassandre/corpus_lexicometrics",{group:"true"});');//TODO level 2 would need a filter on corpus
  send('  for each (c in lexcorpus.rows) {');
  send('    corpus[c.key] = c.value;');
  send('  }');
  send('  var lexdoc = db.view("cassandre/document_lexicometrics",{key:["' + req.id + '"]});');
  send('  var metrics = {};');
  send('  var max_specific1 = 0;');
  send('  var max_specific2 = 0;');
  send('  for each (d in lexdoc.rows) {');
  send('    metrics[d.value.word] = {');
  send('      rare: 1/corpus[d.value.word].sum,');
  send('      specific1: Math.sqrt(d.value.this)/corpus[d.value.word].count,');
  send('      specific2: d.value.this/d.value.on*Math.log(D/corpus[d.value.word].count)');
  send('    };');
  send('    max_specific1 = Math.max(max_specific1,metrics[d.value.word].specific1);');
  send('    max_specific2 = Math.max(max_specific2,metrics[d.value.word].specific2);');
  send('  }');
  send('  for each (m in metrics) {');
  send('    m.specific1 /= max_specific1;');
  send('    m.specific2 /= max_specific2;');
  send('  }');
  send('  return metrics;');
  send('}');
  send('function wordMetrics(metrics, word, type) {');
  send('  var w = metrics[word.toLowerCase()];');
  send('  switch (type) {');
  send('    case "specific1":');
  send('      return (w)?w.specific1:.05;');
  send('    case "specific2":');
  send('      return (w)?w.specific2:.05;');
  send('    case "rare":'); 
  send('      return (w)?w.rare:.05;');
  send('  }'); 
  send('}');
  send('</script><body>');
  send('<form>');
  send('<input type="button" onClick="self.location=\'../../_list/corpus/corpus\'" value="Corpus" />');
  send('<input type="button" onClick="self.location.reload(true)" value="Raw" />');
  send('<input type="button" onClick="highlight(\'specific1\')" value="Specific" />');
  send('<input type="button" onClick="highlight(\'rare\')" value="Rare" />');
  send('</form>');
  send('<table><h1>');
  send(doc.name);
  send('</h1>');
  for each (p in doc.posts) {
    send('<tr><th><div>');
    send(p.author?p.author:"");
    send('</div><div>');
    send(p.timestamp?p.timestamp:"");
    send('</div></th><td>');
    var words = p.text.match(ALPHA);
    for each (w in words) {
      send('<font>');
      send(w);
      send('</font>');
    }
    send('</td></tr>');
  }
  send('</table></body></html>');
}
