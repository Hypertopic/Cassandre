function(head, req) {
  // !json templates.patterns
  // !code lib/mustache.js
  // !code l10n/l10n.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var data = {
    i18n: localized(),
    corpus: req.query.corpus,
    patterns: []
  };
  while (row = getRow()) {
    data.patterns.push({
      document: row.id,
      highlight: row.value.highlight,
      kwic: row.value.text
    });
  }
  return Mustache.to_html(templates.patterns, data);
}


