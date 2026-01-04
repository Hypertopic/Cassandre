function (doc, req) {
  if ((!doc.commented && !doc.user_activity && doc.diary == req.query.id) || (doc.diary_name && doc._id == req.query.id)) {
    return true
  }
  return false
}
