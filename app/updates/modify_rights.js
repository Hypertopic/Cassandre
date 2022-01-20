function (doc, req) {
  var obj = JSON.parse(req.body);
  switch(obj.action) {
    case ('add_contributor'):
      if (!doc.contributors) doc.contributors = [];
      if (doc.contributors.indexOf(obj.value) == -1) doc.contributors.push(obj.value);
    break;
    case ('remove_contributor'):
      if (doc.contributors.length == 1) {
        delete doc.contributors;
      } else {
        var i = doc.contributors.indexOf(obj.value);
        doc.contributors.splice(i, 1);
      }
    break;
    case ('add_reader'):
      if (!doc.readers) doc.readers = [];
      if (doc.readers.indexOf(obj.value) == -1) doc.readers.push(obj.value);
    break;
    case ('remove_reader'):
      if (doc.readers.length == 1) {
        delete doc.readers;
      } else {
        var i = doc.readers.indexOf(obj.value);
        doc.readers.splice(i, 1);
      }
    break;
  }
  if (doc.contributors && doc.readers && doc.readers.length > 1) {
    for (var r = 0; r < doc.readers.length; r++) {
      if(doc.contributors.indexOf(doc.readers[r]) > -1) doc.readers.splice(r, 1);
    }
  }
  if (doc.contributors && doc.readers) {
    for (var c = 0; c < doc.contributors.length; c++) {
      var r = doc.readers.indexOf(doc.contributors[c]);
      if (r > -1 && doc.readers.length > 1) doc.readers.splice(r, 1);
    }
  }
  return [doc, 'Rights updated']
}
