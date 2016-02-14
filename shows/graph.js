function(o, req){
  // !json templates.graph
  // !code lib/mustache.js
  // !code l10n/l10n.js
  var data = {
    i18n: localized(),
    _id: o._id,
    _rev: o._rev,
    diary: o.diary,
    link: o.link,
    type: o.type,
    name: o.name,
    date: o.date,
    user: o.user,
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
  for each (var e in o.edges) {
    var edge = {
      from: e.from,
      to: e.to,
      color: e.color,
    };
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
