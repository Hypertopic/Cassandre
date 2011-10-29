function(head, req) {
  // !json templates.corpora
  // !code lib/mustache.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var data = {
    corpora: []
  };
  var corpus;
  var row;
  while (row = getRow()) {
    if (!corpus || row.key[0]!=corpus.name) {
      corpus = {
        name: row.key[0], 
        texts: []
      };
    } else {
      corpus = data.corpora.pop();
    }
    corpus.texts.push({
      name: row.key[1],
      url: row.key[0] + '/' + row.id
    });
    data.corpora.push(corpus);
  }
  return Mustache.to_html(templates.corpora, data);
}


