function(head, req) {
  // !json templates.kwic
  // !code lib/mustache.js
  // !code lib/string.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  const OFFSET = 35;
  const FRAME = 80;
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var parameters = req.query.startkey;
  var data = {
    i18n: localized(),
    diary: parameters[0],
    pattern: parameters[1],
    occurrences: []
  };
  while (row = getRow()) {
    var authorized = [];
    var authorized = authorized.concat(row.doc.contributors,row.doc.readers);
    if (authorized.indexOf(req.userCtx.name) > -1 || !row.doc.contributors || row.doc.contributors.length < 1 || !row.doc.readers || row.doc.readers < 1) {
      var v = row.value;
      var path = 'memo';
      switch (v.type) {
        case 'graph':
        case 'diagram':
          path = v.type;
        break;
      }
      var missing = v.begin + OFFSET - v.match;
      var context = ' '.repeat(missing>0? missing : 0) + v.context.replace(/[\n\t]/g, ' ');
      if (context.length < FRAME) context = context + new Array(FRAME - context.length + 1).join(' ');
      data.occurrences.push({
        title: v.title,
        type: v.type,
        path: path,
        corpus: row.key[0],
        id: row.id,
        context: context
      });
    }
  }
  return Mustache.to_html(templates.kwic, data, shared);
}
