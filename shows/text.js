function(o, req){
  // !json templates.text
  // !json l10n.francais  
  // !code lib/mustache.js
  // !code l10n/l10n.js
  const ALPHA = /[a-zàâçéêèëïîôöüùû0æœ0-9]+|[^a-zàâçéêèëïîôöüùûæœ0-9]+/gi;
  const SPACES = /^ +$/;
  if (req.query.corpus!=o.corpus) {
    return {
      "code": 302, 
      "headers":{ "Location": "../" + o.corpus + "/" + o._id }
    };
  }
  if (o.draft) {
    return {
      "code": 302, 
      "headers":{ "Location": "../../editable_text/" + o._id }
    };
  }
  var data = {
    _id: o._id,
    corpus: o.corpus,
    name: o.name,
    speeches: []
  }
  for each (var s in o.speeches) {
    var speech = {
      actor: s.actor,
      timestamp: s.timestamp,
      words: []
    };
    for each (var w in s.text.match(ALPHA)) {
      if (w.match(SPACES) && speech.words.length>0) {
        w = speech.words.pop() + w;
      }
      speech.words.push(w);
    }
    data.speeches.push(speech);
  }
  return Mustache.to_html(local(templates.text), data);
}
