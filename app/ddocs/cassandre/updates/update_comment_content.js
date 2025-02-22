function (doc, req) {
  if (req.body.length > 0) {
    doc.text = req.body
  } else {
    doc._deleted = true
  }
  doc.user = req.userCtx.name
  doc.date = new Date().toJSON()
  delete doc.checked;
  return [doc, 'Comment updated']
}
