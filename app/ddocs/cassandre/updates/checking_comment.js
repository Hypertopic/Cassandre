function (doc, req) {
  var o = JSON.parse(req.body)
  if (!doc.comments) {
    if (!doc.checked || doc.checked == '') {
      doc.checked = o.fullname
    } else {
      delete doc.checked
    }
  } else {
    var i = doc.comments.map(x => x.id).indexOf(o.id)
    if (!doc.comments[i].checked || doc.comments[i].checked == '') {
      doc.comments[i].checked = o.fullname
    } else {
      delete doc.comments[i].checked
    }
  }
  return [doc, 'Comment (un)checked']
}
