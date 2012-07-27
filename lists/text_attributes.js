function(head, req) {
  // !json templates.text_attributes
  // !code lib/mustache.js
  // !code l10n/l10n.js
  start({"headers":{"Content-Type" : "text/html;charset=utf-8"}});
  var row;
  var data = {attributes:[]};
  while (row = getRow()) {
    var attribute = row.key[1];
    switch (attribute) {
      case "draft": 
      case "name": 
        break;
      case "corpus":
        data.corpus = row.key[0];
        break;
      default:
        data.attributes.push(row.key[1]);
    }
  }
  return Mustache.to_html(local(templates.text_attributes), data);
}

