function(head, req) {
  // !json templates.diaries
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var ledger = [[[]]];
  var data = {
    i18n: localized(),
    logged: req.userCtx.name,
    diaries: [],
    flat: true,
    peer: req.peer
  };
  while (row = getRow()) {
    var index = row.key[1];
    if (row.key[2].length > 0) {
      ledger[index] = row.key[2];
    } else if (row.key[0] === req.userCtx.name) {
      data.diaries.push({
        id: index,
        name: ledger[index],
        count: row.value
      });
    }
  }
  return Mustache.to_html(templates.diaries, data, shared);
}
