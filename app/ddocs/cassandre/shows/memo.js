function(o, req){
  // !json templates.memo
  // !json templates.deleted
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js

  const ALPHA = /[a-zàâçéêèëïîôöüùû0æœ0-9]+|[^a-zàâçéêèëïîôöüùûæœ0-9]+/gi
  const SPACES = /^ +$/
  if (!o) return Mustache.to_html(templates.deleted, {i18n: localized()}, shared)
  if (o.diary_name && !o.name) {
    return {
      "code": 302, 
      "headers":{ "Location": "../../diary/" + o._id }
    }
  }
  var username = req.userCtx.name,
      type = o.type || 'transcript',
      editing = o.editing || false,
      diary = o.diary || o.corpus,
      contributors = o.contributors || [],
      readers = o.readers || [],
      creator = o.user || o.history[0].user,
      data = {
    i18n: localized(),
    _id: o._id,
    _rev: o._rev,
    authorized: !o.readers || !o.contributors || o.readers.length==0 
             || o.contributors.length==0 || o.readers.indexOf(username)>-1 
             || (o.contributors && o.contributors.indexOf(username)>-1) || req.userCtx.roles.indexOf("_admin")>-1,
    body: [],
    creator: creator,
    contributors: contributors,
    contributors_fullnames: contributors.map((i) => ({id: i, fullname: i})),
    comments: [],
    date: o.date || o.history[0].date,
    diary: diary,
    editable: !o.contributors || o.contributors && o.contributors.indexOf(username)>-1
           || (creator == username && o.contributors.length == 0 && (o.readers && o.readers.length == 0))
           || req.userCtx.roles.indexOf("_admin")>-1,
    rights: !o.contributors || o.contributors && o.contributors.indexOf(username)>-1
           || (creator == username && o.contributors.length == 0 && (o.readers && o.readers.length == 0))
           || (o.readers && o.readers.indexOf(username)>-1)
           || req.userCtx.roles.indexOf("_admin")>-1,
    editing: editing,
    peer: req.peer,
    locale: req.headers["Accept-Language"].split(',')[0].substring(0,2),
    leaves: [],
    logged: username,
    name: o.name.replace(/\s/g, ' '),
    public: (!o.readers || o.readers.length==0 || !o.contributors || o.contributors.length==0),
    readers: readers,
    readers_fullnames: readers.map((i) => ({id: i, fullname: i})),
    roles: req.userCtx.roles,
    type: type,
    update_seq: req.info.update_seq
  }
  if (data.readers.length==1 && data.readers[0] == username) data.one_step_from_public = true
  if (o.initial) {
    data.initial = o.initial
  } else {
    data.groundings = o.groundings
  }
  if (data.peer == '127.0.0.1' && req.headers['X-Forwarded-For'] ) {
    var ips = req.headers['X-Forwarded-For'].split(',')
    for (var ip of ips) {
      if (ip.trim() != '127.0.0.1') data.peer = ip.trim()
    }
  }
  if (typeof o.body !== 'undefined') {
    var body = o.body.replace(/\n\t/g, "\n ").replace(/\n {4,}/g, "\n").replace(/\n\n/g, "\n \n")
    if (o.type == 'interview') {
      var content = {
        words: []
      }
      if (body.length > 0) for (var w of body.match(ALPHA)) {
        if (w.match(SPACES) && content.words.length>0) {
          w = content.words.pop() + w
        }
        content.words.push(w)
      }
    } else {
      var content = {
        text: body
      }
    }
    data.body.push(content)
  } else {
    if (o.speeches) for (var s of o.speeches) {
      var content = {
        actor: s.actor,
        timestamp: s.timestamp,
        words: []
      }
      for (var w of s.text.match(ALPHA)) {
        if (w.match(SPACES) && content.words.length>0) {
          w = content.words.pop() + w
        }
        content.words.push(w)
      }
      data.body.push(content)
    }
  }
  data.groundable = data.editable
  return Mustache.to_html(templates.memo, data, shared)
}
