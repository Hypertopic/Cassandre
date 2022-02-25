function(o) {
  var diary = o.diary || o.corpus,
      type = o.type || 'transcript',
      name = o.name || '...',
      contributors = [].concat(o.readers, o.contributors).sort(),
      users = [];
  if (typeof o.readers === "undefined" || o.readers.length == 0) contributors.push(null);
  users = contributors.filter(function(item, pos, ary) {return !pos || item != ary[pos - 1];} );
  if (!o.commented && !o.diary_name) {
    for (var user of users) {
      var obj = {
        id: o._id,
        name: name
      };
      if (type == 'diagram') {
        obj.groundings = o.groundings;
        obj.link = o.link;
      }
      emit([diary, user, type, name], obj);
    }
  }
}
