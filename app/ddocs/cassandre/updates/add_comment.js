function (doc, req) {
  var id = doc.comments.length+'-'+Math.floor(Math.random() * 10)+Math.floor(Math.random() * 10),
      text = req.body.replace(/\n( )*\n>/g, "\n>").trim()
  var added_comment = {
    id: id,
    date: new Date().toJSON(),
    text: text
  }
  if (req.body.trim().length > 0) doc.comments.push(added_comment)
  return [doc, 'Comment added']
}
