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
    diary: o.diary,
    body: o.body,
    comments:[],
    groundings:[]
  }
  if (o.contributors) {
    data.contributors = [];
    for each (var c in o.contributors) {
      data.contributors.push(c);
    }
  }
  for (var key in o.groundings) {
    data.groundings.push( o.groundings[key] );
  }
  for each (var c in o.comments) {
    var comment = {
      user: c.user,
      text: c.text
    };
    data.comments.push(comment);
  }
  return Mustache.to_html(templates.editable_memo, data);
}
