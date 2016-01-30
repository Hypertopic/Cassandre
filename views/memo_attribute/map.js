function(o) {
  if (o.diary) {
    var diary = o.diary;
    emit([diary], {
      id: o._id,
      name: o.name,
      type: o.type,
      date: o.date,
      preview: o.body.substr(0, 200)
    });
  } else if (o.name) {
    var diary = o.corpus;
    var date = o.date || '';
    var preview = o.speeches[0].text.substr(0, 200) || '';
    emit([diary], {
      id: o._id,
      name: o.name,
      type: 'field',
      date: date,
      preview: preview
    });
  }
}
