function(o) {
  if (o.fullname){
    emit(o._id, {'_id': o._id, 'fullname': o.fullname});
    var atoms = o.fullname.split(' '); 
    for (i in atoms) {
      emit(atoms[i], {'_id': o._id, 'fullname': o.fullname});
    }
  }
}
