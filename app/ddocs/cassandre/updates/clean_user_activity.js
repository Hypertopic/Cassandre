function (user, req) {
  var body = JSON.parse(req.body),
      diary = body.order,
      memos = body.memos,
      i = 0, j = 0, k = 0
  for (i = 0; i < memos.length; i++) {
    var j = user.activity.map(function(a) {return a.doc;}).indexOf(memos[i])
    if (j > -1) user.activity.splice(j, 1)
  }
  var k = user.order.map(function(a) {return a.diary;}).indexOf(diary)
  if (k > -1) {
    if (user.order[k].collection && user.order[k].collection.length > 0) {
      user.order.splice(k, 1, {
        diary: diary,
        collection: user.order[k].collection
      })
    } else {
      user.order.splice(k, 1)
    }
  }
  return [user, 'UserDoc updated']
}
