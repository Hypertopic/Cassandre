function(o) {
  let diary = o.diary || o.corpus,
      type = o.type || 'transcript',
      name = o.name || '...',
      contributors = [],
      users = []
  if (typeof o.readers === "undefined" || o.readers.length == 0) {
    contributors.push(null)
  } else {
    contributors = o.readers
  }
  if (typeof o.contributors !== "undefined") contributors = contributors.concat(o.contributors)
  contributors = contributors.sort()
  users = contributors.filter(function(item, pos, ary) {return !pos || item != ary[pos - 1];} )
  if (!o.commented && !o.diary_name) {
    for (var user of users) {
      let obj = {
        id: o._id,
        name: name
      }
      if (type == 'diagram') {
        obj.groundings = o.groundings
        obj.link = o.link
      }
      emit([diary, user, type, name], obj)
    }
  }
}
