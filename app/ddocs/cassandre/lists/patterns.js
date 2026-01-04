function(head, req) {
  // !json templates.patterns
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}})
  var data = {
    i18n: localized(),
    diary: req.query.key,
    patterns: []
  }
  while (row = getRow()) {
    data.patterns.push({
      document: row.id,
      highlight: row.value.highlight,
      kwic: row.value.text
    })
  }
  provides("html", function() {
    return Mustache.to_html(templates.patterns, data, shared)
  })
  provides("json", function() {
    send(toJSON(
      {pending: data.patterns.length}
    ))
  })
}
