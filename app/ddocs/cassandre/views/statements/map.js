function(o) {
  var contributors = [];
  if (typeof o.readers !== "undefined") contributors = o.readers;
  if (typeof o.contributors !== "undefined") contributors = contributors.concat(o.contributors);
  contributors = contributors.sort();  
  var users = contributors.filter(function(item, pos, ary) {return !pos || item != ary[pos - 1];} );
  if (users.indexOf(null) == -1 && o.readers && o.readers.length == 0) users.push(null);
  if (o.nodes)
    for (var u of users) {
      emit([o.diary, u, 'L'], {'id': o._id, 'name': o.name});
    }
  if (o.statement && o.statement.length > 0) {
    for (var u of users) {
      emit([o.diary, u, 'S', o.name], {'_id': o._id});
    }
  }
}
