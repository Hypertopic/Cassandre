/*
  l10n.js — Localisation templates in JavaScript
*/
function local(str) {
    if (req.headers["Accept-Language"].indexOf('fr')>-1) {
      var dico = l10n.francais ;
      for ( key in dico ) {
        str = str.replace( new RegExp( key.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1") , 'g' ), dico[ key ] );
      }
    }
  return str;
}

