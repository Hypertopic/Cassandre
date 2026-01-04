function (doc, req) {
  if (!doc.editing) doc.editing = {
    "user": req.userCtx.name,
    "date": new Date().toJSON()
  }
  return [doc, 'Editing memo']
}
