function (doc, req) {
  if (req.body.trim().length > 0) {
    doc.text = req.body.trim()
  } else {
    doc._deleted = true
  }
  doc.user = req.userCtx.name
  doc.date = new Date().toJSON()
  delete doc.checked
  return [doc, 'Comment updated']
}
