function(doc, req){
  const ALPHA = /[a-zàâçéêèëïîôöüùû]+|[^a-zàâçéêèëïîôöüùû]+/gi;
  var html = '<html>';
  html += '<script src="/_utils/script/couch.js"></script>';
  html += '<script type="text/javascript">';
  html += 'function highlight() {';
  html += '  var words = document.getElementsByTagName("font");';
  html += '  var metrics = wholeMetrics();';
  html += '  for each (w in words) {';
  html += '    var grayLevel = Math.floor(255*(1-wordMetrics(metrics, w.textContent))).toString(16);';
  html += '    w.color = "#" + grayLevel + grayLevel + grayLevel;';
  html += '  }';
  html += '}';
  html += 'function wholeMetrics() {';
  html += '  var db = new CouchDB("cassandre");';
  html += '  const D = ' + (req.info.doc_count-1) + ';';
  html += '  var corpus = {};';
  html += '  var lexcorpus = db.view("cassandre/corpus_lexicometrics",{group:"true"});';//TODO level 2 would need a filter on corpus
  html += '  for each (c in lexcorpus.rows) {';
  html += '    corpus[c.key] = c.value;';
  html += '  }';
  html += '  var lexdoc = db.view("cassandre/document_lexicometrics",{key:["' + req.id + '"]});';
  html += '  var metrics = {};';
  html += '  var max_specific1 = 0;';
  html += '  var max_specific2 = 0;';
  html += '  for each (d in lexdoc.rows) {';
  html += '    metrics[d.value.word] = {';
  html += '      rare: 1/corpus[d.value.word].this,';
  html += '      specific1: Math.sqrt(d.value.this)/corpus[d.value.word].in,';
  html += '      specific2: d.value.this/d.value.on*Math.log(D/corpus[d.value.word].in)';
  html += '    };';
  html += '    max_specific1 = Math.max(max_specific1,metrics[d.value.word].specific1);';
  html += '    max_specific2 = Math.max(max_specific2,metrics[d.value.word].specific2);';
  html += '  }';
  html += '  for each (m in metrics) {';
  html += '    m.specific1 /= max_specific1;';
  html += '    m.specific2 /= max_specific2;';
  html += '  }';
  html += '  return metrics;';
  html += '}';
  html += 'function wordMetrics(metrics, word) {';
  html += '  var w = metrics[word.toLowerCase()];';
  switch (req.query.metrics) {
    case "specific1":
      html += 'return (w)?w.specific1:.05;';
      break;
    case "specific2":
      html += 'return (w)?w.specific2:.05;';
      break;
    case "rare":  
      html += 'return (w)?w.rare:.05;';
    default:
      html += 'return 1;';
  } 
  html += '}';
  html += '</script><body onload="highlight();">';
  html += '<form>';
  html += '<input type="button" onClick="self.location=\'../../_list/corpus/corpus\'" value="Corpus" />';
  html += '<input type="button" onClick="self.location=\'?\'" value="Raw" />';
  html += '<input type="button" onClick="self.location=\'?metrics=specific1\'" value="Specific" />';
  html += '<input type="button" onClick="self.location=\'?metrics=rare\'" value="Rare" />';
  html += '</form>';
  html += '<table><h1>';
  html += doc.name;
  html += '</h1>';
  for each (p in doc.posts) {
    html += '<tr><th><div>';
    html += p.author?p.author:"";
    html += '</div><div>';
    html += p.timestamp?p.timestamp:"";
    html += '</div></th><td>';
    var words = p.text.match(ALPHA);
    for each (w in words) {
      html += '<font>';
      html += w;
      html += '</font>';
    }
    html += '</td></tr>';
  }
  html += '</table></body></html>';
  return html;
}
