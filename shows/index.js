function(o, req) {
  // !json templates.index
  // !code lib/mustache.js
  // !code l10n/l10n.js
  if('Accept' in req.headers && req.headers['Accept'].indexOf('json')>0) {
    return {
      body: JSON.stringify({
        service: 'Cassandre', 
        revision: '2.14.08.27',
        update_seq: req.info.update_seq
      }), headers: { 
        "Content-Type": "application/json",
      }
    }
  } else {
    return {
      body: Mustache.to_html(templates.index, {i18n: localized()}),
      headers: { 
        "Content-Type": "text/html",
      }
    }
  }
}
