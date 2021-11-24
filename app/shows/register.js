function(o, req) {
  // !json templates.register
  // !code lib/mustache.js
  // !code l10n/l10n.js
  // !code lib/shared.js
  provides('html', function() {
    return {
      body: Mustache.to_html(templates.register, {i18n: localized()}, shared)
    }
  });
}
