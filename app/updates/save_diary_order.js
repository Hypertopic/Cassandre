function (user, req) {
  if (!user.contributors) user.contributors = [req.userCtx.name];
  if (!user.activity) user.activity = [];
  if (!user.order) user.order = [];
  var obj = JSON.parse(req.body);
  var i = -1, j = 0;
  for (j = 0; j < user.order.length; j++) {
    if (user.order[j].diary === obj.diary) i = j;
  }
  if (i > -1) {
    user.order.splice(i, 1, obj);
  } else {
    user.order.push(obj);
  }
  return [user, 'Order saved']
}
