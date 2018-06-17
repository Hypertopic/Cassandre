function (doc, req) {
  if (doc._id == req.query.id || doc.commented == req.query.id) {
    return true;
  }
  return false;
}
