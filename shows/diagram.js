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
    diary: diary,
    link: o.link,
    type: type,
    name: o.name,
    date: o.date,
    user: o.user,
    groundings: [],
  }
  for each (var g in o.groundings) {
    var grounding = {
      id: g.value
    };
    data.groundings.push(g);
  }
  return Mustache.to_html(templates.diagram, data);
}
