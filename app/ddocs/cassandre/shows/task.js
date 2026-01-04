function(o, req){
  // !json templates.task
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js

  let username = req.userCtx.name,
      editing = o.editing || false,
      diary = o.diary || o.corpus,
      contributors = o.contributors || [],
      readers = o.readers || [],
      task_id = req.query.task,
      data = {
    i18n: localized(),
    _id: o._id,
    authorized: !o.readers || !o.contributors || o.readers.length==0 
             || o.contributors.length==0 || o.readers.indexOf(username)>-1 
             || (o.contributors && o.contributors.indexOf(username)>-1) || req.userCtx.roles.indexOf("_admin")>-1,
    contributors: contributors,
    contributors_fullnames: contributors.map((i) => ({id: i, fullname: i})),
    diary: diary,
    editable: !o.contributors || o.contributors && o.contributors.indexOf(username)>-1
           || req.userCtx.roles.indexOf("_admin")>-1,
    locale: req.headers["Accept-Language"].split(',')[0].substring(0,2),
    logged: username,
    public: (!o.readers || o.readers.length==0 || !o.contributors || o.contributors.length==0),
    rights: !o.contributors || o.contributors && o.contributors.indexOf(username)>-1
           || (o.readers && o.readers.indexOf(username)>-1)
           || req.userCtx.roles.indexOf("_admin")>-1,
    type: 'task',
    readers: readers,
    readers_fullnames: readers.map((i) => ({id: i, fullname: i})),
  }
  if (data.readers.length==1 && data.readers[0] == username) data.one_step_from_public = true
  if (o.deadlines && req.query.task.length > 0) {
    let selected_task = o.deadlines.find(t => t.id === req.query.task)
    data.task = selected_task
  }
  return Mustache.to_html(templates.task, data, shared)
}
