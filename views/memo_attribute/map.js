function(o) {
  if (o.diary) {
    var diary = o.diary || o.corpus;
    emit([diary], {
      id: o._id,
      name: o.name,
      type: o.type,
      date: o.date,
      preview: o.body.substr(0, 200)
    });
  } else if (o.name) {
    var diary = o.corpus;
    var preview = o.speeches[0].text.substr(0, 200) || '';
    emit([diary], {
      id: o._id,
      name: o.name,
      type: 'field',
      date: o.date,
      preview: preview
    });
  }
}
