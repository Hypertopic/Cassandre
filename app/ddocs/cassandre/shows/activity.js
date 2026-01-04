function(o, req){
  // !json templates.activity
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  var username = req.userCtx.name
  var data = {
    diary: o._id,
    diary_name: o.diary_name,
    i18n: localized(),
    list: true,
    locale: req.headers["Accept-Language"].substring(0,2),
    logged: username,
    logged_fullname: username
  }
  return Mustache.to_html(templates.activity, data, shared)
}
