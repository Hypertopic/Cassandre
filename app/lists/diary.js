function(head, req) {
  // !json templates.diary
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var read = 0, memos = [], data = {
    activity: [],
    i18n: localized(),
    logged: req.userCtx.name,
    diary: req.query.startkey[0],
    list: true,
    locale: req.headers["Accept-Language"].substring(0,2),
    peer: req.peer,
    update_seq: req.info.update_seq
  };
  if (req.userCtx.name == null) data.by = 'update';
  while (row = getRow()) {
    switch (row.key[2]) {
      case '0':
        data.by = row.value.by;
        if (row.value.activity) data.activity = row.value.activity;
        if (row.value.fullname && row.value.fullname.length > 0) data.logged_fullname = row.value.fullname;
      break;
      case 'M':
        if (memos.map(function(a){return a.id}).indexOf(row.key[3]) < 0) {
          memos.push({
            'id': row.key[3],
            'date': row.key[4]
          });
        }
      break;
    }
  }
  if (data.activity.length > -1) data.activity = JSON.stringify(data.activity);
  data.size = memos.length;
  data.memos = JSON.stringify(memos);
  return Mustache.to_html(templates.diary, data, shared);
}
