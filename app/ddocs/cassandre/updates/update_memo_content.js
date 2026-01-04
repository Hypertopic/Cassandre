function (doc, req) {
  var obj = JSON.parse(req.body),
      history = {
    "user": req.userCtx.name,
    "date": new Date().toJSON()
  }
  if (obj.body !== 'false') doc.body = obj.body
  if (obj.name !== 'false' && doc.name !== obj.name) {
    doc.name = obj.name
    history.name = obj.name
  }
  if (!doc.history) doc.history = []
  doc.history.push(history)
  doc.body = doc.body.replace(/\t/g, " ")
  if (doc.type == "interview") doc.body = doc.body.replace(/  +/g, " ").replace(/\n \n /g, "\n \n")
  delete doc.editing
  return [doc, 'Memo updated']
}
