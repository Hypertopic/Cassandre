function(o, req){
  // !json templates.memo
  // !json templates.deleted
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js

  const ALPHA = /[a-zàâçéêèëïîôöüùû0æœ0-9]+|[^a-zàâçéêèëïîôöüùûæœ0-9]+/gi;
  const SPACES = /^ +$/;

  var username = req.userCtx.name;
  var type = o.type || 'transcript';
  var editing = o.editing || false;
  var diary = o.diary || o.corpus;
  var contributors = o.contributors || [];
  var readers = o.readers || [];
  var data = {
    i18n: localized(),
    _id: o._id,
    _rev: o._rev,
    authorized: !o.readers || !o.contributors || o.readers.length==0 
             || o.contributors.length==0 || o.readers.indexOf(username)>-1 
             || (o.contributors && o.contributors.indexOf(username)>-1) || req.userCtx.roles.indexOf("_admin")>-1,
    body: [],
    creator: [o.history[0].user],
    contributors: contributors,
    contributors_fullnames: contributors.map((i) => ({id: i, fullname: i})),
    comments: [],
    date: o.date || o.history[0].date,
    diary: diary,
    editable: !o.contributors || o.contributors && o.contributors.indexOf(username)>-1
           || (o.history[0].user == username && o.contributors.length == 0 && (o.readers && o.readers.length == 0))
           || req.userCtx.roles.indexOf("_admin")>-1,
    rights: !o.contributors || o.contributors && o.contributors.indexOf(username)>-1
           || (o.history[0].user == username && o.contributors.length == 0 && (o.readers && o.readers.length == 0))
           || (o.readers && o.readers.indexOf(username)>-1)
           || req.userCtx.roles.indexOf("_admin")>-1,
    editing: editing,
    groundings: o.groundings,
    peer: req.peer,
    locale: req.headers["Accept-Language"].split(',')[0].substring(0,2),
    leaves: [],
    logged: username,
//    logged_fullname: false,
    name: o.name.replace(/\s/g, ' '),
    public: (!o.readers || o.readers.length==0 || !o.contributors || o.contributors.length==0),
    readers: readers,
    readers_fullnames: readers.map((i) => ({id: i, fullname: i})),
    roles: req.userCtx.roles,
    type: type,
    update_seq: req.info.update_seq
  }
  if (data.peer == '127.0.0.1' && req.headers['X-Forwarded-For'] ) {
    var ips = req.headers['X-Forwarded-For'].split(',');
    for (var ip of ips) {
      if (ip.trim() != '127.0.0.1') data.peer = ip.trim();
    }
  }
  if (typeof o.body !== 'undefined') {
    var body = o.body.replace(/\n\t/g, "\n ").replace(/\n {4,}/g, "\n").replace(/\n\n/g, "\n \n");
    if (o.type == 'interview') {
      var content = {
        words: []
      };
      if (body.length > 0) for (var w of body.match(ALPHA)) {
        if (w.match(SPACES) && content.words.length>0) {
          w = content.words.pop() + w;
        }
        content.words.push(w);
      }
    } else {
      var content = {
        text: body
      };
    }
    data.body.push(content);
  } else {
    if (o.speeches) for (var s of o.speeches) {
      var content = {
        actor: s.actor,
        timestamp: s.timestamp,
        words: []
      };
      for (var w of s.text.match(ALPHA)) {
        if (w.match(SPACES) && content.words.length>0) {
          w = content.words.pop() + w;
        }
        content.words.push(w);
      }
      data.body.push(content);
    }
  }
  data.groundable = data.editable;
  if (data._id) {
//    if (data.editing && data.editing.user) data.editing.user_fullname = data.editing.user;
//    if (fullnames[data.editing.user]) data.editing.user_fullname = fullnames[data.editing.user];
//    data.groundings = dSort(data.groundings, data.locale);
    return Mustache.to_html(templates.memo, data, shared);
  } else {
    return Mustache.to_html(templates.deleted, {i18n: localized()}, shared);
  }
}
