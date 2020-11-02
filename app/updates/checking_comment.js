function (doc, req) {
  if (!doc.checked || doc.checked == '') {
    doc.checked = req.body;
  } else {
    delete doc.checked;
  }
  return [doc, 'Comment (un)checked']
}
