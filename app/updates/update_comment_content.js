function (doc, req) {
  doc.text = req.body;
  doc.user = req.userCtx.name,
  doc.date = new Date().toJSON()
  delete doc.checked;
  return [doc, 'Comment updated']
}
