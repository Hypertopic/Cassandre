function (doc, req) {
  var body = JSON.parse(req.body),
      o = body.action;
  doc.groundings = body.gid;
  switch(Object.keys(o)[0]) {
    default:
      if (doc.groundings.indexOf(o.grounding) == -1 && doc.groundings.length < 2) doc.groundings.push(o.grounding);
    break;
    case('first'):
      doc.first = o.first;
    break;
    case('link'):
      doc.link = o.link;
    break;
    case('rename'):
    break;
    case('statement'):
      doc.statement = o.statement;
    break;
    case('situation'):
      doc.situation = o.situation;
    break;
    case('negative'):
      doc.negative = o.negative;
    break;
  }
  doc.name = body.name.replace(/\s/g, ' ');
  doc.groundings = doc.groundings.sort();
  if (!doc.history) doc.history = [];
  if (['rename', 'first', 'link'].indexOf(Object.keys(o)[0]) == -1) doc.history.push({
    "user": req.userCtx.name,
    "date": new Date().toJSON()
  });
  return [doc, 'Diagram updated']
}
