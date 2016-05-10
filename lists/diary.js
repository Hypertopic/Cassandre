function(head, req) {
  // !json templates.diary
  // !code lib/mustache.js
  // !code l10n/l10n.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var data = {
    i18n: localized(),
    by: req.query.by,
    diary: req.query.diary,
    memos: []
  };
  while (row = getRow()) {
    data.memos.push({
      diary: row.key,
      id: row.value.id,
      name: row.value.name,
      date: row.value.date,
      groundings: row.value.groundings,
      type: row.value.type
    });
  }
  return Mustache.to_html(templates.diary, data);
}
