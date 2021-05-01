function (doc, req) {
  if (typeof doc.name !== 'undefined') {
    doc.name = req.body.replace(/\s/g, ' ');
  } else if (typeof doc.diary_name !== 'undefined') doc.diary_name = req.body;
  if (!doc.history) doc.history = [];
  doc.history.push({
    "user": req.userCtx.name,
    "date": new Date().toJSON(),
    "name": req.body
  });
  return [doc, 'Name updated']
}
