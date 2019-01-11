function (doc, req) {
  if (doc.diary == req.query.id) {
    return true;
  }
  return false;
}
