function(o, req){
  // !json templates.graph
  // !code lib/mustache.js
  // !code l10n/l10n.js
  var data = {
    i18n: localized(),
    _id: o._id,
    _rev: o._rev,
    authorized: !o.readers || o.readers.indexOf(req.userCtx.name)>-1 || o.contributors && o.contributors.indexOf(req.userCtx.name)>-1 || req.userCtx.roles.indexOf("_admin")>-1,
    diary: o.diary,
    link: o.link,
    logged: req.userCtx.name,
    type: o.type,
    name: o.name,
    date: o.date,
    groundings: [],
    edges: [],
    nodes: [],
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
  for each (var e in o.edges) {
    var edge = {
      from: e.from,
      to: e.to
    };
    if (!e.dashes) {
      edge.color = e.color;
    } else {
      edge.label = e.label;
      edge.dashes = true;
    }
    data.edges.push(e);
  }
  for each (var n in o.nodes) {
    var node = {
      id: n.id,
      shape: n.shape,
    };
    data.nodes.push(n);
  }
  return Mustache.to_html(templates.graph, data);
}
