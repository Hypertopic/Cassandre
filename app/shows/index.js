function(o, req) {
  // !json templates.index
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  provides('json', function() {
    return {
      body: JSON.stringify({
        service: 'Cassandre',
        revision: '3.20.06.06',
        update_seq: req.info.update_seq
      })
    }
  });
  provides('html', function() {
    return {
      body: Mustache.to_html(templates.index, {i18n: localized()}, shared)
    }
  });
}
