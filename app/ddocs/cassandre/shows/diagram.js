function(o, req){
  // !json templates.diagram
  // !json templates.deleted
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js

  const ALPHA = /[a-zàâçéêèëïîôöüùû0æœ0-9]+|[^a-zàâçéêèëïîôöüùûæœ0-9]+/gi;
  const SPACES = /^ +$/;

  if (!o) return Mustache.to_html(templates.deleted, {i18n: localized()}, shared);
  var contributors = o.contributors || [],
      diary = o.diary || o.corpus,
      first = o.first || 'default',
      i18n = localized(),
      readers = o.readers || [],
      type = o.type || 'transcript',
      username = req.userCtx.name,
      data = {
    i18n: i18n,
    _id: o._id,
    _rev: o._rev,
    authorized: !o.readers || o.readers.length==0 || o.readers.indexOf(username)>-1 || o.contributors && o.contributors.indexOf(username)>-1 || req.userCtx.roles.indexOf("_admin")>-1,
    body: [],
    contributors: contributors,
    contributors_fullnames: contributors.map((i) => ({id: i, fullname: i})),
    creator: o.history[0].user,
    comments: [],
    date: o.date || o.history[0].date,
    diary: diary,
    editable: !o.contributors || o.contributors && o.contributors.indexOf(username)>-1 || req.userCtx.roles.indexOf("_admin")>-1,
    first: first,
    rights: !o.contributors || o.contributors && o.contributors.indexOf(username)>-1
           || (o.history[0].user == username && o.contributors.length == 0 && (o.readers && o.readers.length == 0))
           || (o.readers && o.readers.indexOf(username)>-1)
           || req.userCtx.roles.indexOf("_admin")>-1,
    groundings: o.groundings,
    peer: req.peer,
    locale: req.headers["Accept-Language"].split(',')[0].substring(0,2),
    leaves: [],
    logged: username,
    logged_fullname: username,
    name: o.name.replace(/\s/g, ' '),
    public: (!o.readers || o.readers.length==0 || !o.contributors || o.contributors.length==0),
    readers: readers,
    readers_fullnames: readers.map((i) => ({id: i, fullname: i})),
    roles: req.userCtx.roles,
    type: type,
    update_seq: req.info.update_seq
  }
  if (data.readers.length==1 && data.readers[0] == username) data.one_step_from_public = true
  if (data.peer == '127.0.0.1' && req.headers['X-Forwarded-For'] ) {
    var ips = req.headers['X-Forwarded-For'].split(',');
    for (var ip of ips) {
      if (ip.trim() != '127.0.0.1') data.peer = ip.trim();
    }
  }
  if (o.link) {
    data.link = o.link;
    if (o.negative) data.negative = o.negative;
    if (o.situation) data.situation = o.situation;
    if (o.statement) {
      data.statement = o.statement;
      data.leaves.push({
        href: '../statements/'+diary,
        id: diary,
        name: i18n["i_name"]["statement"],
        type: 'storyline'
      });
    }
  }
  return Mustache.to_html(templates.diagram, data, shared);
}


