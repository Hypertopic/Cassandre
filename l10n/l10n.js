/*
  l10n.js — Localisation templates in JavaScript
*/

function local(str) {
    //TODO: We need a condition able to detect browser accepted langage 
    if (true) {
      var dico = l10n.francais ;
      for ( key in dico ) {
        str = str.replace( new RegExp( key, 'g' ), dico[ key ] );
      }
    }
  return str;
}

