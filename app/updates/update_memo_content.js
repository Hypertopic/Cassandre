function (doc, req) {
  if (req.body !== 'false') doc.body = req.body;
  if (!doc.history) doc.history = [];
  doc.history.push({
    "user": req.userCtx.name,
    "date": new Date().toJSON()
  });
  delete doc.editing;
  return [doc, 'Memo updated']
}
