function (doc, req) {
  let o = JSON.parse(req.body),
      id = doc.comments.length+'-'+Math.floor(Math.random() * 10)+Math.floor(Math.random() * 10),
      text = o.text.replace(/\n( )*\n>/g, "\n>").trim(),
      added_comment = {
        id: id,
        date: new Date().toJSON(),
        text: text
      }
  if (o.anchor && o.anchor > 0) added_comment.anchor = o.anchor
  if (o.text.trim().length > 0) doc.comments.push(added_comment)
  return [doc, 'Comment added']
}
