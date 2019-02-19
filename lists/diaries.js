function(head, req) {
  // !json templates.diaries
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var diaries = [[[]]];
  var data = {
    i18n: localized(),
    locale: req.headers["Accept-Language"],
    logged: req.userCtx.name,
    diaries: [],
    flat: true,
    peer: req.peer
  };
  while (row = getRow()) {
    var index = row.key[1];
    if (req.query.startkey[0] == req.userCtx.name || req.query.startkey[0] == null) {
      if (data.diaries.map(function(a){return a.id}).indexOf(index) < 0) {
        if (index != null) data.diaries.push({
          'id': index,
          'name': row.doc.diary_name
        });
      }
    }
  }

  provides("html", function() {
    return Mustache.to_html(templates.diaries, data, shared);
  });
  provides("json", function() {
    send(toJSON(data.diaries));
  });


}
