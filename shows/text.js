function(doc, req){
  log(req.id);
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
  html += '  var max_cheap = 0;';
  html += '  var max_tfidf = 0;';
  html += '  for each (d in lexdoc.rows) {';
  html += '    metrics[d.value.word] = {';
  html += '      cheapest: 1/corpus[d.value.word].in,';
  html += '      cheap: Math.sqrt(d.value.this)/corpus[d.value.word].in,';
  html += '      tfidf: d.value.this/d.value.on*Math.log(D/corpus[d.value.word].in)';
  html += '    };';
  html += '    max_tfidf = Math.max(max_tfidf,metrics[d.value.word].tfidf);';
  html += '    max_cheap = Math.max(max_cheap,metrics[d.value.word].cheap);';
  html += '  }';
  html += '  for each (m in metrics) {';
  html += '    m.tfidf /= max_tfidf;';
  html += '    m.cheap /= max_cheap;';
  html += '  }';
  html += '  console.log("max tfidf "+max_tfidf);';
  html += '  console.log("max cheap "+max_cheap);';
  html += '  console.log(JSON.stringify(metrics));';
  html += '  return metrics;';
  html += '}';
  html += 'function wordMetrics(metrics, word) {';
  html += '  var w = metrics[word.toLowerCase()];';
  html += '  if (!w) return .05;';
  switch (req.query.metrics) {
    case "tfidf":
      html += 'return w.tfidf;';
      break;
    case "cheap":
      html += 'return w.cheap;';
      break;
    case "cheapest":  
      html += 'return w.cheapest;';
    default:
      html += 'return 1;';
  } 
  html += '}';
  html += '</script><body onload="highlight();"><table><h1>';
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
