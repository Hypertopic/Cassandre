function(head, req) {
  // !json templates.corpora
  // !code lib/mustache.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var data = {
    corpora: []
  };
  while (row = getRow()) {
    data.corpora.push({
      id: row.key,
      count: row.value
    });
  }
  return Mustache.to_html(templates.corpora, data);
}


