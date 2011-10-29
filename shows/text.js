function(o, req){
  // !json templates.text
  // !code lib/mustache.js
  const ALPHA = /[a-zàâçéêèëïîôöüùû0-9]+|[^a-zàâçéêèëïîôöüùû0-9]+/gi;
  if (req.query.corpus!=o.corpus) {
    return {
      "code": 302, 
      "headers":{ "Location": "../" + o.corpus + "/" + o._id }
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
      speech.words.push(w);
    }
    data.speeches.push(speech);
  }
  return Mustache.to_html(templates.text, data);
}
