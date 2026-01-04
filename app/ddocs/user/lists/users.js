function(head, req) {
  // !json templates.users
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js

  start({"headers":{"Content-Type":"text/html;charset=utf-8"}})
  var data = {
    i18n: localized(),
    list: true,
    locale: req.headers["Accept-Language"].split(',')[0].substring(0,2),
    logged: req.userCtx.name,
    users: []
  }
  while (r = getRow()) {
    data.users.push({
      id: r.value._id,
      fullname: r.value.fullname
    })
  }
  provides("json", function() {
    send(toJSON(data.users))
  })
  provides("html", function() {
    return Mustache.to_html(templates.users, data, shared)
  })
}
