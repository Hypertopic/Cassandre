function(head, req) {
  // !json templates.kwic
  // !code lib/mustache.js
  // !code lib/string.js
  // !code l10n/l10n.js
  const OFFSET = 35;
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var parameters = req.query.startkey;
  var data = {
    i18n: localized(),
    corpus: parameters[0],
    pattern: parameters[1],
    occurrences: []
  };
  while (row = getRow()) {
    var v = row.value;
    var missing = v.begin + OFFSET - v.match;
    data.occurrences.push({
      title: v.title,
      corpus: row.key[0],
      id: row.id,
      context: ' '.repeat(missing>0? missing : 0)
        + v.context.replace(/[\n\t]/g, ' ')
    });
  }
  return Mustache.to_html(templates.kwic, data);
}
