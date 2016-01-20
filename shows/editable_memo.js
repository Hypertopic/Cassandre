function(o, req){
  // !json templates.editable_memo
  // !code lib/mustache.js
  // !code l10n/l10n.js
  var data = {
    i18n: localized(),
    _id: o._id,
    _rev: o._rev,
    name: o.name,
    type: o.type,
    date: o.date,
    user: o.user,
    diary: o.diary,
    body: o.body,
    groundings:[]
  }
  for (var key in o.groundings) {
    data.groundings.push( o.groundings[key] );
  }
  return Mustache.to_html(templates.editable_memo, data);
}
