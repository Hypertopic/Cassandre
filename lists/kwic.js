function(head, req) {
  // !json templates.kwic
  // !code lib/mustache.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var data = {
    occurrences: []
  };
  while (row = getRow()) {
    data.occurrences.push({
      corpus: row.key[0],
      before: row.value.before,
      match: row.key[1]
    });
  }
  return Mustache.to_html(templates.kwic, data);
}
