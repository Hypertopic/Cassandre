function(o2, o, userCtx) {

  if (userCtx.roles.indexOf("_admin")!=-1) 
    return; 

  else if (o && o.contributors && o.contributors.indexOf(userCtx.name)==-1)
    throw({
      unauthorized: 'User ' + userCtx.name
        + ' is not authorized to edit this document!'
    });
}
