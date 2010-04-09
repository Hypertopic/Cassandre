function(keys,values) {
  var this_word = 0;
  var on_words = 0;
  var in_docs = 0;
  for each (v in values) {
    this_word += v.this;
    on_words += v.on;
    in_docs += v.in;
  }
  return {
    "this":this_word,
    "on":on_words,
    "in":in_docs
  };
}
