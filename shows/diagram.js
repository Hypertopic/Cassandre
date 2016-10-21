function(o, req){
  // !json templates.diagram
  // !code lib/mustache.js
  // !code l10n/l10n.js
  var type = o.type;
  var diary = o.diary || o.corpus;
  var data = {
    i18n: localized(),
    _id: o._id,
    _rev: o._rev,
    authorized: !o.readers || o.readers.indexOf(req.userCtx.name)>-1 || o.contributors && o.contributors.indexOf(req.userCtx.name)>-1 || req.userCtx.roles.indexOf("_admin")>-1,
    diary: diary,
    link: o.link,
    logged: req.userCtx.name,
    type: type,
    name: o.name,
    date: o.date,
    groundings: [],
  }
  for each (var g in o.groundings) {
    var grounding = {
      id: g.value
    };
    data.groundings.push(g);
  }
  if (o.contributors) {
    data.contributors = [];
    for each (var c in o.contributors) {
      data.contributors.push(c);
    }
  }
  if (o.readers) {
    data.readers = [];
    for each (var r in o.readers) {
      data.readers.push(r);
    }
  }
  return Mustache.to_html(templates.diagram, data);
}
