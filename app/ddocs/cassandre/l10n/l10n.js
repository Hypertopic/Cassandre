// !json l10n.i18n

function localized() {
  var available = "en";
  var required = req.headers["Accept-Language"];
  if (required) {
    for (var i in required.split(",")) {
      var l = required.split(",")[i],
          preferred = l.substring(0,2);
      if (l10n.i18n.hasOwnProperty(preferred)) {
        available = preferred;
        break;
      }
    }
  }
  return l10n.i18n[available];
}
