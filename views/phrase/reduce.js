function(keys, values, combine) {
  if (combine) {
    return sum(values);
  } else {
    return values.length;
  }
}
