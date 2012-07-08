function(head, req) {
  // !json templates.corpus
  // !code lib/mustache.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var data = {
    by: req.query.by,
    corpus: req.query.corpus,
    sections: []
  };
  var section;
  var row;
  var allTogether = ("name"==req.query.by);
  if (allTogether) {
    data.sections.push({
      texts: []
    });
  }
  while (row = getRow()) {
      if (!allTogether && (!section || row.key[2]!=section.value)) {
        section = {
          value: row.key[2], 
          texts: []
        };
      } else {
        section = data.sections.pop();
      }
      section.texts.push({
        name: row.value.item.name,
        url: row.value.item.id,
        rev: row.value.item.rev
      });
      data.sections.push(section);
  }
  return Mustache.to_html(templates.corpus, data);
}
