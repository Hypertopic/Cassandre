function (doc, req) {
  if (doc.diary == req.query.id && doc.type == 'diagram') {
    return true
  }
  return false
}
