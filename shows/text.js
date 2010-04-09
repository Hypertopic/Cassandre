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
  html += '  metrics = {};';
  html += '  var db = new CouchDB("cassandre");';
  html += '  var lexcorpus = db.view("cassandre/lexicometrics",{group_level:"1"});';//TODO level 2 would need a filter on corpus
  html += '  for each (c in lexcorpus.rows) {';
  html += '    metrics[c.key[0]] = {corpus:c.value};';
  html += '  }';
  html += '  var lexdoc = db.view("cassandre/lexicometrics",{reduce:"false"});';
  html += '  for each (d in lexdoc.rows) {';
  html += '    metrics[d.key[0]].doc = d.value;';
  html += '  }';
  html += '  return metrics;';
  html += '}';
  html += 'function wordMetrics(metrics, word) {';
  html += '  var w = metrics[word.toLowerCase()];';
  html += '  if (!w) return .05;';
  switch (req.metrics) {
    case "tfidf":
      html += 'return w.doc.this/w.doc.on*log(D/w.corpus.in);';//TODO D and normalize
      break;
    case "cheap":
      html += 'return sqrt(w.doc.this)/w.corpus.in;';//TODO normalize
      break;
    case "cheapest":  
    default:
      html += 'return 1/w.corpus.in;';
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
