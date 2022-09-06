function (doc, req) {
  var obj = JSON.parse(req.body);
  switch(obj.action) {
    case ('add_grounding'):
      var i = doc.groundings.map(function(g){
        if (g._id) {return g._id} else return g;
      }).indexOf(obj.value);
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
        if (i == -1) doc.groundings.push(obj.value);
      }
    break;
    case ('remove_grounding'):
      var arg = obj.value,
         [id, anchor] = arg.split('#');
      if (anchor) [anchor, index] = anchor.split('_');
      var i = doc.groundings.map(function(g){
        if (g._id) {return g._id} else return g;
      }).indexOf(id);
      if (anchor){
        var j = doc.groundings[i].preview.map(function(p, i){
          if (i == index) return p.anchor.toString();
        }).indexOf(anchor);
        if (i > -1 && j > -1) doc.groundings[i].preview.splice(j, 1)
      } else {
        if (i > -1) doc.groundings.splice(i, 1);
      }
    break;
  }
  return [doc, 'Grounding updated']
}
