function (doc, req) {
  doc.readers.splice(doc.readers.indexOf(req.userCtx.name), 1);
  if (doc.readers.length == 0) {
    if ((typeof doc.history[0].user !== 'undefined') && (doc.history[0].user !== req.userCtx.name)) {
      doc.readers.push(doc.history[0].user);
    } else {
      doc.readers.push(doc.contributors[0]);
    }
  }
  return [doc, 'User removed']
}
