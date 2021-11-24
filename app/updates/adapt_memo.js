function (doc, req) {
  var obj = JSON.parse(req.body);
  switch(obj.action) {
    case ('add_contributor'):
      if (!doc.contributors) doc.contributors = [];
      if (doc.contributors.indexOf(obj.value) == -1) doc.contributors.push(obj.value);
    break;
    case ('remove_contributor'):
      var i = doc.contributors.indexOf(obj.value);
      doc.contributors.splice(i, 1);
    break;
    case ('add_reader'):
      if (!doc.readers) doc.readers = [];
      if (doc.readers.indexOf(obj.value) == -1) doc.readers.push(obj.value);
    break;
    case ('remove_reader'):
      var i = doc.readers.indexOf(obj.value);
      doc.readers.splice(i, 1);
    break;
    case ('add_grounding'):
      if (!doc.groundings) doc.groundings = [];
      if (doc.type == 'coding' && obj.highlight) {
        var highlight = obj.highlight,
            preview = {
              'text': obj.highlight,
              'anchor': obj.anchor
            },
            grounding = {
              '_id': obj.value,
              'preview': [preview]
            };
        if (obj.anchor > 0) highlight = '['+highlight+']('+obj.value+'#'+obj.anchor+')';
        doc.body = doc.body + '\n \n>'+highlight+' \n \n';
        var i = doc.groundings.map(function(g){
          if (g._id) {return g._id} else return g;
        }).indexOf(obj.value);
        if (i > -1) {
          if (doc.groundings[i].preview) {
            doc.groundings[i].preview.push(preview);
          } else {
            doc.groundings.splice(i, 1, grounding);
          }
        } else {
          doc.groundings.push(grounding);
        }
      } else {
        if (doc.groundings.indexOf(obj.value) == -1) doc.groundings.push(obj.value);
      }
    break;
    case ('remove_grounding'):
      var arg = obj.value;
      var [id, anchor] = obj.value.split('#');
      var i = doc.groundings.map(function(g){
        if (g._id) {return g._id} else return g;
      }).indexOf(id);
      if (arg.indexOf('#') > -1){
        var j = doc.groundings[i].preview.map(function(p){
          return p.anchor.toString();
        }).indexOf(anchor);
        if (i > -1 && j > -1) doc.groundings[i].preview.splice(j, 1)
      } else {
        if (i > -1) doc.groundings.splice(i, 1);
      }
    break;
  }
  return [doc, 'Memo updated']
}
