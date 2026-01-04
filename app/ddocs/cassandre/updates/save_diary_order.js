function (o, req) {
  o.memo_order = req.body
  return [o, 'Order saved']
}
