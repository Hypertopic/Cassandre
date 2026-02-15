function (doc, req) {
  let o = JSON.parse(req.body),
      i = doc.comments.map(c => c.id).indexOf(o.id)
  if (o.text.trim().length > 0) {
    doc.comments[i].text = o.text.replace(/\n( )*\n>/g, "\n>").trim()
    doc.comments[i].date = new Date().toJSON()
    if (doc.comments[i].checked) delete doc.comments[i].checked
  } else {
    doc.comments.splice(i, 1)
  }
  return [doc, 'Comment added']
}
