function(o, req) {
  // !json templates.index
  // !code l10n/l10n.js
  if('Accept' in req.headers && req.headers['Accept'].indexOf('json')>0) {
    return {
      body: JSON.stringify({
        service: 'Cassandre', 
        revision: '2.13.12.28',
        update_seq: req.info.update_seq
      }), headers: { 
        "Content-Type": "application/json",
      }
    }
  } else {
    return {
      body: local(templates.index),
      headers: { 
        "Content-Type": "text/html",
      }
    }
  }
}
