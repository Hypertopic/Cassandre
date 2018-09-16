function(head, req) {
  // !json templates.diaries
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var ledger = [[[]]];
  var diaries = [[[]]];
  var data = {
    i18n: localized(),
    logged: req.userCtx.name,
    diaries: [],
    flat: true,
    peer: req.peer
  };
  while (row = getRow()) {
    var index = row.key[0];
    if (row.key[3].length > 0) {
      ledger[index] = row.key[3];
    } else if (row.key[2] === req.userCtx.name || row.key[2] == null) {
      if (diaries[index] === undefined) diaries[index] = [];
      if (diaries[index].indexOf(row.key[1]) < 0) {
        diaries[index].push(row.key[1]);
      }
    }
  }

  for (i in diaries) {
    if (i !== "0") data.diaries.push({
      id: i,
      name: ledger[i],
      count: diaries[i].length
    });
  }
  return Mustache.to_html(templates.diaries, data, shared);
}
