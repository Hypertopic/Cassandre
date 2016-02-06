function(o) {
  var diary = o.diary || o.corpus;
  var type = o.type || 'field';
  var date = o.date || ' ';
  var name = o.name || ' ';
  if (o.body) {var preview = o.body.substr(0, 200);
  } else {
  if (o.speeches) {
    var preview = o.speeches[0].text.substr(0, 200) || ' ';
    } else {
    var preview = ' ';
    }
  }
  emit([diary], {
    id: o._id,
    name: name,
    type: type,
    date: date,
    preview: preview
  });
}
