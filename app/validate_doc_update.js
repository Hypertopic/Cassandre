function(o2, o, userCtx) {

  if (userCtx.roles.indexOf("_admin")!=-1) 
    return; 

  else if (o && o.contributors && o.contributors.indexOf(userCtx.name)==-1) {
    var one = o,
        two = o2;
    delete one.readers;
    delete two.readers;
    if (JSON.stringify(one) === JSON.stringify(two)) return;

    throw({
      unauthorized: 'User ' + userCtx.name
        + ' is not authorized to edit this document!'
    });
  }
}
