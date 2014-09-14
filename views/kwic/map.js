function (o) {
  if (!o.draft) {
    const KEYWORD_LENGTH = 25;
    const OFFSET = 35;
    const FRAME = 80;
    const WORD_MATCHER = /\\[nt]|[^\s,;:\.!?…—–)(\][}{`'‘’"″“”«»&%<>€$*/+-]+/gi;
    var speech_begin = (o.name? o.name.length : 0) + 1;
    for (var p in o.speeches) {
      var speech = o.speeches[p];
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
          context: speech_text.substr(context_begin, context_length),
          begin: speech_begin,
          end: speech_end,
          match: speech_begin + match.index
        };
        emit([o.corpus, keyword], value);
        // emit([o._id, keyword], value);
      }
      speech_begin = speech_end + 1;
    }
  }
}
