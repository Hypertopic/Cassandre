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
      if (doc.groundings.indexOf(obj.value) == -1) doc.groundings.push(obj.value);
      if (doc.type == 'coding') doc.body = doc.body + '\n \n>'+obj.highlight+' \n \n';
    break;
    case ('remove_grounding'):
      var i = doc.groundings.indexOf(obj.value);
      if (i > -1) doc.groundings.splice(i, 1);
    break;
  }
  return [doc, 'Memo updated']
}
