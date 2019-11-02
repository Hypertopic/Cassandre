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
    _id: req.query.startkey[0],
    list: true,
    locale: req.headers["Accept-Language"].substring(0,2),
    memos: [],
    peer: req.peer,
    update_seq: req.info.update_seq
  };
  while (row = getRow()) {
    switch (row.key[1]) {
      case 'D':
        data.diary_name = row.value.diary_name;
      break;
      case '0':
        data.by = row.value.by;
        if (row.value.activity) data.activity = row.value.activity;
        if (row.value.fullname) data.logged_fullname = row.value.fullname;
      break;
      case 'M':
        if ([null, req.userCtx.name].indexOf(row.key[2]) > -1 && memos.map(function(a){return a.id}).indexOf(row.key[3]) < 0) {
          memos.push({
            'id': row.key[3],
            'date': row.key[4]
          });
        }
      break;
    }
  }
  for (var i in memos) {
    var j = data.activity.map(function(a){return a.doc}).indexOf(memos[i].id);
    if (data.activity.length > -1 && j > -1) {
      if (memos[i].date < data.activity[j].date) read++;
    }
  }
  if (data.activity.length > -1) data.activity = JSON.stringify(data.activity);
  data.unreads = memos.length - read;
  if (data.unreads < 1) delete data.unreads;
  data.size = memos.length;
  return Mustache.to_html(templates.diary, data, shared);
}
