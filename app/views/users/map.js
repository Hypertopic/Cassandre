function(o) {
  if (o.fullname){
    var allowed = o.contributors,
        readers = [],
        sortkey = o.fullname.split(' ')[1].substr(0, 3);
    if (o.readers) allowed = [].concat(o.readers, o.contributors).sort();
    readers = allowed.filter(function(item, pos, ary) {return !pos || item != ary[pos - 1];} );
    for (var r in readers) {
      emit([readers[r], sortkey], {'_id': o._id, 'fullname': o.fullname});
    }
  }
}
