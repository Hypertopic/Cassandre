function(o, req) {
  return toJSON({'update_seq': req.info.update_seq})
}
