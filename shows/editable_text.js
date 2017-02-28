function(o, req){
  // !json templates.editable_text
  // !code lib/mustache.js
  // !code l10n/l10n.js
  var username = req.userCtx.name;
  var data = {
    authorized: !o.readers || o.readers.indexOf(username)>-1 || o.contributors && o.contributors.indexOf(username)>-1 || req.userCtx.roles.indexOf("_admin")>-1,
    i18n: localized(),
    highlights: "{}",
    attributes:[],
    logged: username,
    logged_fullname: username,
    logs:[],
    speeches: [{}],
    groundings:[]
  }
  for (var key in o) {
    switch (key) {
      case '_id':
      case '_rev':
      case 'history':
      case 'contributors':
      case 'comments':
      case 'corpus':
      case 'diary':
      case 'user':
      case 'date':
      case 'readers':
      case 'speeches':
        data[key] = o[key];
        break;
      case 'highlights':
        data.highlights = toJSON(o[key]);
        break;
      case 'groundings':
        data.groundings = o.groundings ;
        break;
      case 'draft':
      case '_revisions':
        break;
      default:
        data.attributes.push({
          "key": key,
          value: o[key]
        });
    }
  }
  return Mustache.to_html(templates.editable_text, data);
}
