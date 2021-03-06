function(o) {
  var contributors = [].concat(o.readers, o.contributors).sort();
  var users = contributors.filter(function(item, pos, ary) {return !pos || item != ary[pos - 1];} );
  if (users.indexOf(null) == -1 && o.readers && o.readers.length == 0) users.push(null);
  if (o.nodes)
    for (i in users) {
      emit([o.diary, users[i], 'L'], {'id': o._id, 'name': o.name});
    }
  if (o.statement && o.statement.length > 0) {
    for (i in users) {
      emit([o.diary, users[i], 'S', o.name], {'_id': o._id});
    }
  }
}
