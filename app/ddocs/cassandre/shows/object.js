function(o, req){
  // !code l10n/l10n.js
  var i18n = localized(),
      body = i18n["i_nothing-to-show"],
      username = req.userCtx.name,
      authorized = !o.readers || o.readers.indexOf(username)>-1 || o.contributors && o.contributors.indexOf(username)>-1 || req.userCtx.roles.indexOf("_admin")>-1
  if (username == null) body += '. '+i18n["i_sign-in-for-more"]
  if (!authorized) {
    return {
      "code": 401,
      "body": body
    }
  }
  else return toJSON(o)
}
