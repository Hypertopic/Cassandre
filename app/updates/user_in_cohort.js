function (user, req) {
  if (!user.contributors) user.contributors = [req.userCtx.name];
  if (!user.activity) user.activity = [];
  if (!user.order) user.order = [];
  var obj = JSON.parse(req.body);
  var i = -1, j = 0, done = 0;
  for (j = 0; j < user.order.length; j++) {
    if (user.order[j].cohort === obj.cohort) {
      if (obj.remove === 'true') {
        var k = user.order[j].users.indexOf(obj.user);
        if (k > -1) {
          user.order[j].users.splice(k, 1);
          done++;
        }
      } else {
        user.order[j].users.push(obj.user);
        done++;
      }
    }
  }
  if (done == 0) user.order.push({
    'cohort': obj.cohort,
    'users': [obj.user]
  });
  return [user, 'Order saved']
}
