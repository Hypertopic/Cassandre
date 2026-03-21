function(o, req) {
  // !json templates.index
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  var revision = '3.26.03.21'
  provides('json', function() {
    return {
      body: JSON.stringify({
        service: 'Cassandre',
        revision: revision,
        update_seq: req.info.update_seq
      })
    }
  })
  provides('html', function() {
    var data = {
      i18n: localized(),
      locale: req.headers["Accept-Language"].split(',')[0].substring(0,2),
      revision: revision
    }
    return {
      body: Mustache.to_html(templates.index, data, shared)
    }
  })
}
