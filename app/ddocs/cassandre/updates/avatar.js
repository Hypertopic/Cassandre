function (u, req) {
  u.avatar = req.body;
  return [u, 'Avatar updated']
}
