function (doc, req) {
  if (!doc.contributors) doc.contributors = [req.userCtx.name];
  if (!doc.activity) doc.activity = [];
  var obj = {
    'doc': req.body,
    'date': new Date().toJSON()
  };
  var i = -1, j = 0;
  for (j = 0; j < doc.activity.length; j++) {
    if (doc.activity[j].doc === req.body) i = j;
  }
  if (i > -1) {
    doc.activity.splice(i, 1, obj);
  } else {
    doc.activity.push(obj);
  }
  return [doc, 'Memo was read']
}
