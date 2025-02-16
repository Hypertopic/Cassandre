function (o) {
  if (o.name && !o.editing) {
    const KEYWORD_LENGTH = 25;
    const OFFSET = 35;
    const FRAME = 80;
    const WORD_MATCHER = /\\[nt]|[^\s,;:\.!?…—–)(\][}{`'‘’"″“”«»&%<>€$*/+-]+/gi;
    var body = [{'text': o.name}],
        diary = o.diary || o.corpus,
        speech_begin = 1,
        type = o.type || 'transcript';
    if (o.speeches) {
      body = body.concat(o.speeches);
    } else if (o.body) {
      body = body.concat(o.body.split("\n \n").map(function(i){
        return {'text': i+'  '};
      }));
    } else if (o.statement) {
      body = body.concat([{'text': o.statement}])
    }
    for (var [p, speech] of Object.entries(body || {})) {
      var speech_text = speech.text;
      var speech_end = speech_begin + speech_text.length
        + (speech.actor? speech.actor.length : 0)
        + (speech.timestamp? speech.timestamp.length : 0);
      var match;
      while ((match = WORD_MATCHER.exec(speech_text))) {
        var keyword = speech_text.substr(match.index, KEYWORD_LENGTH);
        var context_begin = match.index - OFFSET;
        var context_length = FRAME;
        if (context_begin<0) {
          context_length += context_begin;
          context_begin = 0;
        }
        var value = {
          title: o.name,
          type: type,
          context: speech_text.substr(context_begin, context_length),
          begin: speech_begin,
          end: speech_end,
          par: p,
          match: speech_begin + match.index
        };
        emit([diary, keyword], value);
      }
      speech_begin = speech_end + 1;
    }
  }
}
