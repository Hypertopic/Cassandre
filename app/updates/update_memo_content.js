function (doc, req) {
  if (req.body !== 'false') doc.body = req.body;
  if (!doc.history) doc.history = [];
  doc.history.push({
    "user": req.userCtx.name,
    "date": new Date().toJSON()
  });
  doc.body = doc.body.replace(/\t/g, " ");
  if (doc.type == "interview") doc.body = doc.body.replace(/  +/g, " ").replace(/\n \n /g, "\n \n");
  delete doc.editing;
  return [doc, 'Memo updated']
}
