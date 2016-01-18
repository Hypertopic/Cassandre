function(head, req) {
  // !json templates.diaries
  // !code lib/mustache.js
  // !code l10n/l10n.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var data = {
    i18n: localized(),
    diaries: []
  };
  while (row = getRow()) {
    data.diaries.push({
      id: row.key,
      count: row.value
    });
  }
  return Mustache.to_html(templates.diaries, data);
}
