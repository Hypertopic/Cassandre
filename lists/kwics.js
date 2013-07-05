function(head, req) {
  // !json templates.kwics
  // !code lib/mustache.js
  // !code l10n/l10n.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var data = {
    kwics: []
  };
  while (row = getRow()) {
    data.kwics.push({
      id: row.key,
      corpus: row.key,
      count: row.value,
      kwic: row.value.text
    });
  }
  return Mustache.to_html(local(templates.kwics), data);
}


