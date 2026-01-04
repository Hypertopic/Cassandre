function (u, req) {
  if (req.body.length > 0) {
    u.avatar = req.body
  } else {
    delete u.avatar
  }
  return [u, 'Avatar updated']
}
