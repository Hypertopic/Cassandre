function(head, req) {
  // !json templates.kwics
  // !code lib/mustache.js
  // !code l10n/l10n.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var data = {
    i18n: localized(),
    kwics: []
  };
  while (row = getRow()) {
    data.kwics.push({
      id: row.key,
      corpus: row.key,
      document: row.id,
      count: row.value,
      highlight: row.value.highlight,
      kwic: row.value.text
    });
  }
  return Mustache.to_html(templates.kwics, data);
}


