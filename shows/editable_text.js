function(o){
  // !json templates.editable_text
  // !code lib/mustache.js
  var data = {
    attributes:[],
    speeches: []
  }
  for (var key in o) {
    switch (key) {
      case '_id':
      case '_rev':
      case 'corpus':
      case 'speeches':
        data[key] = o[key];
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
  var n = data.speeches.length;

  data.speeches.push({
    actor: (n<2)? "Erase for monologue" : data.speeches[n-2].actor,
    text: ""
  });

  return Mustache.to_html(templates.editable_text, data);
}
