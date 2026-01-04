function (doc, req) {
  doc.fullname = req.body
  return [doc, 'Username updated']
}
