function(o, req){
  // !json templates.memo
  // !code lib/mustache.js
  // !code l10n/l10n.js
  const ALPHA = /[a-zàâçéêèëïîôöüùû0æœ0-9]+|[^a-zàâçéêèëïîôöüùûæœ0-9]+/gi;
  const SPACES = /^ +$/;

  var type = o.type || 'field';
  var diary = o.diary || o.corpus;
  var data = {
    i18n: localized(),
    _id: o._id,
    _rev: o._rev,
    diary: diary,
    type: type,
    name: o.name,
    date: o.date,
    user: o.user,
    body: [],
    groundings: [],
    comments: [],
    leaves: []
  }
  if (o.body) {
    var content = {
      text: o.body
    };
    data.body.push(content);
  } else {
    for each (var s in o.speeches) {
      var content = {
        actor: s.actor,
        timestamp: s.timestamp,
        words: []
      };
      for each (var w in s.text.match(ALPHA)) {
        if (w.match(SPACES) && content.words.length>0) {
          w = content.words.pop() + w;
        }
        content.words.push(w);
      }
      data.body.push(content);
    }
  }
  for each (var g in o.groundings) {
    var grounding = {
      id: g.value
    };
    data.groundings.push(g);
  }
  for each (var c in o.comments) {
    var comment = {
      user: c.user,
      date: c.date,
      text: c.text
    };
    data.comments.push(comment);
  }
  return Mustache.to_html(templates.memo, data);
}
