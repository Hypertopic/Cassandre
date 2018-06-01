function(o, req){
  var username = req.userCtx.name;
  var authorized = !o.readers || o.readers.indexOf(username)>-1 || o.contributors && o.contributors.indexOf(username)>-1 || req.userCtx.roles.indexOf("_admin")>-1;
  if (!authorized) {
    return {
      "code": 401,
      "body": "You shouldn't be there"
    };
  }
  else return toJSON(o);
}
