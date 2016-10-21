function(head, req) {
  // !json templates.diaries
  // !code lib/mustache.js
  // !code l10n/l10n.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var ledger = [[[]]];
  var data = {
    i18n: localized(),
    logged: req.userCtx.name,
    diaries: []
  };
  while (row = getRow()) {
    var index = row.key[1];
    if (row.key[0] === 'name') {
        ledger[index] = row.key[2];
    } else {
      data.diaries.push({
        id: row.key[1],
        name: ledger[index],
        count: row.value
      });
    }
  }
  return Mustache.to_html(templates.diaries, data);
}
