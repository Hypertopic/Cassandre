function(keys,values) {
  var this_word = 0;
  var in_docs = 0;
  for each (v in values) {
    this_word += v.this;
    in_docs += v.in;
  }
  return {
    "this":this_word,
    "in":in_docs
  };
}
