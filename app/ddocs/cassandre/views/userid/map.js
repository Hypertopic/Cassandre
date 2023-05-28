function(o) {
  if (o.fullname){
    emit(o._id, {'_id': o._id, 'fullname': o.fullname});
    var atoms = o.fullname.split(' '); 
    for (var a of atoms) {
      emit(a, {'_id': o._id, 'fullname': o.fullname});
    }
  }
}
